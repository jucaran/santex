import logger from '../logger.js'
import { GraphQLError } from 'graphql'
import { ApolloContext } from '../server.js'
import { Team, Coach, Player, League } from '../db/entities.js'
import { In } from 'typeorm'

/**
 * It takes a league code and returns a list of players/coachs from that league
 * @param leagueCode The code of league to retrieve players/coachs from
 * @param teamName An optional team name to filter players/coach by
 */
export const getLeaguePlayers = async (
  _,
  { leagueCode, teamName },
  { db }: ApolloContext
): Promise<Array<Coach | Player>> => {
  logger.info('Getting league players', { leagueCode, teamName })
  try {
    let teams = []
    if (teamName) {
      // If we have a teamName arg we get only that team
      teams = [await db.getRepository(Team).findOne({ where: { name: teamName }, loadRelationIds: true })]
    } else {
      // If we dont have a teamName arg we get all the teams from a given league
      const league = await db.getRepository(League).findOne({ where: { code: leagueCode }, relations: ['teams'] })
      teams = league.teams
    }

    return (
      await Promise.all(
        teams.map(team =>
          team.playersIds.length
            // If the team has any players we return them
            ? db.getRepository(Player).find({ where: { id: In(team.playersIds) } })
            // If it doesnt have players we return its coach
            : db.getRepository(Coach).find({ where: { teamId: team.id } })
        )
      )
    ).flat(1)
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
