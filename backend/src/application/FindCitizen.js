const CpfValidator = require('../domain/CpfValidator')

class FindCitizen {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute(query) {
    const trimmedQuery = String(query ?? '').trim()
    if (!trimmedQuery) {
      return []
    }

    const sanitized = CpfValidator.sanitize(trimmedQuery)
    const searchTerm = sanitized.length >= 3 && /^\d+$/.test(trimmedQuery.replace(/\D/g, ''))
      ? sanitized
      : trimmedQuery

    return this.citizenRepository.findByQuery(searchTerm)
  }
}

module.exports = FindCitizen
