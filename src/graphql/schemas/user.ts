import { gql } from 'graphql-tag'

export const userTypeDefs = gql`
  """
  Represents a user that can authenticate to the API and create content.
  User accounts are used for authentication and tracking created content.
  """
  type User {
    "Unique identifier for the user"
    id: ID!

    "Username used for login (unique across the system)"
    username: String!

    "Email address of the user (unique across the system)"
    email: String!

    "When the user account was created"
    createdAt: String!
  }

  """
  Authentication payload returned after successful login or registration.
  Contains both the JWT token needed for authentication and the user data.
  """
  type AuthPayload {
    "JWT token for authenticating subsequent requests. Include this in Authorization header as 'Bearer <token>'"
    token: String!

    "The authenticated user's information"
    user: User!
  }
`
