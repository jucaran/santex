import { League, Team } from '../db/entities.js'
import { ApolloContext } from '../server.js'
import { DataSource } from 'typeorm'

/**
 * Takes a league and saves it on the db
 * 
 * @param league The competition to save on the db
 * @returns
 */
export const saveLeague = async (league: League, teams: Team[], db: DataSource): Promise<number> => {
  const result = await db.getRepository(League).save({ ...league })
  return result.id
}

/**
 * Finds all the leagues on the db and returns them
 */
export const getAllLeagues = async (_: unknown, _args: unknown, { db }: ApolloContext) => {
  return await db.getRepository(League).find({ relations: { teams: true } })
}

/**
 * Finds a league by name on the db and returns it
 * 
 * @param name The name of the league that we want
 */
export const getLeagueByName = (_, { name }, { db }: ApolloContext) => {
  return db.getRepository(League).findOne({
    where: { name },
    relations: {
      teams: true
    }
  })
}
