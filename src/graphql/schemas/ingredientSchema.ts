import { gql } from 'graphql-tag'

export const ingredientTypeDefs = gql`
  """
  Represents an ingredient used in food items.
  """
  type Ingredient {
    "Unique identifier for the ingredient entry"
    id: ID!

    "External identification number for the ingredient"
    ingredientNumber: String

    "Descriptive name of the ingredient (e.g., 'Salt', 'Butter')"
    ingredientName: String!

    "Water factor used in nutritional calculations (optional)"
    waterFactor: Float

    "Fat factor used in nutritional calculations (optional)"
    fatFactor: Float

    "Weight of the ingredient before cooking (optional)"
    weightBeforeCooking: Float

    "Weight of the ingredient after cooking (optional)"
    weightAfterCooking: Float

    "Description of the cooking factor (e.g., 'Fried', 'Boiled')"
    cookingFactor: String

    "The food item associated with this ingredient"
    food: Food
  }
`
