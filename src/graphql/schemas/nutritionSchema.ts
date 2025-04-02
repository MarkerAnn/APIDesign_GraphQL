import { gql } from 'graphql-tag'

export const nutritionTypeDefs = gql`
  """
  Represents nutritional information for a specific food item.

  Each nutrition entry represents a specific nutrient (protein, vitamin, etc.)
  and its quantity within a food item. Food items typically have multiple
  nutrition entries forming their complete nutritional profile.

  Nutritional data follows standardized formats consistent with Swedish and
  European food databases, including EuroFIR codes for interoperability.
  Values are typically expressed per 100g of food unless otherwise specified.
  """
  type Nutrition {
    """
    Unique identifier for the nutrition entry.

    This is an auto-generated sequential ID used as primary key in the database.
    """
    id: ID!

    """
    The name of the nutrient.

    Examples:
    - Macronutrients: "Protein", "Kolhydrater", "Fett, totalt", "Fibrer"
    - Vitamins: "Vitamin A", "Vitamin C", "Folat", "Vitamin B12"
    - Minerals: "Kalcium", "Järn", "Natrium", "Kalium"
    - Energy: "Energi (kcal)", "Energi (kJ)"

    Names follow standard Swedish nutrition terminology, consistent with
    Livsmedelsverket's database.
    """
    name: String!

    """
    Standard EuroFIR code for the nutrient.

    European Food Information Resource Network (EuroFIR) codes are standardized
    identifiers for nutrients, enabling interoperability across food databases.

    Examples: "PROT" for protein, "CHO" for carbohydrates, "FAT" for fat,
    "ENER" for energy, "ZN" for zinc

    This field may be null for non-standard or specialized nutrients.
    """
    eurofirCode: String

    """
    The quantity of the nutrient in the specified unit.

    For example, 3.5 (grams) of protein, 120 (kcal) of energy,
    or 1.2 (mg) of iron.

    This field may be null when the value is unknown or unmeasured,
    but not zero (zero values are represented as 0).
    """
    value: Float

    """
    Unit of measurement for the nutrient value.

    Common units include:
    - "g" for macronutrients (protein, carbohydrates, fat)
    - "mg" or "μg" for vitamins and minerals
    - "kcal" or "kJ" for energy

    Units follow standard nutritional conventions in the metric system.
    """
    unit: String

    """
    Reference weight in grams for which the nutritional value is provided.

    Standard value is 100 (representing per 100g of food), but may differ
    for specialized measurements or serving-based values.

    This allows for proper scaling of nutritional values to different portions.
    """
    weightGram: Float

    """
    Type of the value measurement.

    Indicates how the nutritional value was determined:
    - "measured" - Direct laboratory analysis
    - "calculated" - Derived from component ingredients or calculation
    - "estimated" - Approximate value based on similar foods
    - "declared" - Value declared by manufacturer

    This helps assess the reliability and precision of the nutritional data.
    """
    valueType: String

    """
    Category of the nutrient for classification purposes.

    Main categories include:
    - "macronutrient" - Protein, carbohydrates, fat, fiber
    - "vitamin" - All vitamins (A, C, D, E, B-complex, etc.)
    - "mineral" - Minerals and trace elements (calcium, iron, zinc, etc.)
    - "energy" - Energy values (kcal, kJ)
    - "fatty_acid" - Specific fatty acids (saturated, monounsaturated, etc.)
    - "sugar" - Various types of sugars
    - "fiber" - Dietary fiber components
    - "water" - Water content
    - "alcohol" - Alcohol content
    - "other" - Miscellaneous nutrients that don't fit other categories

    This enables filtering and grouping nutrients by type.
    """
    category: String

    """
    The food item associated with this nutrition entry.

    References the parent food item that contains this nutrition data.
    This backlink enables navigating from nutrition entries to their parent foods.
    """
    food: Food
  }
`
