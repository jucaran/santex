import logger from '../logger.js'
import { Coach, Player, PrismaClient } from '@prisma/client'
import { TeamWithSquad } from '../types.js'
import { GraphQLError } from 'graphql'
import { ApolloContext } from '../server.js'

/**
 * It takes a league code and returns a list of players/coachs from that league
 * @param leagueCode The code of league to retrieve players/coachs from
 * @param leagueCode An optional team name to filter players/coach by
 */
export const getLeaguePlayers = async (
  { leagueCode, teamName },
  { prisma }: ApolloContext
): Promise<Array<Coach | Player>> => {
  logger.info('Getting league players', { leagueCode, teamName })
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: {
          include: {
            team: true
          }
        },
        coach: {
          include: {
            team: true
          }
        }
      },
      where: teamName ? { leagueCode, name: teamName } : { leagueCode }
    })

    // This flattens the results array
    return teams.reduce((acc, team) => {
      // If there are players we add them
      if (team.players.length) return [...acc, ...team.players]
      // If there are not players but there is a coach we add them
      if (team.coach != null) return [...acc, team.coach]
      // If there are neither we dont add anything
      else return acc
    }, [])
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
 * It takes an array of teams and save all of it's players/coach ond the db
 * @param teams an array of teams with its players and coach
 * @param leagueCode The code of the teams league
 */
export const saveAllPlayers = async (teams: TeamWithSquad[], prisma: PrismaClient): Promise<void> => {
  logger.info('Saving players/coachs on db')

  // Creates an array with all the players
  const playersToAdd = teams.reduce((acc, team) => {
    return [...acc, ...team.players]
  }, [])

  // Creates an array with all the coaches of the teams without players
  const coachesToAdd = teams.reduce((acc, team) => (team.players.length ? acc : [...acc, team.coach]), [])

  await Promise.all([
    // We add all the players in the array to the db
    prisma.player.createMany({
      skipDuplicates: true,
      data: playersToAdd.map((player: Player) => ({
        teamId: player.teamId,
        id: player.id,
        dateOfBirth: player.dateOfBirth,
        name: player.name,
        nationality: player.nationality,
        position: player.position
      }))
    }),
    // The same with all the coachs
    prisma.coach.createMany({
      skipDuplicates: true,
      data: coachesToAdd.map((coach: Coach) => ({
        teamId: coach.teamId,
        id: coach.id,
        dateOfBirth: coach.dateOfBirth,
        name: coach.name,
        nationality: coach.nationality
      }))
    })
  ])
  logger.info('Players saved')
}
