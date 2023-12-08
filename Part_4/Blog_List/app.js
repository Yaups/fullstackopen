const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const apiRouter = require('./controllers/apiRouter')
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

app.use(apiRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app