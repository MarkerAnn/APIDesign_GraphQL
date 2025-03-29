import { GraphQLError } from 'graphql'
import createError from 'http-errors'

/**
 * Maps HTTP status codes to GraphQL standard error codes
 *
 * This utility function provides consistent mapping between HTTP errors
 * and GraphQL error codes throughout the entire application.
 */
export function getGraphQLErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 500:
      return 'INTERNAL_SERVER_ERROR'
    default:
      return 'INTERNAL_SERVER_ERROR'
  }
}

/**
 * Centralized Error Handler for GraphQL Resolvers
 *
 * Converts HTTP Errors to GraphQL Errors with proper status codes.
 */

export function handleError(error: any) {
  if (createError.isHttpError(error)) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: getGraphQLErrorCode(error.statusCode),
        status: error.statusCode,
      },
    })
  }

  console.error('Unhandled Error: ', error)
  throw new GraphQLError('An unexpected error occurred.', {
    extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
  })
}
