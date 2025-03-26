import { Food } from '../../models/Food'
import { AppDataSource } from '../../config/data-source'

/**
 * @module GraphQLResolvers
 * @description GraphQL resolvers for the food and nutrition data API
 *
 * This module contains resolver functions that implement the logic for fetching
 * data specified in the GraphQL schema. Resolvers connect GraphQL operations
 * to the underlying TypeORM repositories and database.
 */

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
     * @function foods
     * @description Resolver for the 'foods' query
     * @returns {Promise<Food[]>} A promise that resolves to an array of Food objects with their nutrition data
     *
     * Fetches all food items from the database and includes their related nutrition records.
     * This implements the 'foods' field defined in the GraphQL schema.
     */
    foods: async () => {
      const foodRepository = AppDataSource.getRepository(Food)
      return await foodRepository.find({
        relations: ['nutritions'], // Load the nutrition relation
      })
    },

    /**
     * @function food
     * @description Resolver for the 'food' query that fetches a single food by ID
     * @param {unknown} _ - Parent resolver (not used)
     * @param {Object} args - Arguments passed to the query
     * @param {number} args.id - ID of the food item to retrieve
     * @returns {Promise<Food|null>} A promise that resolves to a Food object or null if not found
     *
     * Fetches a specific food item by its ID and includes its related nutrition records.
     * This implements the 'food' field defined in the GraphQL schema.
     */
    food: async (_: unknown, args: { id: number }) => {
      const foodRepository = AppDataSource.getRepository(Food)
      return await foodRepository.findOne({
        where: { id: args.id },
        relations: ['nutritions'],
      })
    },
  },
}
