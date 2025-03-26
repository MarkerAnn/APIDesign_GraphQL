import { Food } from '../../models/Food'
import { AppDataSource } from '../../config/data-source'
import { MoreThan, In } from 'typeorm'

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

    searchFoods: async (_: unknown, args: { query: string }) => {
      const foodRepository = AppDataSource.getRepository(Food)

      // Step 1: Get matching IDs only (true limit!)
      const foodsMatching = await foodRepository
        .createQueryBuilder('food')
        .select('food.id')
        .where('LOWER(food.name) LIKE LOWER(:query)', {
          query: `%${args.query}%`,
        })
        .orderBy('food.name', 'ASC')
        .limit(20)
        .getMany()

      const ids = foodsMatching.map((f) => f.id)

      // Step 2: Get full food objects + relations by ID
      const results = await foodRepository.find({
        where: { id: In(ids) },
        relations: ['nutritions'],
        order: { name: 'ASC' },
      })

      console.log(
        `🔎 Search for: ${args.query}, found ${results.length} result(s)`
      )

      return results
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
  },
}

// TODO: update the jsdic comments for the resolvers
// TODO: Split this up later, e.g. food.resolver.ts and index.ts (imports and collects all resolvers)
// TODO: cache?
