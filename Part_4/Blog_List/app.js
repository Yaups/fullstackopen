const express = require('express')
require('express-async-errors')
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogsRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')
const config = require('./utils/config')
const mongoose = require('mongoose')
const app = express()

logger.info('Connecting to MongoDB.')
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB.'))
  .catch(error => logger.error(error))


app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use(loginRouter)
app.use(usersRouter)
app.use(blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/testRouter')
  app.use(testRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app