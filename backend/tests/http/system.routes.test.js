const request = require('supertest')
const { createTestApp } = require('../helpers/testApp')

describe('System HTTP routes', () => {
  let app
  let db

  beforeEach(() => {
    ;({ app, db } = createTestApp())
  })

  afterEach(() => {
    db.close()
  })

  describe('GET /health', () => {
    it('retorna status ok', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ status: 'ok' })
    })
  })

  describe('GET /', () => {
    it('redireciona para o Swagger', async () => {
      const response = await request(app).get('/')

      expect(response.status).toBe(302)
      expect(response.headers.location).toBe('/api-docs')
    })
  })

  describe('GET /api-docs.json', () => {
    it('expõe especificação OpenAPI', async () => {
      const response = await request(app).get('/api-docs.json')

      expect(response.status).toBe(200)
      expect(response.body.openapi).toBe('3.0.0')
      expect(response.body.paths['/health']).toBeDefined()
      expect(response.body.paths['/citizens']).toBeDefined()
      expect(response.body.paths['/citizens/export']).toBeDefined()
    })
  })

  describe('CORS', () => {
    it('inclui cabeçalho Access-Control-Allow-Origin', async () => {
      const response = await request(app).get('/health')

      expect(response.headers['access-control-allow-origin']).toBe('*')
    })
  })

  describe('Rotas inexistentes', () => {
    it('retorna 404 para rota desconhecida', async () => {
      const response = await request(app).get('/rota-inexistente')

      expect(response.status).toBe(404)
    })
  })

  describe('JSON inválido', () => {
    it('retorna 400 para corpo malformado', async () => {
      const response = await request(app)
        .post('/citizens')
        .set('Content-Type', 'application/json')
        .send('{ nome: invalido }')

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/json inválido/i)
    })
  })
})
