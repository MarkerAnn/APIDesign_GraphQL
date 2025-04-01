import { FoodService } from '../../../services/foodService'
import { requireAuth } from '../../../utils/authGuard'
import { handleError } from '../../../utils/errorHandler'
import { AuthContext } from '../../../middleware/auth'

const foodService = new FoodService()
// TODO: Best practice to intsantiate service in resolvers (and another one here?)?

export const foodMutations = {
  Mutation: {
    createFood: requireAuth(
      async (
        _: unknown,
        args: {
          input: {
            number: string
            name: string
            brandName?: string
          }
        },
        context: AuthContext
      ) => {
        try {
          const { number, name, brandName } = args.input

          // Always use sourceId 2 for regular users
          const sourceId = 2

          return await foodService.createFood(
            number,
            name,
            context.user!.id,
            sourceId,
            brandName
          )
        } catch (error) {
          throw handleError(error)
        }
      }
    ),

    updateFood: requireAuth(
      async (
        _: unknown,
        args: {
          id: number
          input: {
            number?: string
            name?: string
            sourceId?: number
            brandId?: number
          }
        },
        context: AuthContext
      ) => {
        try {
          const updatedFood = await foodService.updateFood(args.id, args.input)
          return updatedFood
        } catch (error) {
          throw handleError(error)
        }
      }
    ),

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
