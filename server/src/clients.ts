import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'
import { RedisClientType } from 'redis'

export const redis: RedisClientType<Record<string, never>, Record<string, never>> = createClient({
  url: process.env.REDIS_URL
})
redis.on('error', error => {
  throw Error('Redis error', { cause: { error } })
})

export const prisma = new PrismaClient()
