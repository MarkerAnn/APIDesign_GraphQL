import { Food } from '../models/Food'
import { Nutrition } from '../models/Nutrition'
import { Source } from '../models/Source'
import { Brand } from '../models/Brand'
import { Ingredient } from '../models/Ingredient'
import { AppDataSource } from '../config/data-source'
import { NutrientFilter } from '../types/NutrientFilter'
import { handleError } from '../utils/errorHandler'
import {
  MoreThan,
  In,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  Repository,
} from 'typeorm'
import createError from 'http-errors'

export class FoodService {
  private foodRepository: Repository<Food>
  private nutritionRepository: Repository<Nutrition>
  private sourceRepository: Repository<Source>
  private brandRepository: Repository<Brand>
  private ingredientRepository: Repository<Ingredient>

  constructor() {
    this.foodRepository = AppDataSource.getRepository(Food)
    this.nutritionRepository = AppDataSource.getRepository(Nutrition)
    this.sourceRepository = AppDataSource.getRepository(Source)
    this.brandRepository = AppDataSource.getRepository(Brand)
    this.ingredientRepository = AppDataSource.getRepository(Ingredient)
  }

  async getFoods(limit: number = 10, offset: number = 0): Promise<Food[]> {
    try {
      return await this.foodRepository.find({
        relations: ['nutritions', 'source', 'brand', 'ingredients'],
        take: limit,
        skip: offset,
        order: { id: 'ASC' },
      })
    } catch (error) {
      throw new createError.InternalServerError('Failed to fetch foods.')
    }
  }

  async getFoodById(id: number): Promise<Food> {
    try {
      const food = await this.foodRepository.findOne({
        where: { id },
        relations: ['nutritions', 'source', 'brand', 'ingredients'],
      })

      if (!food) throw new createError.NotFound(`Food with ID ${id} not found.`)

      return food
    } catch (error) {
      throw error instanceof createError.HttpError
        ? error
        : new createError.InternalServerError('Failed to fetch food by ID.')
    }
  }

  async getFoodsWithCursor(
    limit: number = 10,
    afterId: number = 0
  ): Promise<[Food[], number]> {
    try {
      return await this.foodRepository.findAndCount({
        where: afterId ? { id: MoreThan(afterId) } : {},
        order: { id: 'ASC' },
        take: limit,
        relations: ['nutritions', 'source', 'brand', 'ingredients'],
      })
    } catch (error) {
      throw new createError.InternalServerError(
        'Failed to fetch foods with cursor.'
      )
    }
  }

  async searchFoodsAdvanced(
    name?: string,
    nutrients?: NutrientFilter[],
    limit: number = 20
  ): Promise<Food[]> {
    try {
      const queryBuilder = this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.nutritions', 'nutrition')

      if (name) {
        queryBuilder.where('LOWER(food.name) LIKE LOWER(:name)', {
          name: `%${name}%`,
        })
        console.log('✅ Name filtering applied')
      }

      if (nutrients && nutrients.length > 0) {
        nutrients.forEach((filter, index) => {
          queryBuilder.andWhere(
            `
            EXISTS (
              SELECT 1
              FROM nutritions n
              WHERE n.food_id = food.id
              AND n.name = :nutrient${index}
              AND (n.value <= :max${index} OR :max${index} IS NULL)
              AND (n.value >= :min${index} OR :min${index} IS NULL)
            )
          `,
            {
              [`nutrient${index}`]: filter.nutrient,
              [`max${index}`]: filter.max ?? null,
              [`min${index}`]: filter.min ?? null,
            }
          )
          console.log(`✅ Applying filter for nutrient: ${filter.nutrient}`)
        })
      }

      queryBuilder.take(limit)

      const foods = await queryBuilder.getMany()

      if (!foods.length)
        throw new createError.NotFound('No foods found matching the criteria.')

      console.log('🧬 Foods fetched:', foods)
      return foods
    } catch (error) {
      console.error('Error in searchFoodsAdvanced:', error)
      throw handleError(error)
    }
  }
}
