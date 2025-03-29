import { SourceService } from '../../services/sourceService'
import { AppDataSource } from '../../config/data-source'
import { Food } from '../../models/Food'
import { handleError } from '../../utils/errorHandler'
import createError from 'http-errors'

// Create an instance of SourceService
const sourceService = new SourceService()

export const sourceResolvers = {
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
        if (!source) throw createError(404, 'Source not found.')
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
          throw createError(404, 'No foods found for this source.')

        return foods
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
