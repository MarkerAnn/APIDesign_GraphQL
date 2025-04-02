import { gql } from 'graphql-tag'

export const mutationTypeDefs = gql`
  """
  The root mutation type that provides access to all data modification operations.
  """
  type Mutation {
    """
    Register a new user account in the system.

    This creates a new user with the provided username, email, and password.
    On successful registration, returns an authentication token that can be used
    for authenticated requests, along with the user data.

    @param input Registration information including username, email, and password
    @returns An auth payload containing a JWT token and the newly created user
    """
    register(input: RegisterInput!): AuthPayload!

    """
    Authenticate an existing user with username/email and password.

    On successful authentication, returns a JWT token that can be used to make
    authenticated requests, along with the user's information.

    @param input Login credentials (username or email, and password)
    @returns An auth payload containing a JWT token and the authenticated user
    """
    login(input: LoginInput!): AuthPayload!

    """
    Create a new food item with nutritional information.

    This operation requires authentication. The created food will be associated with
    the authenticated user and marked as user-contributed data (source_id: 2).

    @param input Required food data including name, optional brand, and basic nutrition values
    @returns The newly created food item with all relationships populated
    """
    createFood(input: CreateFoodInput!): Food!

    """
    Create a new brand in the system.

    This operation requires authentication. Brands can later be associated
    with food items.

    @param input Required brand information including name and optional description
    @returns The newly created brand
    """
    createBrand(input: CreateBrandInput!): Brand!

    """
    Update an existing food item by ID.

    This operation requires authentication. You can update the food's basic properties
    and/or its nutritional values.

    @param id ID of the food to update
    @param input Updated food data - all fields are optional
    @returns The updated food item with all relationships populated
    """
    updateFood(id: ID!, input: UpdateFoodInput!): Food!

    """
    Delete a food item by its ID.

    This operation requires authentication. It will also delete all associated
    nutritional information.

    @param id ID of the food to delete
    @returns True if the deletion was successful
    """
    deleteFood(id: ID!): Boolean!
  }
`
