const express = require('express')
const corsMiddleware = require('./middlewares/cors')
const errorHandler = require('./middlewares/errorHandler')
const createRoutes = require('./routes')

function createApp(repository) {
  const app = express()

  app.use(corsMiddleware())
  app.use(express.json())
  app.use(createRoutes(repository))
  app.use(errorHandler)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  return app
}

module.exports = createApp
