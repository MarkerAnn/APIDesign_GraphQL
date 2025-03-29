import { NutritionService } from '../../services/nutritionService'
import { AppDataSource } from '../../config/data-source'
import { handleError } from '../../utils/errorHandler'

// Create an instance of NutritionService
const nutritionService = new NutritionService(AppDataSource)

export const nutritionResolvers = {
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
        return handleError(error)
      }
    },

    /**
     * Fetch a single nutrition by its ID
     */
    nutrition: async (_: unknown, args: { id: number }) => {
      try {
        return await nutritionService.getNutritionById(args.id)
      } catch (error) {
        return handleError(error)
      }
    },
  },
}
