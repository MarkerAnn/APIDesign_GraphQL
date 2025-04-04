import { UserService } from '../../../services/userService.js'
import { handleError } from '../../../utils/errorHandler.js'

const userService = new UserService()

export const userQueries = {
  Query: {
    /**
     * Fetch a user by their ID
     */
    getUser: async (_: unknown, args: { id: number }) => {
      try {
        return await userService.getUserById(args.id)
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
