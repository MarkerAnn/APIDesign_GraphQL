import { EntityManager, Repository, In } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { Nutrition } from '../models/Nutrition'
import { Food } from '../models/Food'
import createError from 'http-errors'
import { validateNutritionData } from '../utils/validateNutritionData'

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

    const nutrition = await this.nutritionRepository.findOneBy({
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

    const query = this.nutritionRepository.createQueryBuilder('nutrition')

    if (category && category.length > 0) {
      query.where('nutrition.category IN (:...categories)', {
        categories: category,
      })
    }
    return await query.skip(offset).take(limit).getMany()
  }

  /**
   * Creates basic nutritional entries for a food item
   *
   * @param foodId - ID of the food to create nutritions for
   * @param nutritionData - Basic nutritional values
   * @param transactionalEntityManager - Optional transaction manager
   * @returns Created nutrition objects
   */
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
    // Validate nutrition data
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

    // Use either transaction manager or regular repository
    if (transactionalEntityManager) {
      return await transactionalEntityManager.save(nutritions)
    } else {
      return await this.nutritionRepository.save(nutritions)
    }
  }

  /**
   * Updates basic nutritional values for a food item
   *
   * @param foodId - ID of the food to update nutritions for
   * @param nutritionData - Nutritional values to update
   * @param transactionalEntityManager - Optional transaction manager
   */
  async updateBasicNutritions(
    foodId: number,
    nutritionData: {
      carbohydrates?: number
      protein?: number
      fat?: number
      kcal?: number
    },
    transactionalEntityManager?: EntityManager
  ): Promise<void> {
    // Skip if no nutrition data to update
    if (!nutritionData || Object.keys(nutritionData).length === 0) {
      return
    }

    // Validate whatever data is provided
    if (Object.values(nutritionData).some((val) => val !== undefined)) {
      // Create complete nutritional data for validation by merging with existing values
      const repo = transactionalEntityManager
        ? transactionalEntityManager.getRepository(Nutrition)
        : this.nutritionRepository
      const existingNutritions = await repo.find({
        where: {
          food: { id: foodId },
          name: In(['Kolhydrater', 'Protein', 'Fett, totalt', 'Energi (kcal)']),
        },
      })

      const nutritionMap = new Map<string, number>()
      for (const nutrition of existingNutritions) {
        nutritionMap.set(nutrition.name, nutrition.value)
      }

      // Create complete nutrition data for validation
      const completeData = {
        carbohydrates:
          nutritionData.carbohydrates ?? nutritionMap.get('Kolhydrater') ?? 0,
        protein: nutritionData.protein ?? nutritionMap.get('Protein') ?? 0,
        fat: nutritionData.fat ?? nutritionMap.get('Fett, totalt') ?? 0,
        kcal: nutritionData.kcal ?? nutritionMap.get('Energi (kcal)') ?? 0,
      }

      // Validate the complete data
      validateNutritionData(completeData)
    }

    // Find existing nutritions
    const repo = transactionalEntityManager
      ? transactionalEntityManager.getRepository(Nutrition)
      : this.nutritionRepository
    const existingNutritions = await repo.find({
      where: {
        food: { id: foodId },
        name: In(['Kolhydrater', 'Protein', 'Fett, totalt', 'Energi (kcal)']),
      },
    })

    // Create a map for easier access
    const nutritionMap = new Map<string, Nutrition>()
    for (const nutrition of existingNutritions) {
      nutritionMap.set(nutrition.name, nutrition)
    }

    // Update each nutrition if provided
    const updatedNutritions: Nutrition[] = []

    if (nutritionData.carbohydrates !== undefined) {
      const nutrition = nutritionMap.get('Kolhydrater')
      if (nutrition) {
        nutrition.value = nutritionData.carbohydrates
        updatedNutritions.push(nutrition)
      }
    }

    if (nutritionData.protein !== undefined) {
      const nutrition = nutritionMap.get('Protein')
      if (nutrition) {
        nutrition.value = nutritionData.protein
        updatedNutritions.push(nutrition)
      }
    }

    if (nutritionData.fat !== undefined) {
      const nutrition = nutritionMap.get('Fett, totalt')
      if (nutrition) {
        nutrition.value = nutritionData.fat
        updatedNutritions.push(nutrition)
      }
    }

    if (nutritionData.kcal !== undefined) {
      const nutrition = nutritionMap.get('Energi (kcal)')
      if (nutrition) {
        nutrition.value = nutritionData.kcal
        updatedNutritions.push(nutrition)
      }
    }

    // Save updated nutritions
    if (updatedNutritions.length > 0) {
      if (transactionalEntityManager) {
        await transactionalEntityManager.save(updatedNutritions)
      } else {
        await this.nutritionRepository.save(updatedNutritions)
      }
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
