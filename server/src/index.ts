import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { PrismaClient } from '@prisma/client'

import schemaTypes from './schema/types.js'
import queries from './schema/queries.js'
import mutations from './schema/mutations.js'
import resolvers from './schema/resolvers.js'
import logger from './logger.js'

export const prisma = new PrismaClient()

const typeDefs = [schemaTypes, queries, mutations].join('')

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, { listen: { port: parseInt(process.env.SERVER_PORT || '4000') } })
  .then(({ url }) => logger.info(`Service up and running on ${url}`))
  .catch(error => logger.error('Error running server', { error }))
  .finally(() => prisma.$disconnect())
