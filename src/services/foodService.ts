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
      throw handleError(error)
    }
  }

  async getFoodById(id: number): Promise<Food> {
    try {
      const food = await this.foodRepository.findOne({
        where: { id },
        relations: ['nutritions', 'source', 'brand', 'ingredients'],
      })

      if (!food) throw createError(404, `Food with ID ${id} not found.`)

      return food
    } catch (error) {
      throw handleError(error)
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
      throw handleError(error)
    }
  }

  async searchFoodsAdvanced(
    name?: string,
    nutrients?: NutrientFilter[],
    limit: number = 20
  ): Promise<Food[]> {
    try {
      const query = this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.nutritions', 'nutrition')
        .take(limit)

      // Filtrera på namn om det anges
      if (name) {
        query.andWhere('food.name ILIKE :name', { name: `%${name}%` })
      }

      // Om näringsämnen anges, filtrera med separata sub-queries för varje nutrient
      if (nutrients && nutrients.length > 0) {
        nutrients.forEach((nutrientFilter, index) => {
          query.andWhere(
            `EXISTS (
              SELECT 1 FROM nutritions n${index}
              WHERE n${index}.food_id = food.id
              AND n${index}.name ILIKE :nutrientName${index}
              AND (COALESCE(:minValue${index}::FLOAT, -1) = -1 OR n${index}.value >= :minValue${index})
              AND (COALESCE(:maxValue${index}::FLOAT, -1) = -1 OR n${index}.value <= :maxValue${index})
            )`,
            {
              [`nutrientName${index}`]: `%${nutrientFilter.nutrient}%`,
              [`minValue${index}`]: nutrientFilter.min ?? -1,
              [`maxValue${index}`]: nutrientFilter.max ?? -1,
            }
          )
        })
      }

      const results = await query.getMany()
      return results
    } catch (error) {
      throw handleError(error)
    }
  }
}
