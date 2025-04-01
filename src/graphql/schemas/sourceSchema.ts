import { gql } from 'graphql-tag'

export const sourceTypeDefs = gql`
  """
  Represents a source of food data.
  """
  type Source {
    "Unique identifier for the source entry"
    id: ID!

    "Name of the source (e.g., 'Livsmedelsverket')"
    name: String!

    "Type of the source (e.g., 'official', 'user')"
    type: String!

    "Description of the source (e.g., 'Data fetched from the Swedish Livsmedelsverket')"
    description: String!

    "An array of food items associated with this source"
    foods: [Food!]!

    "The user who created this source entry"
    user: User!
  }
`
