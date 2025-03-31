import { UserService } from '../../../services/userService'
import { handleError } from '../../../utils/errorHandler'
import jwt from 'jsonwebtoken'

const userService = new UserService()

export const userMutations = {
  Mutation: {
    /**
     * Register a new user
     */
    register: async (
      _: unknown,
      args: { input: { username: string; email: string; password: string } }
    ) => {
      try {
        const { username, email, password } = args.input
        const user = await userService.register(username, email, password)

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
          expiresIn: '1d',
        })

        return { token, user }
      } catch (error) {
        throw handleError(error)
      }
    },

    /**
     * Login a user and return a JWT
     */
    login: async (
      _: unknown,
      args: { input: { usernameOrEmail: string; password: string } }
    ) => {
      try {
        const { usernameOrEmail, password } = args.input
        const user = await userService.authenticate(usernameOrEmail, password)

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
          expiresIn: '1d',
        })

        return { token, user }
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
