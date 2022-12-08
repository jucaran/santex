import { getAllLeagues, getLeagueByName } from '../modules/leagues.js'
import { importLeague } from '../modules/import.js'
import { getLeaguePlayers } from '../modules/squad.js'
import { getTeam, getTeamCoach, getTeamPlayers } from '../modules/teams.js'

export default {
  Query: {
    players: getLeaguePlayers,
    team: getTeam,
    league: getLeagueByName,
    leagues: getAllLeagues
  },
  Mutation: {
    importLeague: importLeague
  },
  Team: {
    players: getTeamPlayers,
    coach: getTeamCoach
  },
  PlayersResult: {
    __resolveType: obj => (obj.position ? 'Player' : 'Coach')
  }
}
