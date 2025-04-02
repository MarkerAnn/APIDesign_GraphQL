import { NutritionService } from '../../../services/nutritionService'
import { AppDataSource } from '../../../config/data-source'
import { handleError } from '../../../utils/errorHandler'
import createError from 'http-errors'
import { Food } from '../../../models/Food'

// Create an instance of NutritionService
const nutritionService = new NutritionService()

export const nutritionQueries = {
  Query: {
    /**
     * Fetch all nutritions, optionally filtered by category
     */
    nutritions: async (
      _: unknown,
      args: { category?: string[]; limit?: number; offset?: number }
    ) => {
      try {
        return await nutritionService.getNutritions(
          args.limit ?? 10,
          args.offset ?? 0,
          args.category
        )
      } catch (error) {
        throw handleError(error)
      }
    },

    /**
     * Fetch a single nutrition by its ID
     */
    nutrition: async (_: unknown, args: { id: number }) => {
      try {
        const nutrition = await nutritionService.getNutritionById(args.id)
        if (!nutrition)
          throw createError(404, `Nutrition with ID ${args.id} not found.`)
        return nutrition
      } catch (error) {
        throw handleError(error)
      }
    },
  },
  /**
   * Fetch all foods associated with a nutrition
   */
  Nutrition: {
    food: async (parent: any, _args: any) => {
      try {
        const foodId = parent.food_id || parent.foodId

        if (!foodId) {
          console.log(`Missing foodId for nutrition ID ${parent.id}`)
          return null
        }

        // Fetch the food associated with this nutrition
        const food = await AppDataSource.getRepository(Food).findOne({
          where: { id: parent.foodId },
        })

        if (!food)
          throw createError(404, `Food with ID ${parent.foodId} not found.`)

        return food // Return the food object
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
