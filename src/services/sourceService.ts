import { AppDataSource } from '../config/data-source'
import { Source } from '../models/Source'
import createError from 'http-errors'

export class SourceService {
  /**
   * Fetch a single source by its ID
   */
  async getSourceById(id: number): Promise<Source> {
    if (!id || isNaN(id)) {
      throw new createError.BadRequest('Invalid ID provided.')
    }

    const source = await AppDataSource.getRepository(Source).findOneBy({ id })

    if (!source) {
      throw new createError.NotFound(`Source with ID ${id} not found.`)
    }

    return source
  }

  /**
   * Fetch a list of all sources
   */
  async getSources(): Promise<Source[]> {
    try {
      return await AppDataSource.getRepository(Source).find({
        order: { id: 'ASC' },
      })
    } catch (error) {
      throw new createError.InternalServerError(
        'Failed to retrieve sources from the database.'
      )
    }
  }
}
