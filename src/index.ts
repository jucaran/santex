import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import schemaTypes from './schema/types'
import queries from './schema/queries'
import mutations from './schema/mutations'
import resolvers from './resolvers/index'
import logger from './logger'

const typeDefs = [schemaTypes, queries, mutations].join('')

const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server).then(({ url }) => logger.info(`Service up and running on ${url}`))
