import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Food } from './Food'

/**
 * @class Source
 * @description Entity class representing data sources for food information in the database
 *
 * This class maps to the 'sources' table and stores information about the origins of food data.
 * Sources can be official organizations (like Livsmedelsverket) or user-contributed entries.
 * Each source can be linked to multiple food items through a one-to-many relationship.
 */
@Entity('sources')
export class Source {
  /**
   * @property {number} id - Primary key/unique identifier for the source
   * @description Auto-generated sequential ID for each source record
   */
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * @property {string} name - Name of the data source
   * @description The official name of the data source (e.g., "Livsmedelsverket")
   */
  @Column()
  name!: string

  /**
   * @property {string} type - Type of data source
   * @description Categorization of the source (e.g., "official", "user")
   * indicating the nature and reliability of the data
   */
  @Column()
  type!: string

  /**
   * @property {string} description - Detailed description of the source
   * @description Additional information about the source, including scope, update frequency,
   * or other relevant details about the data provider
   */
  @Column()
  description!: string

  /**
   * @property {Food[]} foods - Associated food items
   * @description Collection of all food items that originate from this source
   * @relations One-to-many relationship with the Food entity
   */
  @OneToMany(() => Food, (food) => food.source)
  foods!: Food[]
}
