const Citizen = require('../domain/Citizen')

class CitizenNotFoundError extends Error {
  constructor() {
    super('Cidadão não encontrado')
    this.name = 'CitizenNotFoundError'
    this.statusCode = 404
  }
}

class GetCitizen {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute(id) {
    const citizen = await this.citizenRepository.findById(id)
    if (!citizen) {
      throw new CitizenNotFoundError()
    }
    return citizen instanceof Citizen ? citizen : new Citizen(citizen)
  }
}

module.exports = { GetCitizen, CitizenNotFoundError }
