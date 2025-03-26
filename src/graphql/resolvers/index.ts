import { Food } from '../../models/Food'
import { AppDataSource } from '../../config/data-source'

/**
 * GraphQL resolvers for Food-related queries and mutations
 */
export const resolvers = {
  Query: {
    /**
     * Retrieves all food items from the database
     *
     * @async
     * @return {Promise<Food[]>} A promise that resolves to an array of Food objects
     */
    foods: async () => {
      const foodRepository = AppDataSource.getRepository(Food)
      return await foodRepository.find()
    },

    /**
     * Retrieves a single food item by its ID
     *
     * @async
     * @param {unknown} _ - Parent resolver parameter (unused)
     * @param {Object} args - Query arguments
     * @param {number} args.id - ID of the food item to retrieve
     * @return {Promise<Food|null>} A promise that resolves to a Food object or null if not found
     */
    food: async (_: unknown, args: { id: number }) => {
      const foodRepository = AppDataSource.getRepository(Food)
      return await foodRepository.findOneBy({ id: args.id })
    },
  },
}
