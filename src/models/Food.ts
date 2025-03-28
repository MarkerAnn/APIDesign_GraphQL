import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import { Nutrition } from './Nutrition'

/**
 * @class Food
 * @description Entity class representing food items in the database
 *
 * This entity maps to the "foods" table in PostgreSQL and stores basic information
 * about food items. It maintains a one-to-many relationship with the Nutrition entity.
 * The data structure is designed to store and reference food items from Livsmedelsverket
 * (The Swedish Food Agency) database.
 */
@Entity({ name: 'foods' })
export class Food {
  /**
   * @property {number} id - Primary key/unique identifier for the food item
   * @description Auto-generated sequential ID for each food record
   * @note This is an internal ID and not the same as Livsmedelsverket's "number"
   */
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * @property {string} number - External identifier from Livsmedelsverket
   * @description The unique identifier used by Livsmedelsverket (The Swedish Food Agency)
   * to reference this food item in their database
   */
  @Column({ type: 'varchar' })
  number!: string

  /**
   * @property {string} name - Name of the food item
   * @description The descriptive name of the food (e.g., "Nöt talg" - Beef tallow)
   */
  @Column({ type: 'varchar' })
  name!: string

  /**
   * @property {Date} createdAt - Timestamp of record creation
   * @description Automatically generated timestamp when the food record was added to the database
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  /**
   * @property {Nutrition[]} nutritions - Associated nutrition records
   * @description Collection of nutrition entries related to this food item
   * @relations One-to-many relationship with the Nutrition entity
   */
  @OneToMany(() => Nutrition, (nutrition) => nutrition.food)
  nutritions!: Nutrition[]
}
