import { gql } from 'graphql-tag'

export const nutritionTypeDefs = gql`
  """
  Represents nutritional information for a specific food item.
  """
  type Nutrition {
    "Unique identifier for the nutrition entry"
    id: ID!

    "The name of the nutrient (e.g., 'Protein', 'Carbohydrates')"
    name: String!

    "Standard EuroFIR code for the nutrient (optional)"
    eurofirCode: String

    "The quantity of the nutrient (optional)"
    value: Float

    "Unit of measurement (e.g., 'g', 'mg', 'kcal')"
    unit: String

    "Reference weight in grams (optional)"
    weightGram: Float

    "Type of measurement (e.g., 'measured', 'calculated')"
    valueType: String

    "Category of the nutrient (e.g., 'vitamin', 'mineral')"
    category: String

    "The food item associated with this nutrition entry"
    food: Food
  }
`
