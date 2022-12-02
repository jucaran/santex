import { prisma, redis } from './clients.js'
import logger from './logger.js'
import { startServer } from './server.js'

const disconnect = async () => {
  await Promise.all([prisma.$disconnect(), redis.disconnect()])
  process.exit(1)
}

process.on('uncaughtException', err => {
  logger.error('Fatal error', { data: { error: err } })
  setTimeout(disconnect, 1000).unref()
})

process.on('unhandledRejection', err => {
  logger.error('Fatal error', { data: { error: err } })
  setTimeout(disconnect, 1000).unref()
})

process.on('SIGTERM', err => {
  logger.error('Stopping...', { data: { error: err } })
  setTimeout(disconnect, 100).unref()
})

startServer().catch((error: Error) => {
  logger.error('Error running server', { error })
  disconnect()
})
