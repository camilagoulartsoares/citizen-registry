const { CitizenNotFoundError } = require('./GetCitizen')

/**
 * Caso de uso: remover cidadão.
 */
class DeleteCitizen {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute(id) {
    const existing = await this.citizenRepository.findById(id)
    if (!existing) {
      throw new CitizenNotFoundError()
    }

    await this.citizenRepository.delete(id)
    return { success: true }
  }
}

module.exports = DeleteCitizen
