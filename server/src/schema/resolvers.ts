import { ApolloContext } from '../index.js'
import { importLeague } from '../modules/competitions.js'
import { getLeaguePlayers } from '../modules/squad.js'
import { getTeam } from '../modules/teams.js'

export default {
  Query: {
    players: (_, { leagueCode, teamName }, context: ApolloContext) =>
      getLeaguePlayers({ leagueCode, teamName }, context.prisma),
    team: (_, { name }, context: ApolloContext) => getTeam(name, context.prisma)
  },
  Mutation: {
    importLeague: async (_, { leagueCode }, context: ApolloContext) => importLeague(leagueCode, context)
  },
  PlayersResult: {
    __resolveType: obj => (obj.position ? 'Player' : 'Coach')
  }
}
