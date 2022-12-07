import got from 'got'
import { GraphQLError } from 'graphql'

import { ApiCompetitionTeamsResponse } from '../types.js'
import logger from '../logger.js'
import { ApolloContext } from '../server.js'
import { In } from 'typeorm'
import { Coach, Player, Team } from '../db/entities.js'

/**
 * It takes a team name and returns a team object
 * 
 * @param name The name of the team that we want
 */
export const getTeam = async (_, { name }, { db }: ApolloContext): Promise<Team> => {
  logger.info('Getting team from db', { name })
  try {
    const result = await db.getRepository(Team).findOne({
      where: {
        name
      },
      relations: {
        leagues: true
      }
    })
    return result
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
export const getTeamsFromAPI = async (leagueCode: string): Promise<Team[]> => {
  logger.info(`Importing teams from API, league: ${leagueCode}`)
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
 * This function returs all the players of a team
 */
export const getTeamPlayers = (team: Team, _: unknown, { db }: ApolloContext) => {
  return db.getRepository(Player).find({
    where: {
      id: In(team.playersIds)
    }
  })
}

/**
 * This function returs the coach of a team
 */
export const getTeamCoach = (team: Team, _: unknown, { db }: ApolloContext) =>
      !team.playersIds.length
        ? db.getRepository(Coach).findOne({
            where: {
              id: team.coachId
            }
          })
        : null

