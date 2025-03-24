// Entry point for the GraphQL API server
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Define a simple schema to start with
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`

// Define resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

async function startServer() {
  // Create Express application
  const app = express()

  // Create HTTP server
  const httpServer = http.createServer(app)

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  // Start the Apollo Server
  await server.start()

  // Apply middleware to Express
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server)
  )

  // Start the server
  const PORT = process.env.PORT || 4000
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, resolve)
  })

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
}

// Start the server
startServer().catch((err) => {
  console.error('Error starting server:', err)
})
