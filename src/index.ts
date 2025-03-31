import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { AppDataSource } from './config/data-source'
import { typeDefs } from './graphql/schemas'
import { resolvers } from './graphql/resolvers'
import { getAuthContext } from './middleware/auth'

dotenv.config()

async function startServer() {
  try {
    // Initialize the connection to the database
    await AppDataSource.initialize()
    console.log('✅ Connected to PostgreSQL')

    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    await server.start()

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          // Get authentication context
          const authContext = await getAuthContext(req)

          // Return context with auth info and data source
          return {
            ...authContext,
            dataSource: AppDataSource,
          }
        },
      })
    )

    const PORT = process.env.PORT || 4000
    httpServer.listen(PORT, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    )
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
