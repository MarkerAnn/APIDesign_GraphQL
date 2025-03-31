import { gql } from 'graphql-tag'

export const userTypeDefs = gql`
  """
  Represents a user that can authenticate to the API.
  """
  type User {
    "Unique identifier for the user"
    id: ID!

    "Username used for login"
    username: String!

    "Email address of the user"
    email: String!

    "When the user was created"
    createdAt: String!

    "Sources created by the user"
    sources: [Source!]!
  }

  """
  Authentication payload returned after successful login or registration.
  """
  type AuthPayload {
    "JWT token for authenticating requests"
    token: String!

    "The authenticated user"
    user: User!
  }
`
