import { gql } from 'graphql-tag'

export const foodTypeDefs = gql`
  """
  Represents a food item, including its nutritional information, source, brand, and ingredients.
  """
  type Food {
    "Unique identifier for the food item"
    id: ID!

    "External identifier from Livsmedelsverket (The Swedish Food Agency)"
    number: String!

    "The name of the food item"
    name: String!

    "List of nutrition entries related to this food item, filtered by category if provided"
    nutritions(category: [String!]): [Nutrition!]!

    "The source of the food data, such as Livsmedelsverket"
    source: Source!

    "The brand associated with the food item, if applicable"
    brand: Brand

    "List of ingredients associated with the food item"
    ingredients: [Ingredient!]!
  }

  """
  Provides pagination information for a list of foods.
  """
  type FoodEdge {
    "The food item"
    node: Food!

    "Cursor for pagination"
    cursor: String!
  }

  """
  Information about pagination state
  """
  type PageInfo {
    "True if there are more items to be fetched"
    hasNextPage: Boolean!

    "The cursor for the last item in the current page"
    endCursor: String
  }

  """
  Represents a paginated list of foods
  """
  type FoodConnection {
    edges: [FoodEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }
`
