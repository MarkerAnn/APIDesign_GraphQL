import { UserService } from '../../../services/userService'
import { handleError } from '../../../utils/errorHandler'

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
