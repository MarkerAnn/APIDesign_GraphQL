import { Food } from '../models/Food'

export function sortFoods(
  foods: Food[],
  sortBy: 'NAME' | 'NUTRIENT',
  sortDirection: 'ASC' | 'DESC',
  sortNutrient?: string
): Food[] {
  if (sortBy === 'NUTRIENT' && sortNutrient) {
    return [...foods].sort((a, b) => {
      const aVal =
        a.nutritions.find(
          (n) => n.name.toLowerCase() === sortNutrient.toLowerCase()
        )?.value ?? -Infinity

      const bVal =
        b.nutritions.find(
          (n) => n.name.toLowerCase() === sortNutrient.toLowerCase()
        )?.value ?? -Infinity

      return sortDirection === 'DESC' ? bVal - aVal : aVal - bVal
    })
  }

  return [...foods].sort((a, b) =>
    sortDirection === 'DESC'
      ? b.name.localeCompare(a.name)
      : a.name.localeCompare(b.name)
  )
}
