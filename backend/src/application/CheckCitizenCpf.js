const CpfValidator = require('../domain/CpfValidator')

class CheckCitizenCpf {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute(cpf) {
    const sanitized = CpfValidator.sanitize(cpf)

    if (!sanitized || !CpfValidator.isValid(sanitized)) {
      return { exists: false }
    }

    const existing = await this.citizenRepository.findByCpf(sanitized)
    return { exists: Boolean(existing) }
  }
}

module.exports = CheckCitizenCpf
