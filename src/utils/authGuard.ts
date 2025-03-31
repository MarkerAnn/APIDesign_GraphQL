import { AuthContext } from '../middleware/auth'
import { handleError } from '../utils/errorHandler'
import createError from 'http-errors'

/**
 * A higher-order function that wraps resolvers requiring authentication
 *
 * @param resolver The resolver function to protect
 * @returns A wrapped resolver that checks authentication before execution
 */
export function requireAuth<TArgs, TResult>(
  resolver: (
    parent: any,
    args: TArgs,
    context: AuthContext,
    info: any
  ) => Promise<TResult>
) {
  return async (
    parent: any,
    args: TArgs,
    context: AuthContext,
    info: any
  ): Promise<TResult> => {
    try {
      // Check if user is authenticated
      if (!context.isAuthenticated || !context.user) {
        throw createError(401, 'Authentication required')
      }

      // If authenticated, execute the resolver
      return await resolver(parent, args, context, info)
    } catch (error) {
      throw handleError(error)
    }
  }
}
