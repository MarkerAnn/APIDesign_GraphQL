import { gql } from 'graphql-tag'

export const queryTypeDefs = gql`
  """
  Enum representing sorting criteria for food searches.
  """
  enum SortBy {
    NAME
    NUTRIENT
  }

  """
  Enum representing sorting direction.
  """
  enum SortDirection {
    ASC
    DESC
  }

  """
  Input type for filtering foods by nutrient properties.
  """
  input NutrientFilter {
    "The name of the nutrient to filter by (e.g., 'Protein')"
    nutrient: String!

    "Optional minimum value for filtering"
    min: Float

    "Optional maximum value for filtering"
    max: Float

    "Optional category for filtering (e.g., 'macronutrient')"
    category: String
  }

  """
  The root query type for all available operations.
  """
  type Query {
    """
    Fetch a paginated list of all foods.
    """
    foods(limit: Int = 10, offset: Int = 0): [Food!]!

    """
    Fetch a specific food item by its ID.
    """
    food(id: ID!): Food

    """
    Fetch a paginated list of foods using cursor-based pagination.
    """
    foodsConnection(first: Int = 10, after: String): FoodConnection!

    """
    Perform an advanced search for foods using name and nutrient filters.
    """
    searchFoodsAdvanced(
      name: String
      nutrients: [NutrientFilter!]
      first: Int = 20
      sortBy: SortBy = NAME
      sortDirection: SortDirection = ASC
      sortNutrient: String
    ): [Food!]!

    """
    Fetch all nutrition information, optionally filtered by category.
    """
    nutritions(
      category: [String]
      limit: Int = 10
      offset: Int = 0
    ): [Nutrition!]!

    """
    Fetch a specific nutrition entry by its ID.
    """
    nutrition(id: ID!): Nutrition

    """
    Fetch all ingredients with pagination.
    """
    ingredients(limit: Int = 10, offset: Int = 0): [Ingredient!]!

    """
    Fetch a specific ingredient by its ID.
    """
    ingredient(id: ID!): Ingredient

    """
    Fetch all sources.
    """
    sources: [Source!]!

    """
    Fetch a specific source by its ID.
    """
    source(id: ID!): Source

    """
    Fetch all brands with pagination.
    """
    brands(limit: Int = 10, offset: Int = 0): [Brand!]!

    """
    Fetch a specific brand by its ID.
    """
    brand(id: ID!): Brand
  }
`
