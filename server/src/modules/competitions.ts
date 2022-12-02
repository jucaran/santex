import logger from '../logger.js'
import got from 'got'
import { ApiCompetitionResponse } from '../types.js'
import { Competition } from '@prisma/client'
import { prisma } from '../index.js'
import { getTeamsFromAPI, saveTeams } from '../modules/teams.js'
import { saveAllPlayers } from '../modules/squad.js'
import { GraphQLError } from 'graphql'

/**
 * Takes a league code and saves the competition its teams and its players on the db
 * @param leagueCode The code of the required league
 */
export const importLeague = async (leagueCode: string) => {
  logger.info(`Importing league: ${leagueCode}`)
  try {
    const [teams, competition] = await Promise.all([getTeamsFromAPI(leagueCode), getCompetitionFromAPI(leagueCode)])
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

/**
 * Makes an api call to retrieve a competition by league code
 * @param leagueCode The code of the required league
 * @returns A promise that resolves in a parsed competition
 */
export const getCompetitionFromAPI = async (leagueCode: string): Promise<Competition> => {
  logger.info(`Importing competition: ${leagueCode}`)
  const competition: ApiCompetitionResponse = await got(`http://api.football-data.org/v4/competitions/${leagueCode}`, {
    headers: {
      'X-Auth-Token': process.env.API_TOKEN
    }
  }).json()
  logger.debug('Got competitions from API')

  return {
    id: competition.id,
    areaName: competition.area.name,
    code: competition.code,
    name: competition.name
  }
}

/**
 * Takes a competitions and saves it on the db
 * @param competition The competition to save on the db
 * @returns
 */
export const saveCompetition = async (competition: Competition): Promise<number> => {
  const result = await prisma.competition.upsert({
    create: competition,
    update: {
      areaName: competition.areaName,
      name: competition.name
    },
    where: {
      code: competition.code
    }
  })
  return result.id
}
