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
  enum SortBy {
    NAME
    NUTRIENT
  }

  enum SortDirection {
    ASC
    DESC
  }
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

    "Category of the nutrient (e.g., 'vitamin', 'mineral') (optional)"
    category: String
  }

  """
  Ingredient type representing various ingredients used in a food item

  This type describes the details of individual ingredients associated with
  a specific food item. It provides information about cooking factors, weights,
  and other relevant attributes used in nutritional calculations and preparation.
  """
  type Ingredient {
    """
    Unique identifier for the ingredient entry
    """
    id: ID!

    """
    External identification number for the ingredient (if applicable)

    This could be an ID from another database or system that provides information
    about the ingredient.
    """
    ingredientNumber: String

    """
    Descriptive name of the ingredient (e.g., 'Salt', 'Butter')

    This is the name used to identify the ingredient within the food item.
    """
    ingredientName: String!

    """
    Water factor used in nutritional calculations (optional)

    This value represents the proportion of water present in the ingredient and
    can be used to adjust calculations related to moisture content.
    """
    waterFactor: Float

    """
    Fat factor used in nutritional calculations (optional)

    This value represents the proportion of fat present in the ingredient and
    can be used to adjust calculations related to fat content.
    """
    fatFactor: Float

    """
    Weight of the ingredient before cooking (optional)

    This is the raw weight of the ingredient before any cooking or processing has occurred.
    """
    weightBeforeCooking: Float

    """
    Weight of the ingredient after cooking (optional)

    This is the final weight of the ingredient after it has been cooked or processed.
    """
    weightAfterCooking: Float

    """
    Description of the cooking factor (e.g., 'Fried', 'Boiled', 'Baked')

    This provides additional information about how the ingredient was prepared.
    """
    cookingFactor: String
  }

  type Source {
    "Unique identifier for the source entry"
    id: ID!

    "Name of the source (e.g., 'Livsmedelsverket')"
    name: String!

    "Type of the source (e.g., 'official', 'user '"
    type: String!

    "Description of the source (e.g., 'Data fetched from the Swedish Livsmedelsverket')"
    description: String!
  }

  type Brand {
    "Unique identifier for the brand entry"
    id: ID!

    "Name of the brand (e.g., 'Arla')"
    name: String!

    "Description of the brand (optional)"
    description: String
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

    "List of nutrition entries related to this food item, you can filter by category (e.g. 'vitamin')"
    nutritions(category: [String!]): [Nutrition!]!
  }

  extend type Food {
    """
    The source of the food data
    """
    source: Source!
  }

  extend type Food {
    """
    The brand of the food data
    """
    brand: Brand
  }

  extend type Food {
    """
    List of ingredients associated with the food item

    Each ingredient provides details about its preparation, weight changes, and
    any relevant nutritional factors. Returns an empty list if no ingredients are associated.
    """
    ingredients: [Ingredient!]!
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

    "Get all nutrition information with optional filtering by category"
    nutritions(
      category: [String]
      limit: Int = 10
      offset: Int = 0
    ): [Nutrition!]!
    "Get all ingredients"
    ingredients(limit: Int = 10, offset: Int = 0): [Ingredient!]!
    "Get all sources"
    sources(limit: Int = 10, offset: Int = 0): [Source!]!
    "Get all brands"
    brands(limit: Int = 10, offset: Int = 0): [Brand!]!
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

  """
  Input for filtering foods based on nutrient name and value range
  """
  input NutrientFilter {
    "The name of the nutrient to filter by (e.g. 'Protein', 'Kolhydrater')"
    nutrient: String!

    "Optional minimum value for the nutrient (e.g. min protein)"
    min: Float

    "Optional maximum value for the nutrient (e.g. max protein)"
    max: Float

    "Optional unit of measurement for the nutrient (e.g. 'g', 'mg')"
    category: String
  }

  extend type Query {
    """
    Advanced food search with optional name matching and nutrient filters.

    - If 'name' is provided, matches foods where the name includes the input string.
    - If 'nutrients' are provided, only foods matching all nutrient filters are returned.
    - If both are provided, foods must match both the name and all nutrient filters.

    Returns up to 'first' matching foods, default is 20.
    """
    searchFoodsAdvanced(
      name: String
      nutrients: [NutrientFilter!]
      first: Int = 20
      sortBy: SortBy = NAME
      sortDirection: SortDirection = ASC
      sortNutrient: String
    ): [Food!]!
  }
`
// TODO: Updte this comment later
// TODO: Split this file into multiple files?
