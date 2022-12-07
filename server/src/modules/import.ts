import logger from '../logger.js'
import { League, Player, Team } from '../db/entities.js'
import { getTeamsFromAPI } from './teams.js'
import { GraphQLError } from 'graphql'
import { ApolloContext } from '../server.js'
import { getTimePassed } from '../utils.js'
import { ApiCompetitionResponse } from '../types.js'
import got from 'got'

/**
 * Takes a league code and saves the competition its teams and its players on the db
 * @param leagueCode The code of the required league
 */
export const importLeague = async (_, { leagueCode }, { db, redis, ip }: ApolloContext) => {
  logger.info(`Importing league: ${leagueCode}`, { ip })

  const lastRead = await redis.get(leagueCode + ip)
  const secondsPassed = getTimePassed(lastRead)
  logger.debug('Got last read from cache layer', { lastRead, secondsPassed })

  if (lastRead && secondsPassed < 5) {
    logger.warn('Request not accepted because of timestamp difference', { secondsPassed, ip })
    throw new GraphQLError(`Last read was ${secondsPassed} seconds ago, only a request every 5 seconds is allowed`)
  }

  try {
    // Gets data from API
    const [teams, league] = await Promise.all([getTeamsFromAPI(leagueCode), getCompetitionFromAPI(leagueCode)])

    const teamsEntities = teams.map(team => {
      const teamEntity = db.getRepository(Team).create({
        address: team.address,
        areaName: team.areaName,
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        tla: team.tla,
        playersIds: team.players.map(({id}) => id),
      })
      if (team.coach.id) {
        teamEntity.coachId = team.coach.id
      }
      teamEntity.players = team.players.map(player => db.getRepository(Player).create(player))
      return teamEntity
    })

    await db.createQueryBuilder().insert().into(Team).values(teamsEntities).orIgnore().execute()

    const leagueEntity = db.getRepository(League).create(league)
    const saved = await db.getRepository(League).findOne({ where: { code: leagueCode } })
    if (!saved) {
      await db.manager.save(leagueEntity)
      await db.createQueryBuilder().relation(League, 'teams').of(leagueEntity).add(teamsEntities)
    } else {
      leagueEntity.teams = teamsEntities
      await db.manager.save(leagueEntity)
    }

    redis.set(leagueCode + ip, new Date().toString())

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

/**
 * Makes an api call to retrieve a league by league code
 * @param leagueCode The code of the required league
 * @returns A promise that resolves in a parsed competition
 */
export const getCompetitionFromAPI = async (leagueCode: string): Promise<League> => {
  logger.info(`Getting competition ${leagueCode} from API`)
  const league: ApiCompetitionResponse = await got(`http://api.football-data.org/v4/competitions/${leagueCode}`, {
    headers: {
      'X-Auth-Token': process.env.API_TOKEN
    }
  }).json()
  logger.debug('Got competitions from API')

  return {
    id: league.id,
    areaName: league.area.name,
    code: league.code,
    name: league.name
  }
}
