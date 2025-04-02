import { gql } from 'graphql-tag'

export const foodTypeDefs = gql`
  """
  Represents a food item, including its nutritional information, source, brand, and ingredients.

  Food items form the core of the database. Each food item has detailed nutritional information,
  may belong to a specific brand, has a defined source (e.g., official data from Livsmedelsverket
  or user-contributed), and can contain multiple ingredients.

  Nutritional values are typically provided per 100g of the food item, following standard conventions.
  """
  type Food {
    """
    Unique identifier for the food item.

    This is an auto-generated sequential ID used as primary key in the database.
    It is different from external IDs like Livsmedelsverket's numbering system.
    """
    id: ID!

    """
    The name of the food item.

    Food names should be descriptive and follow standard conventions.
    Examples: "Mjölk 3% fett", "Havregryn", "Kycklingfilé"
    """
    name: String!

    """
    List of nutrition entries related to this food item.

    Contains detailed nutritional information like protein, carbohydrates, fat,
    vitamins, and minerals. Can be filtered by category to retrieve specific
    types of nutrients.

    @param category Optional array of nutrient categories to filter by
                   (e.g., ['macronutrient', 'vitamin'])
    @returns Filtered list of nutrition entries for this food
    """
    nutritions(category: [String!]): [Nutrition!]!

    """
    The source of the food data.

    Indicates where the nutritional information came from, such as Livsmedelsverket
    (the Swedish Food Agency) for official data, or the user who contributed it.

    This helps assess data reliability and track data provenance.
    """
    source: Source!

    """
    The brand associated with the food item, if applicable.

    For generic food items (e.g., "Apple") or items without a specific brand,
    this field will be null. For commercial products, this indicates the manufacturer.

    Example brands: Arla, Scan, Oatly
    """
    brand: Brand

    """
    List of ingredients associated with the food item.

    For simple foods (like "Apple"), this may be empty. For complex or prepared foods,
    this contains the component ingredients and possibly cooking information.

    This allows tracking what a food is made of and how it was prepared.
    """
    ingredients: [Ingredient!]!
  }

  """
  Provides an edge in a connection-based pagination system for foods.

  Following the Relay Cursor Connections specification, this represents
  a single item in a paginated list, with its associated cursor.
  """
  type FoodEdge {
    """
    The food item at this position in the list.

    Contains the full food object with all its associated data.
    """
    node: Food!

    """
    Cursor for pagination representing this position in the result set.

    This is a base64-encoded string that can be used with the 'after' parameter
    to fetch the next page of results, starting after this item.
    """
    cursor: String!
  }

  """
  Information about the current pagination state.

  Provides metadata about the current page of results and whether more
  results are available.
  """
  type PageInfo {
    """
    True if there are more items to be fetched beyond this page.

    When false, the client knows they've reached the end of the result set.
    """
    hasNextPage: Boolean!

    """
    The cursor for the last item in the current page.

    When hasNextPage is true, this cursor can be used as the 'after' parameter
    to fetch the next page of results.
    """
    endCursor: String
  }

  """
  Represents a paginated list of foods using cursor-based pagination.

  This follows the Relay Cursor Connections specification for efficient pagination
  of large datasets, providing better performance than offset-based pagination
  for large result sets.
  """
  type FoodConnection {
    """
    List of food items at their positions (edges) in the result set.

    Each edge contains both the food item and a cursor representing its position.
    """
    edges: [FoodEdge!]!

    """
    Pagination metadata for navigating through the result set.

    Contains information about whether more pages exist and cursors for navigation.
    """
    pageInfo: PageInfo!

    """
    The total number of items in the complete result set.

    This allows clients to show pagination information like "showing 1-10 of 243"
    even when using cursor-based pagination.
    """
    totalCount: Int!
  }
`
