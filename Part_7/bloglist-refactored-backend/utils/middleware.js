const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('./config')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }
  else if (error.message.includes('E11000')) {
    return response.status(400).send({ error: 'Username already exists' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const hasBearerHeader = input => {
    return (input.startsWith('Bearer ') || input.startsWith('bearer '))
  }

  const authorization = request.get('authorization')
  if (authorization && hasBearerHeader(authorization)) {
    request.token = authorization.replace(/bearer /i, '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response
      .status(401)
      .json({ error: 'No auth token: It appears that you are not logged in.' })
  }
  const decodedToken = jwt.verify(request.token, config.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Invalid token' })
  }

  request.user = await User.findById(decodedToken.id)

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}