import winston from 'winston'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
  transports: [
    new winston.transports.Console({
      level: 'info'
    })
  ]
})

export default logger
