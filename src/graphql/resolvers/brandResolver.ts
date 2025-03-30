import { BrandService } from '../../services/brandService'
import { AppDataSource } from '../../config/data-source'
import { Food } from '../../models/Food'
import { handleError } from '../../utils/errorHandler'
import createError from 'http-errors'

// Create an instance of BrandService
const brandService = new BrandService()

export const brandResolvers = {
  Query: {
    /**
     * Fetch all brands with pagination
     */
    brands: async (_: unknown, args: { limit?: number; offset?: number }) => {
      try {
        return await brandService.getBrands(args.limit ?? 10, args.offset ?? 0)
      } catch (error) {
        throw handleError(error)
      }
    },

    /**
     * Fetch a single brand by its ID
     */
    brand: async (_: unknown, args: { id: number }) => {
      try {
        const brand = await brandService.getBrandById(args.id)
        if (!brand)
          throw createError(404, `Brand with ID ${args.id} not found.`)
        return brand
      } catch (error) {
        throw handleError(error)
      }
    },
  },
  /**
   * Fetch all foods associated with a brand
   */
  Brand: {
    foods: async (parent: any, _args: any) => {
      try {
        const foods = await AppDataSource.getRepository(Food).find({
          where: { brand_id: parent.id },
        })

        if (!foods || foods.length === 0)
          throw createError(404, `No foods found for brand ID ${parent.id}.`)

        return foods
      } catch (error) {
        throw handleError(error)
      }
    },
  },
}
