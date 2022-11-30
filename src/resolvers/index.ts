import axios from 'axios'
import logger from '../logger'
import { GraphQLError } from 'graphql'

export default {
  Query: {
    hello: () => {
      logger.warn('no idea')
      return 'test'
    }
  },
  Mutation: {
    importLeague: async (_, { leagueCode }) => {
      logger.info(`Importing league: ${leagueCode}`)
      try {
        await axios.get(`http://api.football-data.org/v4/competitions/${leagueCode}`, {
          headers: {
            'X-Auth-Token': process.env.API_TOKEN
          }
        })
        return 'OK'
      } catch (e) {
        logger.error('Error trying to import league', { status: e.status, message: e.message })
        throw new GraphQLError(e.message, {
          extensions: {
            code: e.code,
          },
        })
      }
    }
  }
}
