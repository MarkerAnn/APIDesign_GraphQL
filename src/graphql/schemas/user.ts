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
  Define queries related to users.
  """
  extend type Query {
    "Fetch a user by their ID"
    getUser(id: ID!): User
  }

  """
  Define mutations related to user authentication.
  """
  extend type Mutation {
    "Register a new user account"
    register(input: RegisterInput!): AuthPayload!

    "Authenticate and get a token"
    login(input: LoginInput!): AuthPayload!
  }
`
