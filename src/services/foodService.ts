import { Food } from '../models/Food'
import { Nutrition } from '../models/Nutrition'
import { Source } from '../models/Source'
import { Brand } from '../models/Brand'
import { Ingredient } from '../models/Ingredient'
import { AppDataSource } from '../config/data-source'
import { NutrientFilter } from '../types/NutrientFilter'
import {
  MoreThan,
  In,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  Repository,
} from 'typeorm'

/**
 * @class FoodService
 * @description Service class for handling food data
 *
 * Provides methods for fetching, filtering, and processing food data
 * from the database. Encapsulates all database access for food items.
 */
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

  /**
   * Fetches a list of food items with pagination
   */
  async getFoods(limit: number = 10, offset: number = 0): Promise<Food[]> {
    return await this.foodRepository.find({
      relations: ['nutritions', 'source', 'brand', 'ingredients'],
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    })
  }

  /**
   * Fetches a specific food item by ID
   */
  async getFoodById(id: number): Promise<Food | null> {
    return await this.foodRepository.findOne({
      where: { id },
      relations: ['nutritions', 'source', 'brand', 'ingredients'],
    })
  }

  /**
   * Fetches food items for cursor-based pagination
   */
  async getFoodsWithCursor(
    limit: number = 10,
    afterId: number = 0
  ): Promise<[Food[], number]> {
    return await this.foodRepository.findAndCount({
      where: afterId ? { id: MoreThan(afterId) } : {},
      order: { id: 'ASC' },
      take: limit,
      relations: ['nutritions', 'source', 'brand', 'ingredients'],
    })
  }

  /**
   * Searches for food items by name
   */
  async findFoodsByName(name: string, limit: number = 200): Promise<number[]> {
    const foodsMatchingName = await this.foodRepository
      .createQueryBuilder('food')
      .select('food.id')
      .where('LOWER(food.name) LIKE LOWER(:query)', {
        query: `%${name}%`,
      })
      .orderBy('food.name', 'ASC')
      .limit(limit)
      .getMany()

    return foodsMatchingName.map((f) => f.id)
  }

  /**
   * Searches for food items based on nutrient filters
   */
  async findFoodsByNutrientFilters(
    filters: NutrientFilter[]
  ): Promise<number[]> {
    const nutrientIdLists: number[][] = []

    for (const filter of filters) {
      const whereClause = this.buildNutrientWhereClause(filter)
      const matches = await this.nutritionRepository.find({
        where: whereClause,
        relations: ['food'],
      })

      const ids = matches.map((n) => n.food.id)
      nutrientIdLists.push(ids)
    }

    // If we don't have any filters, return empty list
    if (nutrientIdLists.length === 0) {
      return []
    }

    // Return the intersection of all IDs (AND logic)
    return nutrientIdLists.reduce((a, b) => a.filter((id) => b.includes(id)))
  }

  /**
   * Fetches food items based on a list of IDs
   */
  async getFoodsByIds(ids: number[], limit: number = 20): Promise<Food[]> {
    // Deduplicate and limit the number of IDs
    const limitedIds = [...new Set(ids)].slice(0, limit)

    return await this.foodRepository.find({
      where: { id: In(limitedIds) },
      relations: ['nutritions'],
    })
  }

  /**
   * Advanced search with combination of name and nutrient filters
   */
  async searchFoodsAdvanced(
    name?: string,
    nutrients?: NutrientFilter[],
    limit: number = 20
  ): Promise<Food[]> {
    let foodIdsByName: number[] | null = null
    let foodIdsByNutrients: number[] | null = null

    // Step 1: Filter by name (if provided)
    if (name) {
      foodIdsByName = await this.findFoodsByName(name)
    }

    // Step 2: Filter by nutrients (if provided)
    if (nutrients?.length) {
      foodIdsByNutrients = await this.findFoodsByNutrientFilters(nutrients)
    }

    // Combine filters
    let finalFoodIds: number[]

    if (foodIdsByName && foodIdsByNutrients) {
      // Match both name and nutrients (AND logic)
      finalFoodIds = foodIdsByName.filter((id) =>
        foodIdsByNutrients!.includes(id)
      )
    } else if (foodIdsByName) {
      finalFoodIds = foodIdsByName
    } else if (foodIdsByNutrients) {
      finalFoodIds = foodIdsByNutrients
    } else {
      // No filters = empty list
      return []
    }

    // Fetch foods based on IDs
    return await this.getFoodsByIds(finalFoodIds, limit)
  }

  /**
   * Helper method to build where clause for nutrient filters
   */
  private buildNutrientWhereClause(filter: NutrientFilter): any {
    const whereClause: any = {}

    if (filter.nutrient) {
      whereClause.name = ILike(`%${filter.nutrient}%`)
    }

    if (filter.category) {
      whereClause.category = filter.category.toLowerCase()
    }

    if (filter.min !== undefined && filter.max !== undefined) {
      whereClause.value = Between(filter.min, filter.max)
    } else if (filter.min !== undefined) {
      whereClause.value = MoreThanOrEqual(filter.min)
    } else if (filter.max !== undefined) {
      whereClause.value = LessThanOrEqual(filter.max)
    }

    return whereClause
  }
}
