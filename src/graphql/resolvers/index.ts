import { foodResolvers } from './foodResolver'
import { nutritionResolvers } from './nutritionResolver'
import { ingredientResolvers } from './ingredientResolver'
import { sourceResolvers } from './sourceResolver'
import { brandResolvers } from './brandResolver'

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
    ...nutritionResolvers.Query,
    ...ingredientResolvers.Query,
    ...sourceResolvers.Query,
    ...brandResolvers.Query,
  },

  // Type resolvers
  Food: foodResolvers.Food,
  Nutrition: nutritionResolvers.Nutrition,
  Ingredient: ingredientResolvers.Ingredient,
  Source: sourceResolvers.Source,
  Brand: brandResolvers.Brand,

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
