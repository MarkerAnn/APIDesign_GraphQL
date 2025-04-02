import createError from 'http-errors'

/**
 * Validates nutrition data to ensure values are within reasonable ranges
 * @param nutritionData The nutrition data to validate
 * @throws HTTP error if validation fails
 */
export function validateNutritionData(nutritionData: {
  carbohydrates: number
  protein: number
  fat: number
  kcal: number
}): void {
  // Check for negative values
  const negativeFields = []
  if (nutritionData.carbohydrates < 0) negativeFields.push('carbohydrates')
  if (nutritionData.protein < 0) negativeFields.push('protein')
  if (nutritionData.fat < 0) negativeFields.push('fat')
  if (nutritionData.kcal < 0) negativeFields.push('kcal')

  if (negativeFields.length > 0) {
    throw createError(
      400,
      `Invalid negative values for: ${negativeFields.join(', ')}`
    )
  }

  // Check for reasonable limits
  if (nutritionData.carbohydrates > 100) {
    throw createError(
      400,
      'Carbohydrate value exceeds 100g per 100g, which is physically impossible'
    )
  }

  if (nutritionData.protein > 100) {
    throw createError(
      400,
      'Protein value exceeds 100g per 100g, which is physically impossible'
    )
  }

  if (nutritionData.fat > 100) {
    throw createError(
      400,
      'Fat value exceeds 100g per 100g, which is physically impossible'
    )
  }

  // Check that macronutrients don't add up to more than 100g
  const totalMacronutrients =
    nutritionData.carbohydrates + nutritionData.protein + nutritionData.fat

  if (totalMacronutrients > 100) {
    throw createError(
      400,
      `Total macronutrients (${totalMacronutrients.toFixed(1)}g) exceed 100g per 100g of food`
    )
  }

  // Check that calories make sense based on macronutrients
  // 1g carbohydrate = 4 kcal, 1g protein = 4 kcal, 1g fat = 9 kcal
  const estimatedKcal =
    nutritionData.carbohydrates * 4 +
    nutritionData.protein * 4 +
    nutritionData.fat * 9

  const kcalDifference = Math.abs(estimatedKcal - nutritionData.kcal)
  const kcalPercentDifference = (kcalDifference / estimatedKcal) * 100

  // Allow 10% tolerance between calculated and provided calories
  if (kcalPercentDifference > 10 && kcalDifference > 20) {
    throw createError(
      400,
      `Provided energy (${nutritionData.kcal} kcal) differs significantly from calculated value (${estimatedKcal.toFixed(0)} kcal)`
    )
  }
}
