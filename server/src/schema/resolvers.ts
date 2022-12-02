import { importLeague } from '../modules/competitions.js'
import { getLeaguePlayers } from '../modules/squad.js'
import { getTeam } from '../modules/teams.js'

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
