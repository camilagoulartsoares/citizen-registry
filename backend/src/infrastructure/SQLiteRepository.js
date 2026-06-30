const Database = require('better-sqlite3')
const path = require('path')
const Citizen = require('../domain/Citizen')
const CitizenRepository = require('../domain/CitizenRepository')
const CpfValidator = require('../domain/CpfValidator')

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

  db.exec(`CREATE INDEX IF NOT EXISTS idx_citizens_cpf ON citizens(cpf)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_citizens_name ON citizens(name)`)

  return db
}

const SELECT_FIELDS = `
  id, name, cpf, created_at AS createdAt
`

class SQLiteRepository extends CitizenRepository {
  constructor(db) {
    super()
    this.db = db

    this.insertStmt = db.prepare(`
      INSERT INTO citizens (name, cpf, created_at)
      VALUES (@name, @cpf, @created_at)
    `)

    this.findByIdStmt = db.prepare(`
      SELECT ${SELECT_FIELDS} FROM citizens WHERE id = ?
    `)

    this.findByCpfStmt = db.prepare(`
      SELECT ${SELECT_FIELDS} FROM citizens WHERE cpf = ?
    `)

    this.findByQueryStmt = db.prepare(`
      SELECT ${SELECT_FIELDS}
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
      SELECT ${SELECT_FIELDS}
      FROM citizens
      WHERE (? = '' OR cpf LIKE ? OR name LIKE ?)
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `)

    this.findAllForExportStmt = db.prepare(`
      SELECT ${SELECT_FIELDS}
      FROM citizens
      WHERE (? = '' OR cpf LIKE ? OR name LIKE ?)
      ORDER BY created_at DESC
    `)

    this.updateStmt = db.prepare(`
      UPDATE citizens SET name = @name, cpf = @cpf WHERE id = @id
    `)

    this.deleteStmt = db.prepare(`DELETE FROM citizens WHERE id = ?`)
  }

  _searchPatterns(query) {
    const sanitized = CpfValidator.sanitize(query)
    const isCpfSearch = /^\d+$/.test(sanitized) && sanitized.length >= 3
    const cpfPattern = isCpfSearch ? `%${sanitized}%` : `%${query}%`
    const namePattern = `%${query}%`
    return { cpfPattern, namePattern }
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
    return this.findById(result.lastInsertRowid)
  }

  async findById(id) {
    return this._mapRow(this.findByIdStmt.get(id))
  }

  async findByCpf(cpf) {
    const sanitized = CpfValidator.sanitize(cpf)
    return this._mapRow(this.findByCpfStmt.get(sanitized))
  }

  async findByQuery(query) {
    const { cpfPattern, namePattern } = this._searchPatterns(query)
    const rows = this.findByQueryStmt.all(cpfPattern, namePattern)
    return rows.map((row) => this._mapRow(row))
  }

  async findAll({ page, limit, query }) {
    const { cpfPattern, namePattern } = this._searchPatterns(query ?? '')
    const offset = (page - 1) * limit

    const { total } = this.countAllStmt.get(query ?? '', cpfPattern, namePattern)
    const rows = this.findAllStmt.all(query ?? '', cpfPattern, namePattern, limit, offset)

    return {
      data: rows.map((row) => this._mapRow(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    }
  }

  async findAllForExport({ query }) {
    const { cpfPattern, namePattern } = this._searchPatterns(query ?? '')
    const rows = this.findAllForExportStmt.all(query ?? '', cpfPattern, namePattern)
    return rows.map((row) => this._mapRow(row))
  }

  async update(id, { name, cpf }) {
    this.updateStmt.run({ id, name, cpf })
    return this.findById(id)
  }

  async delete(id) {
    this.deleteStmt.run(id)
  }
}

module.exports = { createDatabase, SQLiteRepository }
