import got from 'got'
import { GraphQLError } from 'graphql'
import { Coach, Player, Team } from '@prisma/client'

import { ApiCompetitionTeamsResponse } from '../types.js'
import { TeamWithSquad } from '../types.js'
import logger from '../logger.js'
import { prisma } from '../index.js'

/**
 * It takes a league code and returns a list of players/coachs from that league
 * @param leagueCode The code of league to retrieve players/coachs from
 * @param leagueCode An optional team name to filter players/coach by
 */
export const getTeam = async (name: string): Promise<TeamWithSquad> => {
  logger.info('Getting team', { name })
  try {
    return await prisma.team.findFirst({
      include: {
        players: true,
        coach: true
      },
      where: { name }
    })
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
 * Makes an api call to retrieve all the teams in a given league
 * @param leagueCode The code of the required league
 * @returns A promise that resolves in an array of teams with it's players and coach
 */
export const getTeamsFromAPI = async (leagueCode: string): Promise<TeamWithSquad[]> => {
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
          teamId: apiTeam.id,
          dateOfBirth: apiPlayer.dateOfBirth ?? '',
          name: apiPlayer.name ?? '',
          nationality: apiPlayer.nationality ?? '',
          position: apiPlayer.position ?? ''
        }
      }) as Player[],
      coach: {
        id: apiTeam.coach.id ?? undefined,
        teamId: apiTeam.id,
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
  logger.info('Saving teams on db')
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
}
