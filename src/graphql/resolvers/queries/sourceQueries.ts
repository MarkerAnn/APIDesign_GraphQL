import { SourceService } from '../../../services/sourceService.js'
import { AppDataSource } from '../../../config/data-source.js'
import { Food } from '../../../models/Food.js'
import { handleError } from '../../../utils/errorHandler.js'
import createError from 'http-errors'

// Create an instance of SourceService
const sourceService = new SourceService()

export const sourceQueries = {
  Query: {
    /**
     * Fetch all sources
     */
    sources: async () => {
      try {
        return await sourceService.getSources()
      } catch (error) {
        throw handleError(error)
      }
    },

    /**
     * Fetch a single source by its ID
     */
    source: async (_: unknown, args: { id: number }) => {
      try {
        const source = await sourceService.getSourceById(args.id)
        if (!source)
          throw createError(404, `Source with ID ${args.id} not found.`)
        return source
      } catch (error) {
        throw handleError(error)
      }
    },
  },

  /**
   * Fetch all foods associated with a source
   */
  Source: {
    foods: async (parent: any, _args: any) => {
      try {
        const foods = await AppDataSource.getRepository(Food).find({
          where: { source_id: parent.id },
        })

        if (!foods || foods.length === 0)
          throw createError(404, `No foods found for source ID ${parent.id}.`)

        return foods
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
