const swaggerJsdoc = require('swagger-jsdoc')

const citizenSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Maria Silva' },
    cpf: { type: 'string', example: '52998224725' },
    createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
  },
}

const citizenInputSchema = {
  type: 'object',
  required: ['name', 'cpf'],
  properties: {
    name: { type: 'string', minLength: 3, example: 'Maria Silva' },
    cpf: { type: 'string', example: '529.982.247-25' },
  },
}

const errorSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', example: 'CPF inválido' },
  },
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cadastro CPF API',
      version: '1.0.0',
      description: 'API REST para cadastro e consulta de cidadãos brasileiros por CPF.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desenvolvimento local' },
    ],
    components: {
      schemas: {
        Citizen: citizenSchema,
        CitizenInput: citizenInputSchema,
        PaginatedCitizens: {
          type: 'object',
          properties: {
            data: { type: 'array', items: citizenSchema },
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
          },
        },
        Error: errorSchema,
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Sistema'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'Serviço disponível',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Health' } } },
            },
          },
        },
      },
      '/citizens': {
        get: {
          tags: ['Cidadãos'],
          summary: 'Listar ou buscar cidadãos',
          parameters: [
            { name: 'query', in: 'query', schema: { type: 'string' }, description: 'Busca por nome ou CPF' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
          ],
          responses: {
            200: {
              description: 'Lista paginada ou busca simples (array quando só `query` é enviado)',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { $ref: '#/components/schemas/PaginatedCitizens' },
                      { type: 'array', items: { $ref: '#/components/schemas/Citizen' } },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Cidadãos'],
          summary: 'Cadastrar cidadão',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CitizenInput' } } },
          },
          responses: {
            201: {
              description: 'Cidadão criado',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Citizen' } } },
            },
            400: { description: 'Nome ou CPF inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            409: { description: 'CPF já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/citizens/export': {
        get: {
          tags: ['Cidadãos'],
          summary: 'Exportar cidadãos em CSV',
          parameters: [
            { name: 'query', in: 'query', schema: { type: 'string' }, description: 'Filtro opcional por nome ou CPF' },
          ],
          responses: {
            200: {
              description: 'Arquivo CSV',
              content: { 'text/csv': { schema: { type: 'string', format: 'binary' } } },
            },
          },
        },
      },
      '/citizens/{id}': {
        get: {
          tags: ['Cidadãos'],
          summary: 'Buscar cidadão por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Cidadão encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Citizen' } } } },
            404: { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        put: {
          tags: ['Cidadãos'],
          summary: 'Atualizar cidadão',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CitizenInput' } } },
          },
          responses: {
            200: { description: 'Cidadão atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Citizen' } } } },
            400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            409: { description: 'CPF duplicado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['Cidadãos'],
          summary: 'Remover cidadão',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'Removido com sucesso' },
            404: { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  },
  apis: [],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
