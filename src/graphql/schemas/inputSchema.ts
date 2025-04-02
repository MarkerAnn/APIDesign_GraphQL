import { gql } from 'graphql-tag'

export const inputTypeDefs = gql`
  """
  Enum representing sorting criteria for food searches.
  """
  enum SortBy {
    "Sort by food name"
    NAME

    "Sort by nutrient value (requires sortNutrient parameter)"
    NUTRIENT
  }

  """
  Enum representing sorting direction.
  """
  enum SortDirection {
    "Sort in ascending order (A-Z, low to high)"
    ASC

    "Sort in descending order (Z-A, high to low)"
    DESC
  }

  """
  Input type for filtering foods by nutrient properties.
  Used in advanced food search operations.
  """
  input NutrientFilter {
    "The name of the nutrient to filter by (e.g., 'Protein', 'Fett, totalt')"
    nutrient: String!

    "Optional minimum value for the nutrient"
    min: Float

    "Optional maximum value for the nutrient"
    max: Float

    "Optional category for filtering (e.g., 'macronutrient', 'vitamin', 'mineral')"
    category: String
  }

  """
  Input type for user registration.
  Required for creating a new user account.
  """
  input RegisterInput {
    "Username for the new account (must be unique)"
    username: String!

    "Email address for the account (must be unique)"
    email: String!

    "Password for the account (will be hashed before storage)"
    password: String!
  }

  """
  Input type for required nutrition information when creating a food item.
  All values should be specified per 100g of the food item.
  """
  input NutritionInput {
    """
    Amount of carbohydrates in grams per 100g.
    Must be a non-negative value and should not exceed 100g.
    """
    carbohydrates: Float!

    """
    Amount of protein in grams per 100g.
    Must be a non-negative value and should not exceed 100g.
    """
    protein: Float!

    """
    Amount of total fat in grams per 100g.
    Must be a non-negative value and should not exceed 100g.
    """
    fat: Float!

    """
    Energy content in kilocalories (kcal) per 100g.
    Must be a non-negative value and should be consistent with the macronutrient values
    (approximately: carbohydrates*4 + protein*4 + fat*9).
    """
    kcal: Float!
  }

  """
  Input type for updating nutrition information.
  All values are optional and specified per 100g of the food item.
  """
  input UpdateNutritionInput {
    """
    Amount of carbohydrates in grams per 100g.
    Must be a non-negative value and should not exceed 100g.
    """
    carbohydrates: Float

    """
    Amount of protein in grams per 100g.
    Must be a non-negative value and should not exceed 100g.
    """
    protein: Float

    """
    Amount of total fat in grams per 100g.
    Must be a non-negative value and should not exceed 100g.
    """
    fat: Float

    """
    Energy content in kilocalories (kcal) per 100g.
    Must be a non-negative value and should be consistent with the macronutrient values
    (approximately: carbohydrates*4 + protein*4 + fat*9).
    """
    kcal: Float
  }

  """
  Input type for user login.
  Required for authenticating an existing user.
  """
  input LoginInput {
    "Username or email to authenticate with"
    usernameOrEmail: String!

    "Password for authentication"
    password: String!
  }

  """
  Input type for creating a new food item with required nutritional information.
  """
  input CreateFoodInput {
    """
    Name of the food item.
    Should be descriptive and follow standard naming conventions.
    """
    name: String!

    """
    Optional brand name associated with this food item.
    The brand must already exist in the system.
    """
    brandName: String

    """
    Required nutritional values per 100g of the food item.
    These values are used to create the basic nutritional profile.
    """
    nutrition: NutritionInput!
  }

  """
  Input type for creating a brand.
  """
  input CreateBrandInput {
    "Name of the brand (must be unique)"
    name: String!

    "Optional description of the brand"
    description: String
  }

  """
  Input type for updating a food item.
  All fields are optional - only specified fields will be updated.
  """
  input UpdateFoodInput {
    """
    Name of the food item
    """
    name: String

    """
    Source ID the food belongs to
    """
    sourceId: ID

    """
    Brand ID to associate with this food (null to remove brand)
    """
    brandId: ID

    """
    Nutritional values to update
    """
    nutrition: UpdateNutritionInput
  }
`
