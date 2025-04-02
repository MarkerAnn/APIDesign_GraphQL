import { AppDataSource } from '../config/data-source'
import { User } from '../models/User'
import createError from 'http-errors'
import bcrypt from 'bcrypt'

export class UserService {
  /**
   * Fetch a user by their ID with related sources
   */
  async getUserById(id: number): Promise<User | null> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id },
      relations: ['sources'],
    })

    if (!user) {
      throw createError(404, `User with ID ${id} not found.`)
    }

    return user
  }

  /**
   * Register a new user
   */
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User()
        user.username = username
        user.email = email
        user.password = hashedPassword

        // Save user in the transaction
        return await transactionalEntityManager.save(user)
      }
    )
  }

  /**
   * Authenticate a user and return the user if credentials are valid
   */
  async authenticate(usernameOrEmail: string, password: string): Promise<User> {
    const user = await AppDataSource.getRepository(User).findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(401, 'Invalid credentials')
    }

    return user
  }
}
