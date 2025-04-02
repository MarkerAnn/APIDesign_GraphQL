import { gql } from 'graphql-tag'

export const brandTypeDefs = gql`
  """
  Represents a brand associated with food items.

  Brands are commercial entities that produce food products. This type allows tracking
  which company manufactures specific food items, enabling users to search for foods
  by their brand and compare similar products across different manufacturers.

  Example brands: Arla, Scan, Oatly, ICA, Felix, Findus
  """
  type Brand {
    """
    Unique identifier for the brand entry.

    This is an auto-generated sequential ID used as primary key in the database.
    """
    id: ID!

    """
    Name of the brand (e.g., 'Arla', 'Oatly', 'Scan').

    Brand names are unique in the system - no two brands can have the same name.
    This field is case-insensitive for search purposes.
    """
    name: String!

    """
    Description of the brand (optional).

    May contain additional information about the brand such as its history,
    philosophy, geographic origin, or specialization.
    """
    description: String

    """
    An array of food items associated with this brand.

    Contains all food items manufactured by this brand. This relationship
    allows browsing a brand's product catalog and comparing foods across brands.

    If a brand has no associated food items, this returns an empty array.
    """
    foods: [Food!]!
  }
`
