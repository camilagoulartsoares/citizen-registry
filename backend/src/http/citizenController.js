const { RegisterCitizen } = require('../application/RegisterCitizen')
const FindCitizen = require('../application/FindCitizen')
const ListCitizens = require('../application/ListCitizens')
const { GetCitizen, CitizenNotFoundError } = require('../application/GetCitizen')
const UpdateCitizen = require('../application/UpdateCitizen')
const DeleteCitizen = require('../application/DeleteCitizen')
const ExportCitizens = require('../application/ExportCitizens')
const CheckCitizenCpf = require('../application/CheckCitizenCpf')
const { citizensToCsv } = require('../infrastructure/csvExport')

class CitizenController {
  constructor(useCases) {
    Object.assign(this, useCases)
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

  async getById(req, res, next) {
    try {
      const citizen = await this.getCitizen.execute(Number(req.params.id))
      res.json(citizen.toJSON())
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const citizen = await this.updateCitizen.execute(Number(req.params.id), req.body)
      res.json(citizen.toJSON())
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      await this.deleteCitizen.execute(Number(req.params.id))
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  async checkCpf(req, res, next) {
    try {
      const result = await this.checkCitizenCpf.execute(req.params.cpf)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async exportCsv(req, res, next) {
    try {
      const citizens = await this.exportCitizens.execute({ query: req.query.query })
      const csv = `\uFEFF${citizensToCsv(citizens)}`
      const filename = `cidadaos_${new Date().toISOString().slice(0, 10)}.csv`

      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      res.send(csv)
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
    getCitizen: new GetCitizen(repository),
    updateCitizen: new UpdateCitizen(repository),
    deleteCitizen: new DeleteCitizen(repository),
    exportCitizens: new ExportCitizens(repository),
    checkCitizenCpf: new CheckCitizenCpf(repository),
  })
}

module.exports = {
  CitizenController,
  createCitizenController,
}
