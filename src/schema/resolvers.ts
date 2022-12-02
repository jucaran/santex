import logger from '../logger'
import { GraphQLError } from 'graphql'
import { getCompetition, saveCompetition } from '../modules/competitions'
import { getTeams, saveTeams } from '../modules/teams'
import { saveAllPlayers, getLeaguePlayers } from '../modules/squad'

export default {
  PlayersResult: {
    __resolveType(obj) {
      if (obj.position) return 'Player'

      return 'Coach'
    }
  },
  Query: {
    players: (_, { leagueCode, teamName }) => getLeaguePlayers(leagueCode, teamName)
  },
  Mutation: {
    importLeague: async (_, { leagueCode }) => {
      logger.info(`Importing league: ${leagueCode}`)
      try {
        const [teams, competition] = await Promise.all([getTeams(leagueCode), getCompetition(leagueCode)])
        await saveCompetition(competition)
        await saveTeams(teams)
        await saveAllPlayers(teams)

        return 'League imported'
      } catch (e) {
        logger.error('Error trying to import league', { status: e.status, message: e.message, error: e })
        throw new GraphQLError('Error trying to import league', {
          extensions: {
            message: e.message,
            code: e.code
          }
        })
      }
    }
  }
}
