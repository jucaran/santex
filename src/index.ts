import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import schemaTypes from './schema/types'
import schemaQuerys from './schema/query'
import resolvers from './resolvers'
import logger from './logger'

const typeDefs = [schemaTypes, schemaQuerys].join('')

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server).then(({ url }) => logger.info(`Service up and running on ${url}`))
