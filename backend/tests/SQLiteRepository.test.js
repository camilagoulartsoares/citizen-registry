const { createDatabase, SQLiteRepository } = require('../src/infrastructure/SQLiteRepository')
const { VALID_CPF, VALID_CPF_ALT } = require('./helpers/fixtures')

describe('SQLiteRepository', () => {
  let db
  let repository

  beforeEach(() => {
    db = createDatabase(':memory:')
    repository = new SQLiteRepository(db)
  })

  afterEach(() => {
    db.close()
  })

  describe('create e findById', () => {
    it('persiste e recupera cidadão por ID', async () => {
      const created = await repository.create({
        name: 'Maria Silva',
        cpf: VALID_CPF,
      })

      expect(created.id).toBeDefined()
      expect(created.name).toBe('Maria Silva')
      expect(created.cpf).toBe(VALID_CPF)
      expect(created.createdAt).toBeDefined()

      const found = await repository.findById(created.id)
      expect(found.name).toBe('Maria Silva')
      expect(found.cpf).toBe(VALID_CPF)
    })

    it('retorna null para ID inexistente', async () => {
      const found = await repository.findById(999)
      expect(found).toBeNull()
    })
  })

  describe('findByCpf', () => {
    it('encontra cidadão pelo CPF sanitizado', async () => {
      await repository.create({ name: 'João Souza', cpf: VALID_CPF })

      const found = await repository.findByCpf('529.982.247-25')
      expect(found).not.toBeNull()
      expect(found.name).toBe('João Souza')
    })

    it('retorna null quando CPF não existe', async () => {
      const found = await repository.findByCpf(VALID_CPF)
      expect(found).toBeNull()
    })
  })

  describe('findByQuery', () => {
    beforeEach(async () => {
      await repository.create({ name: 'Maria Silva', cpf: VALID_CPF })
      await repository.create({ name: 'Pedro Costa', cpf: VALID_CPF_ALT })
    })

    it('busca por nome', async () => {
      const results = await repository.findByQuery('Maria')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Maria Silva')
    })

    it('busca por CPF parcial', async () => {
      const results = await repository.findByQuery('529982')
      expect(results).toHaveLength(1)
      expect(results[0].cpf).toBe(VALID_CPF)
    })
  })

  describe('findAll', () => {
    beforeEach(async () => {
      await repository.create({ name: 'Maria Silva', cpf: VALID_CPF })
      await repository.create({ name: 'Pedro Costa', cpf: VALID_CPF_ALT })
    })

    it('lista com paginação', async () => {
      const page1 = await repository.findAll({ page: 1, limit: 1, query: '' })

      expect(page1.data).toHaveLength(1)
      expect(page1.total).toBe(2)
      expect(page1.page).toBe(1)
      expect(page1.limit).toBe(1)
      expect(page1.totalPages).toBe(2)
    })

    it('filtra por query na listagem', async () => {
      const result = await repository.findAll({ page: 1, limit: 10, query: 'Pedro' })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Pedro Costa')
      expect(result.total).toBe(1)
    })
  })

  describe('findAllForExport', () => {
    it('retorna todos os registros sem paginação', async () => {
      await repository.create({ name: 'Maria Silva', cpf: VALID_CPF })
      await repository.create({ name: 'Pedro Costa', cpf: VALID_CPF_ALT })

      const all = await repository.findAllForExport({ query: '' })
      expect(all).toHaveLength(2)
    })

    it('aplica filtro de busca na exportação', async () => {
      await repository.create({ name: 'Maria Silva', cpf: VALID_CPF })
      await repository.create({ name: 'Pedro Costa', cpf: VALID_CPF_ALT })

      const filtered = await repository.findAllForExport({ query: 'Maria' })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('Maria Silva')
    })
  })

  describe('update', () => {
    it('atualiza nome e CPF', async () => {
      const created = await repository.create({ name: 'Maria Silva', cpf: VALID_CPF })

      const updated = await repository.update(created.id, {
        name: 'Maria Santos',
        cpf: VALID_CPF_ALT,
      })

      expect(updated.name).toBe('Maria Santos')
      expect(updated.cpf).toBe(VALID_CPF_ALT)

      const found = await repository.findById(created.id)
      expect(found.name).toBe('Maria Santos')
    })
  })

  describe('delete', () => {
    it('remove cidadão do banco', async () => {
      const created = await repository.create({ name: 'Maria Silva', cpf: VALID_CPF })

      await repository.delete(created.id)

      const found = await repository.findById(created.id)
      expect(found).toBeNull()
    })
  })
})
