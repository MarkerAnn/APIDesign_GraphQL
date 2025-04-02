import { gql } from 'graphql-tag'

export const sourceTypeDefs = gql`
  """
  Represents a source of food data.

  Sources track the origin of food information in the database, distinguishing
  between official data (like Livsmedelsverket), user-contributed data, and
  other potential sources. This enables data provenance tracking and allows
  users to assess the reliability and authority of food information.

  Examples of sources include official food databases, research publications,
  manufacturer-provided data, and user-contributed information.
  """
  type Source {
    """
    Unique identifier for the source entry.

    This is an auto-generated sequential ID used as primary key in the database.
    """
    id: ID!

    """
    Name of the source.

    Examples:
    - "Livsmedelsverket" (The Swedish Food Agency)
    - "User Contributions"
    - "Research Database"
    - "Manufacturer Data"

    This name should clearly identify the origin of the data to users.
    """
    name: String!

    """
    Type of the source categorizing its authority and reliability.

    Standard types include:
    - "official" - Government agencies, regulatory bodies
    - "user" - User-contributed data
    - "research" - Academic or scientific research
    - "commercial" - Data provided by manufacturers

    This classification helps users understand the nature of the data source.
    """
    type: String!

    """
    Detailed description of the source.

    May include information about the source's data collection methodology,
    update frequency, scope, limitations, or other relevant details that
    help users understand and appropriately use the data.

    Examples:
    - "Data fetched from the Swedish Livsmedelsverket, updated quarterly"
    - "User-contributed data, verified by community moderators"
    """
    description: String!

    """
    An array of food items originating from this source.

    Contains all food items that have this source as their data origin.
    This relationship enables browsing foods by their source and understanding
    the scope of each data source's contributions.

    If a source has no associated food items, this returns an empty array.
    """
    foods: [Food!]!

    """
    The user who created or added this source entry to the system.

    For official sources like Livsmedelsverket, this typically references
    a system administrator account. For user sources, this references the
    user who contributed the data.

    This enables attribution and accountability for data sources.
    """
    user: User!
  }
`
