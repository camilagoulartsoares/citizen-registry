const Citizen = require('../domain/Citizen')
const CpfValidator = require('../domain/CpfValidator')
const { CitizenNotFoundError } = require('./GetCitizen')
const {
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('./RegisterCitizen')

class UpdateCitizen {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute(id, { name, cpf }) {
    const existing = await this.citizenRepository.findById(id)
    if (!existing) {
      throw new CitizenNotFoundError()
    }

    const trimmedName = String(name ?? '').trim()
    const sanitizedCpf = CpfValidator.sanitize(cpf)

    if (trimmedName.length < 3) {
      throw new InvalidNameError()
    }

    if (!CpfValidator.isValid(sanitizedCpf)) {
      throw new InvalidCpfError()
    }

    if (sanitizedCpf !== existing.cpf) {
      const duplicate = await this.citizenRepository.findByCpf(sanitizedCpf)
      if (duplicate && duplicate.id !== existing.id) {
        throw new DuplicateCpfError()
      }
    }

    const updated = await this.citizenRepository.update(id, {
      name: trimmedName,
      cpf: sanitizedCpf,
    })

    return updated instanceof Citizen ? updated : new Citizen(updated)
  }
}

module.exports = UpdateCitizen
