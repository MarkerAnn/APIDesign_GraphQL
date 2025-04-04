import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Food } from './Food.js'

/**
 * @class Nutrition
 * @description Entity class representing nutrition data for food items in the database
 *
 * This class maps to the 'nutritions' table and stores detailed nutritional information
 * for each food item. It maintains a many-to-one relationship with the Food entity.
 * Nutrition data includes standard measurements such as values, units, and reference weights.
 */
@Entity({ name: 'nutritions' })
export class Nutrition {
  /**
   * @property {number} id - Primary key/unique identifier for the nutrition entry
   * @description Auto-generated sequential ID for each nutrition record
   */
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * @property {string} name - Name of the nutrient
   * @description The specific name of the nutrient (e.g., "Protein", "Carbohydrates", "Vitamin C")
   */
  @Column()
  name!: string

  /**
   * @property {string} eurofirCode - Standard EuroFIR code for the nutrient
   * @description European Food Information Resource Network standardized code for nutrient identification
   * @optional This field may be null if no standard code exists or is known
   */
  @Column({ name: 'eurofir_code', nullable: true })
  eurofirCode!: string

  /**
   * @property {number} value - Quantity of the nutrient
   * @description Numerical value representing the amount of the nutrient present
   * @optional This field may be null if the value is unknown or unmeasured
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value!: number

  /**
   * @property {string} unit - Unit of measurement
   * @description The unit used for measuring the nutrient (e.g., "g", "mg", "kcal")
   * @optional This field may be null if the unit is not specified
   */
  @Column({ type: 'varchar', nullable: true })
  unit!: string

  /**
   * @property {number} weightGram - Reference weight in grams
   * @description Weight in grams for which the nutritional value is provided
   * @optional This field may be null if the reference weight is not specified
   */
  @Column({
    name: 'weight_gram',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  weightGram!: number

  /**
   * @property {string} category - Category of the nutrient
   * @description Logical grouping of the nutrient (e.g., "vitamin", "macronutrient", "energy", etc.)
   * @optional This field may be null if the category is not specified
   */
  @Column({ type: 'varchar', nullable: true })
  category!: string
  /**
   * @property {string} valueType - Type of the value measurement
   * @description Indicates how the value was determined (e.g., "measured", "calculated")
   * @optional This field may be null if the measurement method is not specified
   */
  @Column({ name: 'value_type', type: 'varchar', nullable: true })
  valueType!: string

  /**
   * @property {number} food_id - Foreign key referencing the Food entity
   * @description Database column that stores the ID of the associated food item
   * This is the actual column name in the database (snake_case)
   */
  @Column({ name: 'food_id' })
  food_id!: number

  /**
   * @property {number} foodId - Getter for food_id in camelCase
   * @description Provides access to food_id using JavaScript camelCase convention
   * Enables consistent access regardless of database naming convention
   */
  get foodId(): number {
    return this.food_id
  }

  /**
   * @property {Food} food - Associated food item
   * @description Reference to the Food entity that this nutrition data belongs to
   * @relations Many-to-one relationship with the Food entity
   */
  @ManyToOne(() => Food, (food) => food.nutritions)
  @JoinColumn({ name: 'food_id' })
  food!: Food
}
