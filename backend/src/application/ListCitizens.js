/**
 * Caso de uso: listar cidadãos com paginação e filtro opcional.
 */
class ListCitizens {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute({ page = 1, limit = 10, query = '' } = {}) {
    const safePage = Math.max(1, parseInt(page, 10) || 1)
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10))

    return this.citizenRepository.findAll({
      page: safePage,
      limit: safeLimit,
      query: String(query ?? '').trim(),
    })
  }
}

module.exports = ListCitizens
