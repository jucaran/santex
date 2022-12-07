import 'reflect-metadata'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { RedisClientType } from 'redis'

import schemaTypes from './schema/types.js'
import queries from './schema/queries.js'
import mutations from './schema/mutations.js'
import resolvers from './schema/resolvers.js'
import logger from './logger.js'
import { redis, AppDataSource } from './db/clients.js'
import { getIp } from './utils.js'
import { DataSource } from 'typeorm'

export interface ApolloContext {
  ip?: string
  db: DataSource
  redis: RedisClientType<Record<string, never>, Record<string, never>>
}

const typeDefs = [schemaTypes, queries, mutations].join('')

const server = new ApolloServer<ApolloContext>({ typeDefs, resolvers })

/**
 * It connects the the cache layer and the db and then it starts a graphQL server
 */
export const startServer = async () => {
  logger.info('Connecting dbs...')
  const [, db] = await Promise.all([
    // Conects redis cache layer
    redis.connect().then(() => logger.info('Redis cache layer connected')),
    // Contects postgres db
    AppDataSource.initialize().then(db => {
      logger.info('Postgres db connected')
      return db
    })
  ])

  // Start graphql server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      // Gets the client ip to limit their request to the paid API
      return { ip: getIp(req), db, redis }
    },
    listen: { port: parseInt(process.env.SERVER_PORT || '4000') }
  })
  logger.info(`Service up and running on ${url}`)
}
