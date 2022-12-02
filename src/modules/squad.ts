import logger from '../logger'
import { Coach, Player } from '@prisma/client'
import { prisma } from '..'
import { TeamWithSquad } from '../types'

/**
 * It takes an array of teams and save all of it's players/coach ond the db
 * @param teams an array of teams with its players and coach
 * @param leagueCode The code of the teams league
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
 */
const saveTeamPlayers = async (players: Player[], teamId: number): Promise<void> => {
  logger.debug('Saving players on db', { teamId })
  await prisma.player.createMany({
    skipDuplicates: true,
    data: players.map(player => {
      return {
        teamId,
        id: player.id,
        dateOfBirth: player.dateOfBirth,
        name: player.name,
        nationality: player.nationality,
        position: player.position
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
const saveCoach = async (coach: Coach, teamId: number): Promise<void> => {
  if (!coach.id) return
  await prisma.coach.upsert({
    create: {
      teamId,
      id: coach.id,
      dateOfBirth: coach.dateOfBirth,
      name: coach.name,
      nationality: coach.nationality
    },
    update: {
      teamId,
      id: coach.id,
      dateOfBirth: coach.dateOfBirth,
      name: coach.name,
      nationality: coach.nationality
    },
    where: { teamId }
  })
}

/**
 * It takes a league code and returns a list of players/coachs from that league
 * @param leagueCode The code of league to retrieve players/coachs from
 * @param leagueCode An optional team name to filter players/coach by
 */
export const getLeaguePlayers = async (leagueCode: string, teamName?: string): Promise<Array<Coach | Player>> => {
  logger.info('Getting league players', { leagueCode, teamName })
  const teams = await prisma.team.findMany({
    include: {
      players: true,
      coach: true
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
}
