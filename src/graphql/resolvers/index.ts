import { Food } from '../../models/Food'
import { Nutrition } from '../../models/Nutrition'
import { sortFoods } from '../../utils/sortFoods'
import { AppDataSource } from '../../config/data-source'
import {
  MoreThan,
  In,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm'

/**
 * @module GraphQLResolvers
 * @description GraphQL resolvers for the food and nutrition data API
 *
 * This module contains resolver functions that implement the logic for fetching
 * data specified in the GraphQL schema. Resolvers connect GraphQL operations
 * to the underlying TypeORM repositories and database.
 */

// Helper functions for Relay-style cursor pagination
function encodeCursor(id: number): string {
  return Buffer.from(id.toString()).toString('base64')
}

function decodeCursor(cursor: string): number {
  return parseInt(Buffer.from(cursor, 'base64').toString('ascii'), 10)
}

/**
 * @constant {Object} resolvers
 * @description GraphQL resolver functions for each field in the schema
 */
export const resolvers = {
  /**
   * @namespace Query
   * @description Resolvers for Query operations defined in the schema
   */
  Query: {
    /**
     * Offset-based pagination: Return foods with limit and offset
     */
    foods: async (_: unknown, args: { limit?: number; offset?: number }) => {
      const foodRepository = AppDataSource.getRepository(Food)
      return await foodRepository.find({
        relations: ['nutritions'],
        take: args.limit ?? 10,
        skip: args.offset ?? 0,
        order: { id: 'ASC' },
      })
    },

    /**
     * Get one food by ID
     */
    food: async (_: unknown, args: { id: number }) => {
      const foodRepository = AppDataSource.getRepository(Food)
      return await foodRepository.findOne({
        where: { id: args.id },
        relations: ['nutritions'],
      })
    },
    /**
     * Relay-style cursor-based pagination for foods
     */
    foodsConnection: async (
      _: unknown,
      args: { first?: number; after?: string }
    ) => {
      const limit = args.first ?? 10
      const afterId = args.after ? decodeCursor(args.after) : 0

      const foodRepository = AppDataSource.getRepository(Food)

      const [items, totalCount] = await foodRepository.findAndCount({
        where: afterId ? { id: MoreThan(afterId) } : {},
        order: { id: 'ASC' },
        take: limit,
        relations: ['nutritions'],
      })

      const edges = items.map((food) => ({
        node: food,
        cursor: encodeCursor(food.id),
      }))

      const hasNextPage = items.length === limit
      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
        totalCount,
      }
    },

    searchFoodsAdvanced: async (
      _: unknown,
      args: {
        name?: string
        nutrients?: {
          nutrient: string
          min?: number
          max?: number
          category?: string
        }[]
        first?: number
        sortBy?: 'NAME' | 'NUTRIENT'
        sortDirection?: 'ASC' | 'DESC'
        sortNutrient?: string
      }
    ) => {
      try {
        const foodRepository = AppDataSource.getRepository(Food)
        const nutritionRepository = AppDataSource.getRepository(Nutrition)

        let foodIdsByName: number[] | null = null
        let foodIdsByNutrients: number[] | null = null

        // Step 1: Filter by name (if provided)
        if (args.name) {
          const foodsMatchingName = await foodRepository
            .createQueryBuilder('food')
            .select('food.id')
            .where('LOWER(food.name) LIKE LOWER(:query)', {
              query: `%${args.name}%`,
            })
            .orderBy('food.name', 'ASC')
            .limit(200) // prevent excessive lookups
            .getMany()

          foodIdsByName = foodsMatchingName.map((f) => f.id)
        }

        //  Step 2: Filter by nutrients (if provided)
        if (args.nutrients?.length) {
          const nutrientIdLists: number[][] = []

          for (const filter of args.nutrients) {
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

            const matches = await nutritionRepository.find({
              where: whereClause,
              relations: ['food'],
            })

            const ids = matches.map((n) => n.food.id)
            nutrientIdLists.push(ids)
          }

          //  Get intersection of all filters (AND logic)
          foodIdsByNutrients = nutrientIdLists.reduce((a, b) =>
            a.filter((id) => b.includes(id))
          )
        }

        // Combine filters
        let finalFoodIds: number[]

        if (foodIdsByName && foodIdsByNutrients) {
          // Match both name and nutrients
          finalFoodIds = foodIdsByName.filter((id) =>
            foodIdsByNutrients!.includes(id)
          )
        } else if (foodIdsByName) {
          finalFoodIds = foodIdsByName
        } else if (foodIdsByNutrients) {
          finalFoodIds = foodIdsByNutrients
        } else {
          // No filters = return empty list or maybe throw error
          return []
        }

        // Slice and deduplicate
        const limitedIds = [...new Set(finalFoodIds)].slice(0, args.first ?? 20)

        // Final fetch
        const results = await foodRepository.find({
          where: { id: In(limitedIds) },
          relations: ['nutritions'],
        })

        console.log(
          `🔎 Advanced search → name: ${args.name || 'none'}, filters: ${
            args.nutrients?.length ?? 0
          }, results: ${results.length}`
        )

        console.log(
          '📋 Matched food names:',
          results.map((f) => f.name)
        )

        const sorted = sortFoods(
          results,
          args.sortBy ?? 'NAME',
          args.sortDirection ?? 'ASC',
          args.sortNutrient
        )

        return sorted
      } catch (error) {
        console.error('❌ Error in searchFoodsAdvanced:', error)
        throw new Error('Advanced food search failed')
      }
    },
  },
  Food: {
    nutritions: (parent: Food, args: { category?: string[] }) => {
      if (!args.category || args.category.length === 0) return parent.nutritions

      const lowerCaseCategories = args.category.map((c) => c.toLowerCase())

      return parent.nutritions.filter((n) =>
        n.category
          ? lowerCaseCategories.includes(n.category.toLowerCase())
          : false
      )
    },
  },
}

// TODO: update the jsdic comments for the resolvers
// TODO: Split this up later, e.g. food.resolver.ts and index.ts (imports and collects all resolvers)
// TODO: cache?
// TODO: error handling
// TODO: Add fallback logic for undefined, null, etc:
// if (!args.nutrient) {
//   throw new Error('Missing nutrient argument')
// }
