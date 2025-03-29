import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Food } from './Food'

/**
 * @class Brand
 * @description Entity class representing a brand in the database
 */
@Entity({ name: 'brands' })
export class Brand {
  /**
   * @property {number} id - Primary key/unique identifier for the brand
   */
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * @property {string} name - Name of the brand
   */
  @Column({ type: 'varchar' })
  name!: string

  /**
   * @property {string} description - Description of the brand (optional)
   */
  @Column({ type: 'varchar', nullable: true })
  description?: string

  /**
   * @property {Food[]} foods - The foods associated with this brand
   * @relations One-to-many relationship with the Food entity
   */
  @OneToMany(() => Food, (food) => food.brand)
  foods!: Food[]
}
