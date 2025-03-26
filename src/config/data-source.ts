import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // We dont want that typeORM create tables automatically
  logging: true,
  entities: ['src/models/**/*.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
})
