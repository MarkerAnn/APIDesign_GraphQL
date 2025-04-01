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
  Input type for user registration.
  """
  input RegisterInput {
    "Desired username for new account"
    username: String!
    "Email address"
    email: String!
    "Password for the account"
    password: String!
  }

  """
  Input type for user login.
  """
  input LoginInput {
    "Username or email to authenticate with"
    usernameOrEmail: String!
    "Password for authentication"
    password: String!
  }

  """
  Input type for creating a new food item.
  """
  input CreateFoodInput {
    "Name of the food item"
    name: String!

    "Optional brand name - will be created if it doesn't exist"
    brandName: String
  }

  """
  Input type for creating a brand.
  """
  input CreateBrandInput {
    "Name of the brand"
    name: String!

    "Optional description of the brand"
    description: String
  }

  """
  Input type for updating a food item.
  """
  input UpdateFoodInput {
    "Name of the food item (optional for update)"
    name: String

    "Source ID the food belongs to (optional for update)"
    sourceId: ID

    "Optional brand ID (optional for update)"
    brandId: ID
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
      limit: Int = 20
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

    """
    Search for brands by name (for autocomplete)
    """
    searchBrands(name: String!, limit: Int = 10): [Brand!]!

    """
    Fetch a specific user by its ID.
    """
    getUser(id: ID!): User
  }

  """
  The root mutation type for all available operations.
  """
  type Mutation {
    "Register a new user"
    register(input: RegisterInput!): AuthPayload!

    "Login an existing user"
    login(input: LoginInput!): AuthPayload!

    "Create a new food item (requires authentication)"
    createFood(input: CreateFoodInput!): Food!

    "Create a new brand (requires authentication)"
    createBrand(input: CreateBrandInput!): Brand!

    "Update an existing food item (requires authentication)"
    updateFood(id: ID!, input: UpdateFoodInput!): Food!

    "Delete a food item (requires authentication)"
    deleteFood(id: ID!): Boolean!
  }
`
