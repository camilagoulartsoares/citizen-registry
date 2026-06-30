const request = require('supertest')
const { createTestApp } = require('../helpers/testApp')
const {
  VALID_CPF,
  VALID_CPF_ALT,
  INVALID_CPF,
  buildCitizenPayload,
} = require('../helpers/fixtures')

describe('Citizens HTTP API', () => {
  let app
  let db

  beforeEach(() => {
    ;({ app, db } = createTestApp())
  })

  afterEach(() => {
    db.close()
  })

  describe('POST /citizens', () => {
    it('cadastra cidadão com dados válidos', async () => {
      const response = await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ cpf: '529.982.247-25' }))

      expect(response.status).toBe(201)
      expect(response.body.name).toBe('Maria Silva')
      expect(response.body.cpf).toBe(VALID_CPF)
      expect(response.body.id).toBeDefined()
      expect(response.body.createdAt).toBeDefined()
    })

    it('rejeita nome inválido', async () => {
      const response = await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ name: 'Ab' }))

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/mínimo 3/i)
    })

    it('rejeita CPF inválido', async () => {
      const response = await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ cpf: INVALID_CPF }))

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/cpf inválido/i)
    })

    it('rejeita corpo sem nome', async () => {
      const response = await request(app)
        .post('/citizens')
        .send({ cpf: VALID_CPF })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/mínimo 3/i)
    })

    it('rejeita CPF duplicado', async () => {
      await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ name: 'Outra Pessoa' }))

      expect(response.status).toBe(409)
      expect(response.body.message).toMatch(/cadastrado/i)
    })
  })

  describe('GET /citizens', () => {
    beforeEach(async () => {
      await request(app).post('/citizens').send(buildCitizenPayload())
      await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ name: 'Pedro Costa', cpf: VALID_CPF_ALT }))
    })

    it('busca simples por query', async () => {
      const response = await request(app).get('/citizens').query({ query: 'Maria' })

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].name).toBe('Maria Silva')
    })

    it('retorna lista vazia quando query não encontra resultados', async () => {
      const response = await request(app).get('/citizens').query({ query: 'Inexistente' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('lista paginada', async () => {
      const response = await request(app)
        .get('/citizens')
        .query({ page: 1, limit: 1 })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.total).toBe(2)
      expect(response.body.page).toBe(1)
      expect(response.body.limit).toBe(1)
      expect(response.body.totalPages).toBe(2)
    })

    it('retorna lista paginada vazia quando não há registros', async () => {
      db.close()
      ;({ app, db } = createTestApp())

      const response = await request(app).get('/citizens').query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body.data).toEqual([])
      expect(response.body.total).toBe(0)
      expect(response.body.totalPages).toBe(0)
    })
  })

  describe('GET /citizens/:id', () => {
    it('retorna cidadão por ID', async () => {
      const created = await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app).get(`/citizens/${created.body.id}`)

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Maria Silva')
      expect(response.body.cpf).toBe(VALID_CPF)
    })

    it('retorna 404 para ID inexistente', async () => {
      const response = await request(app).get('/citizens/999')

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Cidadão não encontrado')
    })
  })

  describe('PUT /citizens/:id', () => {
    it('atualiza cidadão existente', async () => {
      const created = await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app)
        .put(`/citizens/${created.body.id}`)
        .send(buildCitizenPayload({ name: 'Maria Santos' }))

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('Maria Santos')
      expect(response.body.cpf).toBe(VALID_CPF)
    })

    it('retorna 404 para ID inexistente', async () => {
      const response = await request(app)
        .put('/citizens/999')
        .send(buildCitizenPayload())

      expect(response.status).toBe(404)
    })

    it('rejeita nome inválido na atualização', async () => {
      const created = await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app)
        .put(`/citizens/${created.body.id}`)
        .send(buildCitizenPayload({ name: 'Ab' }))

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/mínimo 3/i)
    })

    it('rejeita CPF inválido na atualização', async () => {
      const created = await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app)
        .put(`/citizens/${created.body.id}`)
        .send(buildCitizenPayload({ cpf: INVALID_CPF }))

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/cpf inválido/i)
    })

    it('rejeita CPF duplicado na atualização', async () => {
      const first = await request(app).post('/citizens').send(buildCitizenPayload())
      await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ name: 'Pedro Costa', cpf: VALID_CPF_ALT }))

      const response = await request(app)
        .put(`/citizens/${first.body.id}`)
        .send(buildCitizenPayload({ cpf: VALID_CPF_ALT }))

      expect(response.status).toBe(409)
    })
  })

  describe('DELETE /citizens/:id', () => {
    it('remove cidadão existente', async () => {
      const created = await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app).delete(`/citizens/${created.body.id}`)

      expect(response.status).toBe(204)
      expect(response.body).toEqual({})

      const getResponse = await request(app).get(`/citizens/${created.body.id}`)
      expect(getResponse.status).toBe(404)
    })

    it('retorna 404 para ID inexistente', async () => {
      const response = await request(app).delete('/citizens/999')

      expect(response.status).toBe(404)
    })
  })

  describe('GET /citizens/export', () => {
    it('exporta CSV com cabeçalho e dados', async () => {
      await request(app).post('/citizens').send(buildCitizenPayload())

      const response = await request(app).get('/citizens/export')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toMatch(/text\/csv/)
      expect(response.headers['content-disposition']).toMatch(/cidadaos_.*\.csv/)
      expect(response.text).toContain('Nome;CPF;Data de cadastro')
      expect(response.text).toContain('Maria Silva')
      expect(response.text).toContain('529.982.247-25')
    })

    it('exporta apenas cabeçalho quando não há registros', async () => {
      const response = await request(app).get('/citizens/export')

      expect(response.status).toBe(200)
      expect(response.text.trim()).toBe('Nome;CPF;Data de cadastro')
    })

    it('aplica filtro query na exportação', async () => {
      await request(app).post('/citizens').send(buildCitizenPayload())
      await request(app)
        .post('/citizens')
        .send(buildCitizenPayload({ name: 'Pedro Costa', cpf: VALID_CPF_ALT }))

      const response = await request(app).get('/citizens/export').query({ query: 'Pedro' })

      expect(response.status).toBe(200)
      expect(response.text).toContain('Pedro Costa')
      expect(response.text).not.toContain('Maria Silva')
    })
  })
})
