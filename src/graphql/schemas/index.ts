import { gql } from 'graphql-tag'
import { DocumentNode } from 'graphql'

/**
 * @module GraphQLSchema
 * @description GraphQL type definitions schema for the food and nutrition data API
 *
 * This schema defines the GraphQL types for Food and Nutrition entities and their
 * relationships, as well as the available queries for accessing the data.
 * The schema maps to the underlying PostgreSQL database structure while providing
 * a GraphQL-specific interface for client applications.
 */

/**
 * @constant {DocumentNode} typeDefs
 * @description GraphQL type definitions for the API
 *
 * Defines the following types:
 * - Nutrition: Represents nutritional information for food items
 * - Food: Represents food items with their basic information and related nutritional data
 * - Query: Defines available query operations for retrieving food and nutrition data
 */
export const typeDefs: DocumentNode = gql`
  """
  Nutrition type representing nutritional information for food items

  Contains details about specific nutrients, their values, units, and measurement types.
  Maps to the 'nutritions' table in the PostgreSQL database.
  """
  type Nutrition {
    "Unique identifier for the nutrition entry"
    id: ID!

    "Name of the nutrient (e.g., 'Protein', 'Carbohydrates')"
    name: String!

    "Standard EuroFIR code for the nutrient (optional)"
    eurofirCode: String

    "Quantity of the nutrient (optional)"
    value: Float

    "Unit of measurement (e.g., 'g', 'mg', 'kcal') (optional)"
    unit: String

    "Reference weight in grams (optional)"
    weightGram: Float

    "Type of measurement (e.g., 'measured', 'calculated') (optional)"
    valueType: String
  }

  """
  Food type representing food items with their nutritional information

  Contains basic information about food items and includes their associated
  nutrition records. Maps to the 'foods' table in the PostgreSQL database.
  """
  type Food {
    "Unique identifier for the food item"
    id: ID!

    "External identifier from Livsmedelsverket (The Swedish Food Agency)"
    number: String!

    "Name of the food item"
    name: String!

    "List of nutrition entries for this food item"
    nutritions: [Nutrition!]!
  }

  """
  Query type defining available operations for retrieving data

  Provides the entry points for querying food and nutrition data from the API.
  """
  type Query {
    "Get all foods with their nutrition information (limit and offset are optional)"
    foods(limit: Int = 10, offset: Int = 0): [Food!]!

    "Get one specific food by ID with its nutrition information"
    food(id: ID!): Food
  }

  """
  Cursor-based pagination for foods
  """
  type FoodEdge {
    "Single food item"
    node: Food!

    "Cursor used for pagination"
    cursor: String!
  }

  type PageInfo {
    "True if there are more items after this page"
    hasNextPage: Boolean!

    "The cursor for the last item in this page"
    endCursor: String
  }

  type FoodConnection {
    "List of edges (food + cursor)"
    edges: [FoodEdge!]!

    "Pagination info"
    pageInfo: PageInfo!

    "Total number of foods in the database"
    totalCount: Int!
  }

  extend type Query {
    """
    Returns paginated foods using cursor-based Relay style
    """
    foodsConnection(first: Int = 10, after: String): FoodConnection!
  }

  extend type Query {
    """
    Search for foods by name using partial, case-insensitive match
    """
    searchFoods(query: String!): [Food!]!
  }
`
// TODO: Updte this comment later
// TODO: Split this file into multiple files?
