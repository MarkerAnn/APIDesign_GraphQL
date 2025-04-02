import { FoodService } from '../../../services/foodService'
import { requireAuth } from '../../../utils/authGuard'
import { handleError } from '../../../utils/errorHandler'
import { AuthContext } from '../../../middleware/auth'

const foodService = new FoodService()
// TODO: Best practice to create here?

export const foodMutations = {
  Mutation: {
    /**
     * Create a new food item with nutrition data
     * Requires authentication
     */
    createFood: requireAuth(
      async (
        _: unknown,
        args: {
          input: {
            name: string
            brandName?: string
            nutrition: {
              carbohydrates: number
              protein: number
              fat: number
              kcal: number
            }
          }
        },
        context: AuthContext
      ) => {
        try {
          const { name, brandName, nutrition } = args.input

          // Always use sourceId 2 for regular users
          const sourceId = 2

          return await foodService.createFood(
            name,
            context.user!.id,
            sourceId,
            nutrition,
            brandName
          )
        } catch (error) {
          throw handleError(error)
        }
      }
    ),

    /**
     * Update an existing food item with optional nutrition data
     * Requires authentication
     */
    updateFood: requireAuth(
      async (
        _: unknown,
        args: {
          id: number
          input: {
            name?: string
            sourceId?: number
            brandId?: number
            nutrition?: {
              carbohydrates?: number
              protein?: number
              fat?: number
              kcal?: number
            }
          }
        },
        context: AuthContext
      ) => {
        try {
          const { id, input } = args
          const { nutrition, ...foodData } = input

          const updatedFood = await foodService.updateFood(
            id,
            foodData,
            nutrition
          )
          return updatedFood
        } catch (error) {
          throw handleError(error)
        }
      }
    ),

    /**
     * Delete a food item
     * Requires authentication
     */
    deleteFood: requireAuth(
      async (_: unknown, args: { id: number }, context: AuthContext) => {
        try {
          return await foodService.deleteFood(args.id)
        } catch (error) {
          throw handleError(error)
        }
      }
    ),
  },
}
