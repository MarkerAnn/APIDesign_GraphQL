import { handleError } from '../utils/errorHandler'
import { AppDataSource } from '../config/data-source'
import { Source } from '../models/Source'
import createError from 'http-errors'

export class SourceService {
  /**
   * Fetch a single source by its ID
   */
  async getSourceById(id: number): Promise<Source> {
    if (!id || isNaN(id)) {
      throw createError(400, 'Invalid ID provided.')
    }

    const source = await AppDataSource.getRepository(Source).findOneBy({ id })

    if (!source) {
      throw createError(404, `Source with ID ${id} not found.`)
    }

    return source
  }

  /**
   * Fetch a list of all sources
   */
  async getSources(): Promise<Source[]> {
    return await AppDataSource.getRepository(Source).find({
      order: { id: 'ASC' },
    })
  }
}
