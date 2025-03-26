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
  /**
   * Nutrition type representing nutritional information for food items
   * 
   * @typedef {Object} Nutrition
   * @property {ID!} id - Unique identifier for the nutrition entry
   * @property {String!} name - Name of the nutrient (e.g., "Protein", "Carbohydrates")
   * @property {String} eurofirCode - Standard EuroFIR code for the nutrient (optional)
   * @property {Float} value - Quantity of the nutrient (optional)
   * @property {String} unit - Unit of measurement (e.g., "g", "mg", "kcal") (optional)
   * @property {Float} weightGram - Reference weight in grams (optional)
   * @property {String} valueType - Type of measurement (e.g., "measured", "calculated") (optional)
   */
  type Nutrition {
    id: ID!
    name: String!
    eurofirCode: String
    value: Float
    unit: String
    weightGram: Float
    valueType: String
  }

  /**
   * Food type representing food items with their nutritional information
   * 
   * @typedef {Object} Food
   * @property {ID!} id - Unique identifier for the food item
   * @property {String!} number - External identifier from Livsmedelsverket
   * @property {String!} name - Name of the food item
   * @property {[Nutrition!]!} nutritions - List of nutrition entries for this food item
   */
  type Food {
    id: ID!
    number: String!
    name: String!
    nutritions: [Nutrition!]! # Nested relationship with Nutrition type
  }

  /**
   * Query type defining available operations for retrieving data
   * 
   * @typedef {Object} Query
   * @property {[Food!]!} foods - Query to retrieve all food items
   * @property {Food} food - Query to retrieve a specific food item by ID
   */
  type Query {
    foods: [Food!]!     # Get all foods
    food(id: ID!): Food # Get one food by ID
  }
`
