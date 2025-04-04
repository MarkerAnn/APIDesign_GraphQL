import { foodQueries } from './queries/foodQueries.js'
import { nutritionQueries } from './queries/nutritionQueries.js'
import { ingredientQueries } from './queries/ingredientQueries.js'
import { sourceQueries } from './queries/sourceQueries.js'
import { brandQueries } from './queries/brandQueries.js'
import { userQueries } from './queries/userQueries.js'
import { userMutations } from './mutations/userMutations.js'
import { foodMutations } from './mutations/foodMutations.js'
import { brandMutations } from './mutations/bransMutations.js'

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

  // Add Mutation resolvers
  Mutation: {
    ...userMutations.Mutation,
    ...foodMutations.Mutation,
    ...brandMutations.Mutation,
  },
}
// TODO: update the jsdoc comments for the resolvers
// TODO: cache?
// TODO: error handling
// TODO: Add fallback logic for undefined, null, etc
