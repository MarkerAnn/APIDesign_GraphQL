import { Food } from '../models/Food.js'
import { Nutrition } from '../models/Nutrition.js'
import { Source } from '../models/Source.js'
import { Brand } from '../models/Brand.js'
import { Ingredient } from '../models/Ingredient.js'
import { NutritionService } from './nutritionService.js'
import { AppDataSource } from '../config/data-source.js'
import { NutrientFilter } from '../types/NutrientFilter.js'
import { MoreThan, ILike, Repository } from 'typeorm'
import createError from 'http-errors'

/**
 * Service for handling food-related operations
 *
 * This service provides methods for fetching, creating, updating, and deleting
 * food items in the database, including related nutritional information.
 */
export class FoodService {
  private foodRepository: Repository<Food>
  private nutritionRepository: Repository<Nutrition>
  private sourceRepository: Repository<Source>
  private brandRepository: Repository<Brand>
  private ingredientRepository: Repository<Ingredient>
  private nutritionService: NutritionService

  constructor() {
    this.foodRepository = AppDataSource.getRepository(Food)
    this.nutritionRepository = AppDataSource.getRepository(Nutrition)
    this.sourceRepository = AppDataSource.getRepository(Source)
    this.brandRepository = AppDataSource.getRepository(Brand)
    this.ingredientRepository = AppDataSource.getRepository(Ingredient)
    this.nutritionService = new NutritionService()
  }

  /**
   * Retrieve foods with pagination
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
   * Retrieve a single food by ID
   */
  async getFoodById(id: number): Promise<Food> {
    const food = await this.foodRepository.findOne({
      where: { id },
      relations: ['nutritions', 'source', 'brand', 'ingredients'],
    })

    if (!food) throw createError(404, `Food with ID ${id} not found.`)

    return food
  }

  /**
   * Get foods using cursor-based pagination
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
   * Search for foods with advanced filtering options
   */
  async searchFoodsAdvanced(
    name?: string,
    nutrients?: NutrientFilter[],
    limit: number = 20
  ): Promise<Food[]> {
    const query = this.foodRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.nutritions', 'nutrition')
      .take(limit)

    // Filter by name if provided
    if (name) {
      query.andWhere('food.name ILIKE :name', { name: `%${name}%` })
    }

    // If nutritions are provided, filter by them, using subqueries
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

    return await query.getMany()
  }

  /**
   * Create a new food item with basic nutritional information
   *
   * @param name Name of the food
   * @param userId ID of the user creating the food
   * @param sourceId Source ID (defaults to 2 for user-created foods)
   * @param nutritionData Basic nutritional data (carbs, protein, fat, kcal)
   * @param brandName Optional brand name
   * @returns The created food item
   * @throws HTTP 404 error if source or brand not found
   */
  async createFood(
    name: string,
    userId: number,
    sourceId: number = 2,
    nutritionData: {
      carbohydrates: number
      protein: number
      fat: number
      kcal: number
    },
    brandName?: string
  ): Promise<Food> {
    // Use transaction to ensure data integrity
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        // Fetch source from the database
        const source = await this.sourceRepository.findOneBy({ id: sourceId })
        if (!source) {
          throw createError(404, `Source with ID ${sourceId} not found.`)
        }

        let brandId = null

        // If brandName is provided, find the brand
        if (brandName) {
          const brand = await this.brandRepository.findOne({
            where: { name: ILike(brandName) },
          })

          // If brand doesn't exist, throw an error
          if (!brand) {
            throw createError(
              404,
              `Brand with name "${brandName}" not found. Please create it first.`
            )
          }

          brandId = brand.id
        }

        // Create and save the food
        const food = new Food()
        food.name = name
        food.source_id = sourceId
        food.createdBy = userId
        food.number = null // Set number to null for user-created foods
        if (brandId) food.brand_id = brandId

        // Save the food first to get an ID
        const savedFood = await transactionalEntityManager.save(food)

        // Create basic nutrition entries using the nutrition service
        await this.nutritionService.createBasicNutritions(
          savedFood.id,
          nutritionData,
          transactionalEntityManager
        )

        // Get and return the saved food with relations
        const finalFood = await transactionalEntityManager.findOne(Food, {
          where: { id: savedFood.id },
          relations: ['nutritions', 'source', 'brand', 'ingredients'],
        })

        if (!finalFood) {
          throw createError(
            500,
            `Failed to fetch newly created food with ID ${savedFood.id}`
          )
        }

        return finalFood
      }
    )
  }

  /**
   * Update an existing food item and its nutritional values
   *
   * @param id Food ID to update
   * @param data Food properties to update
   * @param nutritionData Optional nutrition values to update
   * @returns The updated food with relations
   */
  async updateFood(
    id: number,
    data: Partial<Food>,
    nutritionData?: {
      carbohydrates?: number
      protein?: number
      fat?: number
      kcal?: number
    }
  ) {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        // Find the food entity using the repository
        const food = await this.foodRepository.findOneBy({ id })
        if (!food) throw createError(404, `Food with ID ${id} not found.`)

        if (data.source_id) {
          const source = await this.sourceRepository.findOneBy({
            id: data.source_id,
          })
          if (!source)
            throw createError(
              404,
              `Source with ID ${data.source_id} not found.`
            )
          food.source_id = data.source_id
        }

        if (data.brand_id !== undefined) {
          if (data.brand_id === null) {
            food.brand_id = null
          } else {
            const brand = await this.brandRepository.findOneBy({
              id: data.brand_id,
            })
            if (!brand)
              throw createError(
                404,
                `Brand with ID ${data.brand_id} not found.`
              )
            food.brand_id = data.brand_id
          }
        }

        // Remove number from update data to prevent changes
        if ('number' in data) {
          delete data.number
        }

        // Update basic food properties
        Object.assign(food, data)
        await transactionalEntityManager.save(food)

        // Update nutritional values if provided
        if (nutritionData) {
          await this.nutritionService.updateBasicNutritions(
            food.id,
            nutritionData,
            transactionalEntityManager
          )
        }

        // Get the updated food with relationships INSIDE the transaction
        const updatedFood = await transactionalEntityManager.findOne(Food, {
          where: { id: food.id },
          relations: ['nutritions', 'source', 'brand', 'ingredients'],
        })

        if (!updatedFood) {
          throw createError(
            500,
            `Failed to fetch updated food with ID ${food.id}`
          )
        }

        return updatedFood
      }
    )
  }

  /**
   * Delete a food item and its related nutritions
   */
  async deleteFood(id: number) {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        // Get food with related nutritions for proper cascade delete
        const food = await this.foodRepository.findOne({
          where: { id },
          relations: ['nutritions'],
        })

        if (!food) throw createError(404, `Food with ID ${id} not found.`)

        // Delete related nutritions if needed (TypeORM should handle this with cascade)
        // But if needed explicitly:
        if (food.nutritions && food.nutritions.length > 0) {
          await transactionalEntityManager.remove(food.nutritions)
        }

        // Delete the food
        await transactionalEntityManager.remove(food)
        return true
      }
    )
  }
}
