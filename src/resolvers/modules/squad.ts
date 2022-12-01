import logger from '../../logger'
import { Coach, Player } from '@prisma/client'
import { prisma } from '../..'
import { TeamWithSquad } from '../types'

/**
 * It takes an array of teams and save all of it's players/coach ond the db
 * @param teams an array of teams with its players and coach
 */
export const saveAllPlayers = async (teams: TeamWithSquad[]): Promise<void> => {
  await Promise.all(
    teams.map(team => {
      // If we have players we save them on the db
      if (team.players.length) return saveTeamPlayers(team.players, team.id)
      // If not we save the coach on the db
      else return saveCoach(team.coach, team.id)
    })
  )
}

/**
 * Save an array of players on the db
 * @param players The players to save on the db
 * @param teamId  The id of the team
 * @returns The count of the created players
 */
const saveTeamPlayers = async (players: Player[], teamId: number): Promise<{ count: number }> => {
  logger.debug('Saving player on db')
  return prisma.player.createMany({
    skipDuplicates: true,
    data: players.map(player => {
      return {
        teamId,
        dateOfBirth: player.dateOfBirth ?? '',
        name: player.name ?? '',
        nationality: player.nationality ?? '',
        position: player.position ?? '',
        id: player.id
      }
    })
  })
}

/**
 * Save a coach on the db
 * @param players The players to save on the db
 * @param teamId  The id of the team
 * @returns The count of the created players
 */
const saveCoach = async (coach: Coach, teamId: number): Promise<Coach> => {
  logger.debug('Saving coach on db', { coach })
  return prisma.coach.create({
    data: { ...coach, teamId }
  })
}
