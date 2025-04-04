import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/data-source.js'
import { User } from '../models/User.js'
import { handleError } from '../utils/errorHandler.js'
import createError from 'http-errors'

// Interface for decoded JWT token
interface DecodedToken {
  userId: number
  iat: number
  exp: number
}

// Interface for context with user info
export interface AuthContext {
  user: User | null
  isAuthenticated: boolean
}

/**
 * Extract and verify JWT token from authorization header
 * @param req Express request object
 * @returns Auth context with user info if authenticated
 */
export const getAuthContext = async (req: Request): Promise<AuthContext> => {
  // Default context with no authenticated user
  const defaultContext: AuthContext = {
    user: null,
    isAuthenticated: false,
  }

  // Get the authorization header
  const authHeader = req.headers.authorization

  // If no auth header, return default context
  if (!authHeader) {
    return defaultContext
  }

  // Check if header follows Bearer token format
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return defaultContext
  }

  const token = parts[1]

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken

    // Fetch the user from database
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded.userId },
    })

    if (!user) {
      throw createError(404, `User with ID ${decoded.userId} not found.`)
    }

    // Return authenticated context
    return {
      user,
      isAuthenticated: true,
    }
  } catch (error) {
    throw handleError(error)
  }
}
