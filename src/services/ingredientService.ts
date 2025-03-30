import { handleError } from 'utils/errorHandler'
import { AppDataSource } from '../config/data-source'
import { Ingredient } from '../models/Ingredient'
import createError from 'http-errors'

export class IngredientService {
  /**
   * Fetch a single ingredient by its ID
   */
  async getIngredientById(id: number): Promise<Ingredient> {
    if (!id || isNaN(id)) {
      throw createError(400, 'Invalid ID provided.')
    }

    const ingredient = await AppDataSource.getRepository(Ingredient).findOneBy({
      id,
    })

    if (!ingredient) {
      throw createError(404, `Ingredient with ID ${id} not found.`)
    }

    return ingredient
  }

  /**
   * Fetch a list of all ingredients with pagination
   */
  async getIngredients(
    limit: number = 10,
    offset: number = 0
  ): Promise<Ingredient[]> {
    if (limit < 1 || offset < 0) {
      throw createError(400, 'Invalid limit or offset value.')
    }

    try {
      return await AppDataSource.getRepository(Ingredient).find({
        skip: offset,
        take: limit,
        order: { id: 'ASC' },
      })
    } catch (error) {
      throw handleError(error)
    }
  }
}
