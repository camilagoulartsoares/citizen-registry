const {
  RegisterCitizen,
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('../../application/RegisterCitizen')
const FindCitizen = require('../../application/FindCitizen')
const ListCitizens = require('../../application/ListCitizens')

/**
 * Controller HTTP para operações com cidadãos.
 */
class CitizenController {
  constructor({ registerCitizen, findCitizen, listCitizens }) {
    this.registerCitizen = registerCitizen
    this.findCitizen = findCitizen
    this.listCitizens = listCitizens
  }

  async create(req, res, next) {
    try {
      const { name, cpf } = req.body
      const citizen = await this.registerCitizen.execute({ name, cpf })
      res.status(201).json(citizen.toJSON())
    } catch (error) {
      next(error)
    }
  }

  async list(req, res, next) {
    try {
      const { query, page, limit } = req.query

      // Modo busca: apenas query sem paginação explícita
      if (query && !page && !limit) {
        const citizens = await this.findCitizen.execute(query)
        return res.json(citizens.map((c) => c.toJSON()))
      }

      const result = await this.listCitizens.execute({ page, limit, query })
      res.json({
        data: result.data.map((c) => c.toJSON()),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    } catch (error) {
      next(error)
    }
  }
}

function createCitizenController(repository) {
  return new CitizenController({
    registerCitizen: new RegisterCitizen(repository),
    findCitizen: new FindCitizen(repository),
    listCitizens: new ListCitizens(repository),
  })
}

module.exports = {
  CitizenController,
  createCitizenController,
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
}
