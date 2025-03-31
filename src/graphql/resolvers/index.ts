import { foodQueries } from './queries/foodQueries'
import { nutritionQueries } from './queries/nutritionQueries'
import { ingredientQueries } from './queries/ingredientQueries'
import { sourceQueries } from './queries/sourceQueries'
import { brandQueries } from './queries/brandQueries'
import { userQueries } from './queries/userQueries'
import { userMutations } from './mutations/userMutations'

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
    ...foodQueries.Query,
    ...nutritionQueries.Query,
    ...ingredientQueries.Query,
    ...sourceQueries.Query,
    ...brandQueries.Query,
    ...userQueries.Query,
  },

  // Type resolvers
  Food: foodQueries.Food,
  Nutrition: nutritionQueries.Nutrition,
  Ingredient: ingredientQueries.Ingredient,
  Source: sourceQueries.Source,
  Brand: brandQueries.Brand,

  // Add Mutation resolvers when you implement them
  Mutation: {
    ...userMutations.Mutation,
  },
}

// TODO: update the jsdic comments for the resolvers
// TODO: Split this up later, e.g. food.resolver.ts and index.ts (imports and collects all resolvers)
// TODO: cache?
// TODO: error handling
// TODO: Add fallback logic for undefined, null, etc:
// if (!args.nutrient) {
//   throw new Error('Missing nutrient argument')
// }
