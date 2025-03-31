import { AppDataSource } from '../../../config/data-source'
import { User } from '../../../models/User'
import { handleError } from '../../../utils/errorHandler'
import createError from 'http-errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User()
        user.username = username
        user.email = email
        user.password = hashedPassword

        await AppDataSource.manager.save(user)

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

        const user = await AppDataSource.getRepository(User).findOne({
          where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw createError(401, 'Invalid credentials')
        }

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
