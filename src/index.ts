import 'reflect-metadata'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { AppDataSource } from './config/data-source.js'
import { typeDefs } from './graphql/schemas/index.js'
import { resolvers } from './graphql/resolvers/index.js'
import { getAuthContext } from './middleware/auth.js'

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
      introspection: true, // Allow introspection in production
      csrfPrevention: true, // Activate CSRF-skydd för säkerhet
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }), // Activate the playground in production
      ],
    })

    await server.start()

    app.use(
      '/graphql',
      cors<cors.CorsRequest>({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'apollo-require-preflight',
          'x-apollo-operation-name',
        ],
      }),
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
    const HOST = process.env.HOST || '0.0.0.0'

    httpServer.listen(PORT, () =>
      console.log(`🚀 Server ready at http://${HOST}:${PORT}/graphql`)
    )
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
