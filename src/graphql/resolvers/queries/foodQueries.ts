import { FoodService } from '../../../services/foodService.js'
import { Brand } from '../../../models/Brand.js'
import { Source } from '../../../models/Source.js'
import { Ingredient } from '../../../models/Ingredient.js'
import { NutrientFilter } from '../../../types/NutrientFilter.js'
import { AppDataSource } from '../../../config/data-source.js'
import { encodeCursor, decodeCursor } from '../../../utils/pagination.js'
import { handleError } from '../../../utils/errorHandler.js'
import createError from 'http-errors'

const foodService = new FoodService()

export const foodQueries = {
  Query: {
    searchFoodsAdvanced: async (
      _: unknown,
      args: {
        name?: string
        nutrients?: NutrientFilter[]
        limit?: number
      }
    ) => {
      try {
        const results = await foodService.searchFoodsAdvanced(
          args.name,
          args.nutrients,
          args.limit ?? 20
        )
        return results
      } catch (error) {
        throw handleError(error)
      }
    },

    foods: async (_: unknown, args: { limit?: number; offset?: number }) => {
      try {
        return await foodService.getFoods(args.limit ?? 10, args.offset ?? 0)
      } catch (error) {
        throw handleError(error)
      }
    },

    food: async (_: unknown, args: { id: number }) => {
      try {
        const food = await foodService.getFoodById(args.id)
        if (!food) throw createError(404, `Food with ID ${args.id} not found.`)
        return food
      } catch (error) {
        throw handleError(error)
      }
    },

    foodsConnection: async (
      _: unknown,
      args: { first?: number; after?: string }
    ) => {
      try {
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
        const endCursor =
          edges.length > 0 ? edges[edges.length - 1].cursor : null

        return {
          edges,
          pageInfo: { hasNextPage, endCursor },
          totalCount,
        }
      } catch (error) {
        throw handleError(error)
      }
    },
  },

  Food: {
    nutritions: async (parent: any, _args: any) => {
      try {
        if (!parent.id) throw createError(400, 'Invalid food ID.')

        return parent.nutritions || []
      } catch (error) {
        throw handleError(error)
      }
    },
    source: async (parent: any, _args: any) => {
      try {
        if (parent.source) return parent.source

        const source = await AppDataSource.getRepository(Source).findOne({
          where: { id: parent.source_id },
        })

        if (!source)
          throw createError(404, `Sorce with ID ${parent.source_id} not found.`)

        return source
      } catch (error) {
        throw handleError(error)
      }
    },
    brand: async (parent: any, _args: any) => {
      try {
        if (!parent.brand_id) return null

        const brand = await AppDataSource.getRepository(Brand).findOne({
          where: { id: parent.brand_id },
        })

        if (!brand)
          throw createError(404, `Brand with ID ${parent.brand_id} not found.`)

        return brand
      } catch (error) {
        throw handleError(error)
      }
    },
    ingredients: async (parent: any, _args: any) => {
      try {
        if (!parent.id) throw createError(400, 'Invalid food ID.')

        const ingredients = await AppDataSource.getRepository(Ingredient).find({
          where: { foodId: parent.id },
        })

        return ingredients
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
