import logger from '../logger'
import got from 'got'
import { ApiCompetitionTeamsResponse } from '../types'
import { Coach, Player, Team } from '@prisma/client'
import { TeamWithSquad } from '../types'
import { prisma } from '..'

/**
 * Makes an api call to retrieve all the teams in a given league
 * @param leagueCode The code of the required league
 * @returns A promise that resolves in an array of teams with it's players and coach
 */
export const getTeams = async (leagueCode: string): Promise<TeamWithSquad[]> => {
  logger.info(`Importing team: ${leagueCode}`)
  const apiResponse: ApiCompetitionTeamsResponse = await got(
    `http://api.football-data.org/v4/competitions/${leagueCode}/teams`,
    {
      headers: {
        'X-Auth-Token': process.env.API_TOKEN
      }
    }
  ).json()

  const teams = apiResponse.teams.map(apiTeam => {
    return {
      id: apiTeam.id,
      address: apiTeam.address ?? '',
      areaName: apiTeam.area.name ?? '',
      leagueCode: leagueCode ?? '',
      name: apiTeam.name ?? '',
      shortName: apiTeam.shortName ?? '',
      tla: apiTeam.tla ?? '',
      players: apiTeam.squad.map(apiPlayer => {
        return {
          id: apiPlayer.id ?? undefined,
          dateOfBirth: apiPlayer.dateOfBirth ?? '',
          name: apiPlayer.name ?? '',
          nationality: apiPlayer.nationality ?? '',
          position: apiPlayer.position ?? ''
        }
      }) as Player[],
      coach: {
        id: apiTeam.coach.id ?? undefined,
        dateOfBirth: apiTeam.coach.dateOfBirth ?? '',
        name: apiTeam.coach.name ?? '',
        nationality: apiTeam.coach.nationality ?? ''
      } as Coach
    }
  })

  return teams
}

/**
 * Takes an array of teams and saves them on the db
 * @param teams The teams to save on the db
 */
export const saveTeams = async (teams: Team[]): Promise<void> => {
  await prisma.team.createMany({
    skipDuplicates: true,
    data: teams.map(team => ({
      id: team.id,
      address: team.address,
      areaName: team.areaName,
      leagueCode: team.leagueCode,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla
    }))
  })
  logger.info('saved teams on db')
}
