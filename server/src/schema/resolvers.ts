import { ApolloContext } from '../server.js'
import { getAllLeagues, getLeagueByName, importLeague } from '../modules/competitions.js'
import { getLeaguePlayers } from '../modules/squad.js'
import { getTeam } from '../modules/teams.js'

export default {
  Query: {
    players: (_, { leagueCode, teamName }, ctx: ApolloContext) => getLeaguePlayers({ leagueCode, teamName }, ctx),
    team: (_, { name }, ctx: ApolloContext) => getTeam(name, ctx),
    league: (_, { name }, ctx: ApolloContext) => getLeagueByName(name, ctx),
    leagues: (_, _args, ctx: ApolloContext) => getAllLeagues(ctx),
  },
  Mutation: {
    importLeague: async (_, { leagueCode }, ctx: ApolloContext) => importLeague(leagueCode, ctx)
  },
  PlayersResult: {
    __resolveType: obj => (obj.position ? 'Player' : 'Coach')
  }
}
