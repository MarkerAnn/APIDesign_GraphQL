import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Nutrition } from './Nutrition'
import { Source } from './Source'
import { Brand } from './Brand'
import { Ingredient } from './Ingredient'

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

  /**
   * @property {number} source_id - Foreign key for the related Source
   * @description This links the food to its source (e.g., Livsmedelsverket)
   */
  @Column({ name: 'source_id', nullable: true })
  source_id!: number

  /**
   * @property {number} brand_id - Foreign key for the related Brand
   * @description This links the food to its brand (e.g., "Scan")
   */
  @Column({ name: 'brand_id', nullable: true })
  brand_id!: number

  /**
   * @property {Source} source - Source of the food item
   * @description The source from which this food item was obtained (e.g. Livsmedelsverket, user)
   * @relations Many-to-one relationship with the Source entity
   */
  @ManyToOne(() => Source, (source) => source.foods)
  @JoinColumn({ name: 'source_id' })
  source!: Source

  /**
   * @property {Brand} brand - Brand of the food item
   * @description The brand associated with this food item (e.g. "Scan")
   * @relations Many-to-one relationship with the Brand entity
   */
  @ManyToOne(() => Brand, (brand) => brand.foods)
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand

  /**
   * @property {Ingredient[]} ingredients - Associated ingredient records
   * @description Collection of ingredient entries related to this food item
   * @relations One-to-many relationship with the Ingredient entity
   */
  @OneToMany(() => Ingredient, (ingredient) => ingredient.food)
  ingredients!: Ingredient[]
}
