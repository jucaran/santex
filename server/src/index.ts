import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { PrismaClient } from '@prisma/client'
import { RedisClientType } from 'redis'

import schemaTypes from './schema/types.js'
import queries from './schema/queries.js'
import mutations from './schema/mutations.js'
import resolvers from './schema/resolvers.js'
import logger from './logger.js'
import { redis, prisma } from './clients.js'

const typeDefs = [schemaTypes, queries, mutations].join('')

export interface ApolloContext {
  ip?: string
  prisma: PrismaClient,
  redis: RedisClientType<Record<string, never>, Record<string, never>>
}
const server = new ApolloServer<ApolloContext>({ typeDefs, resolvers })

try {
  // Start redis cache layer
  await redis.connect()
  logger.info('Redis connected')

  // Start graphql server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      // Gets the client ip to limit their request to the paid API
      const ip =
        (Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'].shift()
          : req.headers['x-forwarded-for']) || req.socket?.remoteAddress
          
      return { ip, prisma, redis }
    },
    listen: { port: parseInt(process.env.SERVER_PORT || '4000') }
  })
  logger.info(`Service up and running on ${url}`)
} catch (error) {
  logger.error('Error running server', { error })
}
