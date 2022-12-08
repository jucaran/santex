import 'reflect-metadata'
import { createClient } from 'redis'
import { RedisClientType } from 'redis'
import { League, Team, Player, Coach } from './entities.js'
import { DataSource } from 'typeorm'

export const redis: RedisClientType<Record<string, never>, Record<string, never>> = createClient({
  url: process.env.REDIS_URL
})
redis.on('error', error => {
  throw Error('Redis error', { cause: { error } })
})

export const AppDataSource = new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  synchronize: true,
  // logging: true,
  entities: [League, Team, Player, Coach],
})
