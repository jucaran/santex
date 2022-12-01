import logger from '../../logger'
import got from 'got'
import { ApiCompetitionResponse } from '../types'
import { Competition } from '@prisma/client'
import { prisma } from '../..'

/**
 * Makes an api call to retrieve a competition by league code
 * @param leagueCode The code of the required league
 * @returns A promise that resolves in a parsed competition
 */
export const getCompetition = async (leagueCode: string): Promise<Competition> => {
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
