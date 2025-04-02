import { gql } from 'graphql-tag'

export const ingredientTypeDefs = gql`
  """
  Represents an ingredient used in food items.

  Ingredients capture the components that make up complex food items, along with
  information about their preparation and transformation during cooking processes.
  This enables nutritional analysis of prepared foods based on their raw ingredients,
  accounting for changes during cooking.

  For example, a "Beef Stew" food might have ingredients like "Beef", "Onion", and "Carrot",
  each with cooking information about how they were prepared and combined.
  """
  type Ingredient {
    """
    Unique identifier for the ingredient entry.

    This is an auto-generated sequential ID used as primary key in the database.
    """
    id: ID!

    """
    External identification number for the ingredient.

    This may reference an ID from an external system like Livsmedelsverket's
    food database, enabling cross-reference with original data sources.

    For user-contributed ingredients, this may be null.
    """
    ingredientNumber: String

    """
    Descriptive name of the ingredient.

    Examples: "Salt", "Butter", "Wheat Flour", "Chicken Breast"

    This is the primary way to identify the ingredient and should be
    clear and consistent with standard food terminology.
    """
    ingredientName: String!

    """
    Water factor used in nutritional calculations.

    Represents how water content changes during cooking/processing.
    Values > 1 indicate water absorption, values < 1 indicate water loss.

    For example, rice might have a water factor > 1 because it absorbs water
    when cooked, while meat might have a factor < 1 due to water loss during cooking.
    """
    waterFactor: Float

    """
    Fat factor used in nutritional calculations.

    Represents how fat content changes during cooking/processing.
    Values > 1 indicate fat absorption, values < 1 indicate fat loss.

    For example, deep-fried foods might have a fat factor > 1 because they
    absorb oil during frying.
    """
    fatFactor: Float

    """
    Weight of the ingredient before cooking or processing.

    Expressed in grams, this represents the raw weight of the ingredient
    before any cooking or processing occurs.
    """
    weightBeforeCooking: Float

    """
    Weight of the ingredient after cooking or processing.

    Expressed in grams, this represents the final weight of the ingredient
    after cooking or processing is complete.

    The difference between weightBeforeCooking and weightAfterCooking
    helps calculate yield and nutrient concentration or dilution.
    """
    weightAfterCooking: Float

    """
    Description of the cooking or processing method applied.

    Examples: "Fried", "Boiled", "Steamed", "Raw", "Baked"

    This provides context about how the ingredient was prepared,
    which can significantly affect its nutritional profile.
    """
    cookingFactor: String

    """
    The food item this ingredient is associated with.

    References the parent food item that contains this ingredient.
    This backlink enables navigating from ingredients to their parent foods.
    """
    food: Food
  }
`
