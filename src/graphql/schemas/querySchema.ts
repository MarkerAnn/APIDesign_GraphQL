import { gql } from 'graphql-tag'

export const queryTypeDefs = gql`
  """
  The root query type for retrieving information from the database.
  All data fetching operations start here.
  """
  type Query {
    """
    Fetch a paginated list of all foods.

    @param limit Maximum number of items to return (default: 10)
    @param offset Number of items to skip (default: 0)
    @returns A list of food items
    """
    foods(limit: Int = 10, offset: Int = 0): [Food!]!

    """
    Fetch a specific food item by its ID.

    @param id Unique identifier of the food item
    @returns The requested food item or null if not found
    """
    food(id: ID!): Food

    """
    Fetch a paginated list of foods using cursor-based pagination.
    This approach is more efficient for large datasets.

    @param first Maximum number of items to return (default: 10)
    @param after Cursor indicating where to start fetching from (optional)
    @returns A connection object with edges, pagination info, and total count
    """
    foodsConnection(first: Int = 10, after: String): FoodConnection!

    """
    Perform an advanced search for foods using name and nutrient filters.

    This query allows complex filtering by name pattern and nutritional content,
    with sorting options.

    @param name Text to search for in food names (optional)
    @param nutrients Array of nutrient filters to apply (optional)
    @param limit Maximum number of items to return (default: 20)
    @param sortBy Criteria to sort results by (default: NAME)
    @param sortDirection Order to sort results (default: ASC)
    @param sortNutrient Specific nutrient to sort by when sortBy is NUTRIENT
    @returns A list of food items matching the filters
    """
    searchFoodsAdvanced(
      name: String
      nutrients: [NutrientFilter!]
      limit: Int = 20
      sortBy: SortBy = NAME
      sortDirection: SortDirection = ASC
      sortNutrient: String
    ): [Food!]!

    """
    Fetch all nutrition information, optionally filtered by category.

    @param category Array of nutrient categories to filter by (optional)
    @param limit Maximum number of items to return (default: 10)
    @param offset Number of items to skip (default: 0)
    @returns A list of nutrition entries
    """
    nutritions(
      category: [String]
      limit: Int = 10
      offset: Int = 0
    ): [Nutrition!]!

    """
    Fetch a specific nutrition entry by its ID.

    @param id Unique identifier of the nutrition entry
    @returns The requested nutrition entry or null if not found
    """
    nutrition(id: ID!): Nutrition

    """
    Fetch all ingredients with pagination.

    @param limit Maximum number of items to return (default: 10)
    @param offset Number of items to skip (default: 0)
    @returns A list of ingredient entries
    """
    ingredients(limit: Int = 10, offset: Int = 0): [Ingredient!]!

    """
    Fetch a specific ingredient by its ID.

    @param id Unique identifier of the ingredient
    @returns The requested ingredient or null if not found
    """
    ingredient(id: ID!): Ingredient

    """
    Fetch all available data sources.

    @returns A list of all sources in the database
    """
    sources: [Source!]!

    """
    Fetch a specific source by its ID.

    @param id Unique identifier of the source
    @returns The requested source or null if not found
    """
    source(id: ID!): Source

    """
    Fetch all brands with pagination.

    @param limit Maximum number of items to return (default: 10)
    @param offset Number of items to skip (default: 0)
    @returns A list of brands
    """
    brands(limit: Int = 10, offset: Int = 0): [Brand!]!

    """
    Fetch a specific brand by its ID.

    @param id Unique identifier of the brand
    @returns The requested brand or null if not found
    """
    brand(id: ID!): Brand

    """
    Search for brands by name (useful for autocomplete features).

    @param name Text to search for in brand names
    @param limit Maximum number of items to return (default: 10)
    @returns A list of brands matching the search term
    """
    searchBrands(name: String!, limit: Int = 10): [Brand!]!

    """
    Fetch a specific user by their ID.

    @param id Unique identifier of the user
    @returns The requested user or null if not found
    """
    getUser(id: ID!): User
  }
`
