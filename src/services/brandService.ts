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
      throw createError(400, 'Invalid ID provided.')
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

    return await AppDataSource.getRepository(Brand).find({
      skip: offset,
      take: limit,
      order: { id: 'ASC' },
    })
  }

  /**
   * Search for brands by name
   * @param name Partial name to search for
   * @param limit Maximum number of results to return
   * @returns Array of matching brands
   */
  async searchBrandsByName(name: string, limit: number = 10): Promise<Brand[]> {
    return await AppDataSource.getRepository(Brand).find({
      where: { name: ILike(`%${name}%`) },
      take: limit,
      order: { name: 'ASC' },
    })
  }

  /**
   * Create a new brand
   * @param name The name of the brand
   * @param description Optional description
   * @returns The created brand
   */
  async createBrand(name: string, description?: string): Promise<Brand> {
    // Check if brand already exists
    const existingBrand = await AppDataSource.getRepository(Brand).findOne({
      where: { name: ILike(name) },
    })

    if (existingBrand) {
      throw createError(409, `Brand with name "${name}" already exists.`)
    }

    // Create new brand
    const brand = new Brand()
    brand.name = name
    if (description) brand.description = description

    return await AppDataSource.getRepository(Brand).save(brand)
  }
}
