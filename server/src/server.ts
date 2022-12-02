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
import { getIp } from './utils.js'

const typeDefs = [schemaTypes, queries, mutations].join('')

export interface ApolloContext {
  ip?: string
  prisma: PrismaClient
  redis: RedisClientType<Record<string, never>, Record<string, never>>
}
const server = new ApolloServer<ApolloContext>({ typeDefs, resolvers })

export const startServer = async () => {

  logger.info('Connecting dbs...')
  await Promise.all([
    // Conects redis cache layer
    redis.connect().then(() => logger.info('Redis cache layer connected')),
    // Contects postgres db
    prisma.$connect().then(() => logger.info('Postgres db connected'))
  ])

  // Start graphql server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      // Gets the client ip to limit their request to the paid API
      return { ip: getIp(req), prisma, redis }
    },
    listen: { port: parseInt(process.env.SERVER_PORT || '4000') }
  })
  logger.info(`Service up and running on ${url}`)
}
