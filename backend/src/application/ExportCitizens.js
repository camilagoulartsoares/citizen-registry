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
