import { gql } from 'graphql-tag'

export const brandTypeDefs = gql`
  """
  Represents a brand associated with food items.
  """
  type Brand {
    "Unique identifier for the brand entry"
    id: ID!

    "Name of the brand (e.g., 'Arla')"
    name: String!

    "Description of the brand (optional)"
    description: String

    "An array of food items associated with this brand"
    foods: [Food!]!
  }
`
