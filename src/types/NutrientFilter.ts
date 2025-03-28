/**
 * Interface for nutrient filter used in food searches
 */
export interface NutrientFilter {
  nutrient: string
  min?: number
  max?: number
  category?: string
}
