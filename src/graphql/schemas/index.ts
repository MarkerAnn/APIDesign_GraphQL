import { gql } from 'graphql-tag'

import { DocumentNode } from 'graphql'

/**
 * GraphQL schema definitions for the application.
 *
 * This schema defines the following types:
 * - `Food`: Represents a food item with an `id`, `number`, and `name`.
 * - `Query`: Provides two query operations:
 *    - `foods`: Retrieves a list of all food items.
 *    - `food`: Retrieves a specific food item by its `id`.
 */
export const typeDefs: DocumentNode = gql`
  type Food {
    id: ID!
    number: String!
    name: String!
  }

  type Query {
    foods: [Food!]!
    food(id: ID!): Food
  }
`
