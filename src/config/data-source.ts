import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Food } from '../models/Food.js'
import { Nutrition } from '../models/Nutrition.js'
import { Source } from '../models/Source.js'
import { Brand } from '../models/Brand.js'
import { Ingredient } from '../models/Ingredient.js'
import { User } from '../models/User.js'
dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Dont want that typeORM create tables automatically
  logging: true,
  entities: [Food, Nutrition, Source, Brand, Ingredient, User],
  migrations: ['src/db/migrations/**/*.js'],
})
