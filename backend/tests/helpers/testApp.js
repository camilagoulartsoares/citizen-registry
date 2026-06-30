const { createDatabase, SQLiteRepository } = require('../../src/infrastructure/SQLiteRepository')
const createApp = require('../../src/http/createApp')

function createTestApp() {
  const db = createDatabase(':memory:')
  const repository = new SQLiteRepository(db)
  const app = createApp(repository)
  return { app, db, repository }
}

module.exports = { createTestApp }
