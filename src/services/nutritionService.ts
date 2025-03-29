import { AppDataSource } from '../config/data-source'
import { Nutrition } from '../models/Nutrition'
import createError from 'http-errors'

export class NutritionService {
  /**
   * Fetch a single nutrition by its ID
   */
  async getNutritionById(id: number): Promise<Nutrition> {
    if (!id || isNaN(id)) {
      throw new createError.BadRequest('Invalid ID provided.')
    }

    const nutrition = await AppDataSource.getRepository(Nutrition).findOneBy({
      id,
    })

    if (!nutrition) {
      throw new createError.NotFound(`Nutrition with ID ${id} not found.`)
    }

    return nutrition
  }

  /**
   * Fetch a list of nutritions with optional filtering by category
   */
  async getNutritions(
    limit: number = 10,
    offset: number = 0,
    category?: string[]
  ) {
    if (limit < 1 || offset < 0) {
      throw new createError.BadRequest('Invalid limit or offset value.')
    }

    const query =
      AppDataSource.getRepository(Nutrition).createQueryBuilder('nutrition')

    if (category && category.length > 0) {
      query.where('nutrition.category IN (:...categories)', {
        categories: category,
      })
    }

    try {
      return await query.skip(offset).take(limit).getMany()
    } catch (error) {
      throw new createError.InternalServerError(
        'Failed to retrieve nutritions from the database.'
      )
    }
  }
}
