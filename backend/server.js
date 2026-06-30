const path = require('path')
const createApp = require('./src/http/createApp')
const { createDatabase, SQLiteRepository } = require('./src/infrastructure/SQLiteRepository')

const PORT = process.env.PORT || 3000
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data/citizens.sqlite')

const db = createDatabase(DB_PATH)
const repository = new SQLiteRepository(db)
const app = createApp(repository)

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend rodando em http://localhost:${PORT}`)
  })
}

module.exports = app
