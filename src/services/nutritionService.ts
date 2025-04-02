import { EntityManager, Repository } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { Nutrition } from '../models/Nutrition'
import { Food } from '../models/Food'
import createError from 'http-errors'
import { validateNutritionData } from '.../../utils/validateNutritionData'

export class NutritionService {
  private nutritionRepository: Repository<Nutrition>
  constructor() {
    this.nutritionRepository = AppDataSource.getRepository(Nutrition)
  }
  /**
   * Fetch a single nutrition by its ID
   */
  async getNutritionById(id: number): Promise<Nutrition> {
    if (!id || isNaN(id)) {
      throw createError(400, 'Invalid ID provided.')
    }

    const nutrition = await AppDataSource.getRepository(Nutrition).findOneBy({
      id,
    })

    if (!nutrition) {
      throw createError(404, `Nutrition with ID ${id} not found.`)
    }

    return nutrition
  }

  /**
   * Fetch a list of nutritions with optional filtering by category
   */
  async getNutritions(
    limit: number = 10,
    offset: number = 0,
    category?: string[]
  ) {
    if (limit < 1 || offset < 0) {
      throw createError(400, 'Invalid limit or offset value.')
    }

    const query =
      AppDataSource.getRepository(Nutrition).createQueryBuilder('nutrition')

    if (category && category.length > 0) {
      query.where('nutrition.category IN (:...categories)', {
        categories: category,
      })
    }
    return await query.skip(offset).take(limit).getMany()
  }

  async createBasicNutritions(
    foodId: number,
    nutritionData: {
      carbohydrates: number
      protein: number
      fat: number
      kcal: number
    },
    transactionalEntityManager?: EntityManager
  ): Promise<Nutrition[]> {
    // VAlidate nutritionData
    validateNutritionData(nutritionData)

    // Create nutrition objects
    const nutritions = [
      this.createNutrition(
        'Kolhydrater',
        nutritionData.carbohydrates,
        'g',
        'macronutrient',
        foodId
      ),
      this.createNutrition(
        'Protein',
        nutritionData.protein,
        'g',
        'macronutrient',
        foodId
      ),
      this.createNutrition(
        'Fett, totalt',
        nutritionData.fat,
        'g',
        'macronutrient',
        foodId
      ),
      this.createNutrition(
        'Energi (kcal)',
        nutritionData.kcal,
        'kcal',
        'energy',
        foodId
      ),
    ]

    // Använd antingen transaktionsmanagern eller vanlig repository
    if (transactionalEntityManager) {
      return await transactionalEntityManager.save(nutritions)
    } else {
      return await this.nutritionRepository.save(nutritions)
    }
  }

  /**
   * Creates a nutrition object with the given parameters
   */
  private createNutrition(
    name: string,
    value: number,
    unit: string,
    category: string,
    foodId: number
  ): Nutrition {
    const nutrition = new Nutrition()
    nutrition.name = name
    nutrition.value = value
    nutrition.unit = unit
    nutrition.category = category
    nutrition.weightGram = 100 // Per 100g standard value

    // Create a partial Food object reference
    const food = new Food()
    food.id = foodId
    nutrition.food = food

    return nutrition
  }
}
