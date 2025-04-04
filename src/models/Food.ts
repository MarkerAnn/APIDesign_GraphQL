import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
// Behåll importerna för TypeScript-typning, men relationerna kommer att använda strängar
import { Nutrition } from './Nutrition.js'
import { Source } from './Source.js'
import { Brand } from './Brand.js'
import { Ingredient } from './Ingredient.js'
import { User } from './User.js'

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
   * @note This is nullable for user-created food items
   */
  @Column({ type: 'varchar', nullable: true })
  number!: string | null

  /**
   * @property {string} name - Name of the food item
   * @description The descriptive name of the food (e.g., "Nöt talg" - Beef tallow)
   */
  @Column({ type: 'varchar' })
  name!: string

  /**
   * @property {number} brand_id - Foreign key for the related Brand
   * @description This links the food to its brand (e.g., "Scan")
   */
  @Column({ name: 'brand_id', nullable: true })
  brand_id!: number | null

  /**
   * @property {number} createdBy - ID of the user who created the food item (null for official sources)
   * @description This field is used to track the user who added this food item to the database.
   * It is nullable to accommodate food items that are sourced from official databases
   */
  @Column({ name: 'created_by', nullable: true })
  createdBy?: number | null

  /**
   * @property {Date} createdAt - Timestamp of record creation
   * @description Automatically generated timestamp when the food record was added to the database
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  /**
   * @property {User} creator - User who created the food item
   * @description The user who added this food item to the database
   * @relations Many-to-one relationship with the User entity
   * @note This field is nullable to accommodate food items that are sourced from official databases
   */
  @ManyToOne('User', null, { nullable: true, lazy: true })
  @JoinColumn({ name: 'created_by' })
  creator?: User | null

  /**
   * @property {Nutrition[]} nutritions - Associated nutrition records
   * @description Collection of nutrition entries related to this food item
   * @relations One-to-many relationship with the Nutrition entity
   */
  @OneToMany('Nutrition', 'food', { lazy: true, cascade: true })
  nutritions!: Nutrition[]

  /**
   * @property {number} source_id - Foreign key for the related Source
   * @description This links the food to its source (e.g., Livsmedelsverket)
   */
  @Column({ name: 'source_id', nullable: true })
  source_id?: number | null

  /**
   * @property {Source} source - Source of the food item
   * @description The source from which this food item was obtained (e.g. Livsmedelsverket, user)
   * @relations Many-to-one relationship with the Source entity
   */
  @ManyToOne('Source', 'foods', { lazy: true })
  @JoinColumn({ name: 'source_id' })
  source!: Source

  /**
   * @property {Brand} brand - Brand of the food item
   * @description The brand associated with this food item (e.g. "Scan")
   * @relations Many-to-one relationship with the Brand entity
   */
  @ManyToOne('Brand', 'foods', { lazy: true })
  @JoinColumn({ name: 'brand_id' })
  brand!: Brand

  /**
   * @property {Ingredient[]} ingredients - Associated ingredient records
   * @description Collection of ingredient entries related to this food item
   * @relations One-to-many relationship with the Ingredient entity
   */
  @OneToMany('Ingredient', 'food', { lazy: true })
  ingredients!: Ingredient[]
}
