const express = require('express')
const swaggerUi = require('swagger-ui-express')
const corsMiddleware = require('./middlewares/cors')
const rateLimitMiddleware = require('./middlewares/rateLimit')
const errorHandler = require('./middlewares/errorHandler')
const createRoutes = require('./routes')
const swaggerSpec = require('./swagger')

function createApp(repository) {
  const app = express()

  app.use(corsMiddleware())
  app.use(rateLimitMiddleware())
  app.use(express.json())

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec)
  })

  app.use(createRoutes(repository))
  app.use(errorHandler)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  return app
}

module.exports = createApp
