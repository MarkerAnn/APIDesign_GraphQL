import { AppDataSource } from '../../../config/data-source'
import { User } from '../../../models/User'
import { handleError } from '../../../utils/errorHandler'
import createError from 'http-errors'

export const userQueries = {
  Query: {
    /**
     * Fetch a user by their ID
     */
    getUser: async (_: unknown, args: { id: number }) => {
      try {
        const user = await AppDataSource.getRepository(User).findOne({
          where: { id: args.id },
          relations: ['sources'], // Include sources if they are part of the relationship
        })

        if (!user) throw createError(404, `User with ID ${args.id} not found.`)

        return user
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
