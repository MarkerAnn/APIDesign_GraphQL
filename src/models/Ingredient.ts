import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Food } from './Food.js'

/**
 * @class Ingredient
 * @description Entity class representing ingredients related to food items in the database
 *
 * This entity maps to the "ingredients" table in PostgreSQL and stores detailed information
 * about the various ingredients associated with a food item. This includes cooking factors,
 * water content, fat content, and weights before and after cooking.
 */
@Entity({ name: 'ingredients' })
export class Ingredient {
  /**
   * @property {number} id - Primary key, unique identifier for the ingredient
   * @description Auto-generated identifier for each ingredient entry
   */
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * @property {number} foodId - Foreign key referencing the associated food item
   * @description Connects this ingredient to a specific food item
   */
  @Column({ name: 'food_id' })
  foodId!: number

  /**
   * @property {string} ingredientNumber - Ingredient identification number
   * @description An external identifier or reference for the ingredient
   */
  @Column({ name: 'ingredient_number', type: 'varchar', nullable: true })
  ingredientNumber?: string

  /**
   * @property {string} ingredientName - Name of the ingredient
   * @description The descriptive name of the ingredient (e.g., "Salt", "Butter")
   */
  @Column({ name: 'ingredient_name', type: 'varchar' })
  ingredientName!: string

  /**
   * @property {number} waterFactor - Water factor used in calculations (optional)
   */
  @Column({ name: 'water_factor', type: 'decimal', nullable: true })
  waterFactor?: number

  /**
   * @property {number} fatFactor - Fat factor used in calculations (optional)
   */
  @Column({ name: 'fat_factor', type: 'decimal', nullable: true })
  fatFactor?: number

  /**
   * @property {number} weightBeforeCooking - Weight of the ingredient before cooking (optional)
   */
  @Column({ name: 'weight_before_cooking', type: 'decimal', nullable: true })
  weightBeforeCooking?: number

  /**
   * @property {number} weightAfterCooking - Weight of the ingredient after cooking (optional)
   */
  @Column({ name: 'weight_after_cooking', type: 'decimal', nullable: true })
  weightAfterCooking?: number

  /**
   * @property {string} cookingFactor - Description of cooking factor (optional)
   */
  @Column({ name: 'cooking_factor', type: 'varchar', nullable: true })
  cookingFactor?: string

  /**
   * @property {Food} food - The associated food item
   * @description Many-to-one relationship with the Food entity
   */
  @ManyToOne('Food', 'ingredients', { lazy: true })
  @JoinColumn({ name: 'food_id' })
  food!: Food
}
