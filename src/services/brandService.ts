import { handleError } from '../utils/errorHandler'
import { AppDataSource } from '../config/data-source'
import { Brand } from '../models/Brand'
import { ILike } from 'typeorm'
import createError from 'http-errors'

export class BrandService {
  /**
   * Fetch a single brand by its ID
   */
  async getBrandById(id: number): Promise<Brand> {
    if (!id || isNaN(id)) {
      throw new createError.BadRequest('Invalid ID provided.')
    }

    const brand = await AppDataSource.getRepository(Brand).findOneBy({ id })

    if (!brand) {
      throw createError(404, `Brand with ID ${id} not found.`)
    }

    return brand
  }

  /**
   * Fetch a list of all brands with pagination
   */
  async getBrands(limit: number = 10, offset: number = 0): Promise<Brand[]> {
    if (limit < 1 || offset < 0) {
      throw createError(400, 'Invalid limit or offset value.')
    }

    try {
      return await AppDataSource.getRepository(Brand).find({
        skip: offset,
        take: limit,
        order: { id: 'ASC' },
      })
    } catch (error) {
      throw handleError(error)
    }
  }

  /**
   * Search for brands by name
   * @param name Partial name to search for
   * @param limit Maximum number of results to return
   * @returns Array of matching brands
   */
  async searchBrandsByName(name: string, limit: number = 10): Promise<Brand[]> {
    try {
      return await AppDataSource.getRepository(Brand).find({
        where: { name: ILike(`%${name}%`) },
        take: limit,
        order: { name: 'ASC' },
      })
    } catch (error) {
      throw handleError(error)
    }
  }
}
