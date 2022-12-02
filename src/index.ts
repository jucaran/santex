import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { PrismaClient } from '@prisma/client'

import schemaTypes from './schema/types'
import queries from './schema/queries'
import mutations from './schema/mutations'
import resolvers from './schema/resolvers'
import logger from './logger'

export const prisma = new PrismaClient()

const typeDefs = [schemaTypes, queries, mutations].join('')

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server)
  .then(({ url }) => logger.info(`Service up and running on ${url}`))
  .catch(error => logger.error('Error running server', { error }))
  .finally(() => prisma.$disconnect())
