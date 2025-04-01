import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'

/**
 * @class User
 * @description Entity class representing users in the database
 *
 * This class maps to the 'users' table and stores information about users who can
 * authenticate and perform protected operations in the API.
 */
@Entity({ name: 'users' })
export class User {
  /**
   * @property {number} id - Primary key/unique identifier for the user
   * @description Auto-generated sequential ID for each user record
   */
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * @property {string} username - Username for login
   * @description Unique username used for authentication
   */
  @Column({ type: 'varchar', unique: true })
  username!: string

  /**
   * @property {string} email - Email address
   * @description Unique email address for the user
   */
  @Column({ type: 'varchar', unique: true })
  email!: string

  /**
   * @property {string} password - Hashed password
   * @description BCrypt-hashed password (never stored in plain text)
   */
  @Column({ type: 'varchar' })
  password!: string

  /**
   * @property {Date} createdAt - Timestamp of user creation
   * @description Automatically generated timestamp when the user was created
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
