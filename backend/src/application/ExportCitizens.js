/**
 * Caso de uso: exportar cidadãos para CSV (com filtro opcional).
 */
class ExportCitizens {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute({ query = '' } = {}) {
    return this.citizenRepository.findAllForExport({
      query: String(query ?? '').trim(),
    })
  }
}

module.exports = ExportCitizens
