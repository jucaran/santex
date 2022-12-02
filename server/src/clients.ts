import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'
import logger from './logger.js'
import { RedisClientType } from 'redis'

export const redis: RedisClientType<Record<string, never>, Record<string, never>> = createClient({
  url: process.env.REDIS_URL
})
redis.on('error', (error) => logger.info('Redis error', { error }))

export const prisma = new PrismaClient()