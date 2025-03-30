import { IngredientService } from '../../services/ingredientService'
import { AppDataSource } from '../../config/data-source'
import { handleError } from '../../utils/errorHandler'
import createError from 'http-errors'
import { Food } from '../../models/Food'

// Create an instance of IngredientService
const ingredientService = new IngredientService()

export const ingredientResolvers = {
  Query: {
    /**
     * Fetch all ingredients with pagination
     */
    ingredients: async (
      _: unknown,
      args: { limit?: number; offset?: number }
    ) => {
      try {
        return await ingredientService.getIngredients(
          args.limit ?? 10,
          args.offset ?? 0
        )
      } catch (error) {
        throw handleError(error)
      }
    },

    /**
     * Fetch a single ingredient by its ID
     */
    ingredient: async (_: unknown, args: { id: number }) => {
      try {
        const ingredient = await ingredientService.getIngredientById(args.id)
        if (!ingredient)
          throw createError(404, `Ingredient with ID ${args.id} not found.`)
        return ingredient
      } catch (error) {
        throw handleError(error)
      }
    },
  },
  /**
   * Fetch all foods associated with an ingredient
   */
  Ingredient: {
    food: async (parent: any, _args: any) => {
      try {
        if (!parent.foodId) throw createError(400, 'Invalid food ID.')

        const food = await AppDataSource.getRepository(Food).findOne({
          where: { id: parent.foodId },
        })

        if (!food)
          throw createError(404, `Food with ID ${parent.foodId} not found.`)

        return food
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
