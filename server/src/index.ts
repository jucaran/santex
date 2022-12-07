import { AppDataSource, redis } from './db/clients.js'
import logger from './logger.js'
import { startServer } from './server.js'

/*
  This file is used to handle sistem errors and unhandledExceptions.
  The server is init at `./server.ts`
*/

/**
 * This function is triggered when there is an uncaught exception, it disconnects from the cache layer and the db
 */
const disconnect = async () => {
  await Promise.all([AppDataSource.destroy(), redis.disconnect()])
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
  setTimeout(disconnect, 1000).unref()
})
