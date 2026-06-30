const Database = require('better-sqlite3')
const path = require('path')
const Citizen = require('../domain/Citizen')
const CitizenRepository = require('../domain/CitizenRepository')
const CpfValidator = require('../domain/CpfValidator')

/**
 * Inicializa conexão SQLite e cria tabela se necessário.
 */
function createDatabase(dbPath) {
  const resolvedPath = dbPath || path.join(__dirname, '../../data/citizens.sqlite')
  const db = new Database(resolvedPath)

  db.exec(`
    CREATE TABLE IF NOT EXISTS citizens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_citizens_cpf ON citizens(cpf)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_citizens_name ON citizens(name)
  `)

  return db
}

/**
 * Implementação SQLite do repositório de cidadãos.
 * Utiliza prepared statements para segurança contra SQL injection.
 */
class SQLiteRepository extends CitizenRepository {
  constructor(db) {
    super()
    this.db = db

    this.insertStmt = db.prepare(`
      INSERT INTO citizens (name, cpf, created_at)
      VALUES (@name, @cpf, @created_at)
    `)

    this.findByCpfStmt = db.prepare(`
      SELECT id, name, cpf, created_at AS createdAt
      FROM citizens
      WHERE cpf = ?
    `)

    this.findByQueryStmt = db.prepare(`
      SELECT id, name, cpf, created_at AS createdAt
      FROM citizens
      WHERE cpf LIKE ? OR name LIKE ?
      ORDER BY created_at DESC
      LIMIT 10
    `)

    this.countAllStmt = db.prepare(`
      SELECT COUNT(*) AS total FROM citizens
      WHERE (? = '' OR cpf LIKE ? OR name LIKE ?)
    `)

    this.findAllStmt = db.prepare(`
      SELECT id, name, cpf, created_at AS createdAt
      FROM citizens
      WHERE (? = '' OR cpf LIKE ? OR name LIKE ?)
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `)
  }

  _mapRow(row) {
    if (!row) return null
    return new Citizen({
      id: row.id,
      name: row.name,
      cpf: row.cpf,
      createdAt: row.createdAt,
    })
  }

  async create({ name, cpf }) {
    const createdAt = new Date().toISOString()
    const result = this.insertStmt.run({ name, cpf, created_at: createdAt })
    return this._mapRow({
      id: result.lastInsertRowid,
      name,
      cpf,
      createdAt,
    })
  }

  async findByCpf(cpf) {
    const sanitized = CpfValidator.sanitize(cpf)
    return this._mapRow(this.findByCpfStmt.get(sanitized))
  }

  async findByQuery(query) {
    const sanitized = CpfValidator.sanitize(query)
    const isCpfSearch = /^\d+$/.test(sanitized) && sanitized.length >= 3
    const cpfPattern = isCpfSearch ? `%${sanitized}%` : `%${query}%`
    const namePattern = `%${query}%`

    const rows = this.findByQueryStmt.all(cpfPattern, namePattern)
    return rows.map((row) => this._mapRow(row))
  }

  async findAll({ page, limit, query }) {
    const sanitized = CpfValidator.sanitize(query)
    const isCpfSearch = /^\d+$/.test(sanitized) && sanitized.length >= 3
    const cpfPattern = isCpfSearch ? `%${sanitized}%` : `%${query}%`
    const namePattern = `%${query}%`
    const offset = (page - 1) * limit

    const { total } = this.countAllStmt.get(query, cpfPattern, namePattern)
    const rows = this.findAllStmt.all(query, cpfPattern, namePattern, limit, offset)

    return {
      data: rows.map((row) => this._mapRow(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    }
  }
}

module.exports = { createDatabase, SQLiteRepository }
