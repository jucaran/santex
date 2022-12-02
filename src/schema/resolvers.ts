import { importLeague } from '../modules/competitions'
import { getLeaguePlayers } from '../modules/squad'
import { getTeam } from '../modules/teams'

export default {
  PlayersResult: {
    __resolveType: obj => (obj.position ? 'Player' : 'Coach')
  },
  Query: {
    players: (_, { leagueCode, teamName }) => getLeaguePlayers(leagueCode, teamName),
    team: (_, { name }) => getTeam(name)
  },
  Mutation: {
    importLeague: async (_, { leagueCode }) => importLeague(leagueCode)
  }
}
