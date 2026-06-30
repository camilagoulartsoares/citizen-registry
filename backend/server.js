const express = require('express')
const path = require('path')
const corsMiddleware = require('./src/http/middlewares/cors')
const errorHandler = require('./src/http/middlewares/errorHandler')
const createRoutes = require('./src/http/routes')
const { createDatabase, SQLiteRepository } = require('./src/infrastructure/SQLiteRepository')

const PORT = process.env.PORT || 3000
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data/citizens.sqlite')

const db = createDatabase(DB_PATH)
const repository = new SQLiteRepository(db)

const app = express()

app.use(corsMiddleware())
app.use(express.json())
app.use(createRoutes(repository))
app.use(errorHandler)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})

module.exports = app
