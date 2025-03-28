// src/graphql/resolvers/index.ts
import { foodResolvers } from './foodResolver'

/**
 * @module Resolvers
 * @description Combines all GraphQL resolvers into a single export
 *
 * This file aggregates resolvers from different domains and exports them as a
 * unified object that can be passed to the Apollo Server configuration.
 * When adding new resolver modules, import them and include them in the exported object.
 */

export const resolvers = {
  Query: {
    ...foodResolvers.Query,
    // Add resolvers from other domains when you add them
    // ...userResolvers.Query,
    // ...authResolvers.Query,
  },

  // Type resolvers
  Food: foodResolvers.Food,

  // Add other Type resolvers when you add them
  // User: userResolvers.User,

  // Add Mutation resolvers when you implement them
  // Mutation: {
  //   ...foodResolvers.Mutation,
  //   ...userResolvers.Mutation,
  //   ...authResolvers.Mutation,
  // }
}

// TODO: update the jsdic comments for the resolvers
// TODO: Split this up later, e.g. food.resolver.ts and index.ts (imports and collects all resolvers)
// TODO: cache?
// TODO: error handling
// TODO: Add fallback logic for undefined, null, etc:
// if (!args.nutrient) {
//   throw new Error('Missing nutrient argument')
// }
