import { Food } from '../../models/Food'
import { Source } from '../../models/Source'
import { Brand } from '../../models/Brand'
import { Ingredient } from '../../models/Ingredient'
import { FoodService } from '../../services/foodService'
import { NutrientFilter } from '../../types/NutrientFilter'
import { sortFoods } from '../../utils/sortFoods'
import { encodeCursor, decodeCursor } from '../../utils/pagination'

// Create an instance of FoodService
const foodService = new FoodService()

export const foodResolvers = {
  Query: {
    foods: async (_: unknown, args: { limit?: number; offset?: number }) => {
      return await foodService.getFoods(args.limit ?? 10, args.offset ?? 0)
    },

    food: async (_: unknown, args: { id: number }) => {
      return await foodService.getFoodById(args.id)
    },

    foodsConnection: async (
      _: unknown,
      args: { first?: number; after?: string }
    ) => {
      const limit = args.first ?? 10
      const afterId = args.after ? decodeCursor(args.after) : 0

      const [items, totalCount] = await foodService.getFoodsWithCursor(
        limit,
        afterId
      )

      const edges = items.map((food) => ({
        node: food,
        cursor: encodeCursor(food.id),
      }))

      const hasNextPage = items.length === limit
      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
        totalCount,
      }
    },

    searchFoodsAdvanced: async (
      _: unknown,
      args: {
        name?: string
        nutrients?: NutrientFilter[]
        first?: number
        sortBy?: 'NAME' | 'NUTRIENT'
        sortDirection?: 'ASC' | 'DESC'
        sortNutrient?: string
      }
    ) => {
      try {
        // Use the service to perform the search
        const results = await foodService.searchFoodsAdvanced(
          args.name,
          args.nutrients,
          args.first ?? 20
        )

        console.log(
          `🔎 Advanced search → name: ${args.name || 'none'}, filters: ${
            args.nutrients?.length ?? 0
          }, results: ${results.length}`
        )

        console.log(
          '📋 Matched food names:',
          results.map((f) => f.name)
        )

        // Sort the results with our utils function
        return sortFoods(
          results,
          args.sortBy ?? 'NAME',
          args.sortDirection ?? 'ASC',
          args.sortNutrient
        )
      } catch (error) {
        console.error('❌ Error in searchFoodsAdvanced:', error)
        throw new Error('Advanced food search failed')
      }
    },
  },

  Food: {
    nutritions: (parent: Food, args: { category?: string[] }) => {
      if (!args.category || args.category.length === 0) return parent.nutritions

      const lowerCaseCategories = args.category.map((c) => c.toLowerCase())

      return parent.nutritions.filter((n) =>
        n.category
          ? lowerCaseCategories.includes(n.category.toLowerCase())
          : false
      )
    },
    source: async (parent: Food, _args: any, { dataSource }: any) => {
      if (parent.source) return parent.source // if source is already loaded, return it

      return await dataSource.getRepository(Source).findOne({
        where: { id: parent.source_id },
      })
    },
    brand: async (parent: Food, _args: any, { dataSource }: any) => {
      if (parent.brand) return parent.brand // if brand is already loaded, return it

      if (!parent.brand_id) return null // if no brand_id, return null

      return await dataSource.getRepository(Brand).findOne({
        where: { id: parent.brand_id },
      })
    },
    ingredients: async (parent: Food, _args: any, { dataSource }: any) => {
      if (parent.ingredients) return parent.ingredients // if ingredients are already loaded, return them

      if (!parent.id) return [] // if no food id, return empty array

      return await dataSource.getRepository(Ingredient).find({
        where: { foodId: parent.id },
      })
    },
  },
}
