const Citizen = require('../domain/Citizen')
const CpfValidator = require('../domain/CpfValidator')

class DuplicateCpfError extends Error {
  constructor() {
    super('Este CPF já está cadastrado no sistema.')
    this.name = 'DuplicateCpfError'
    this.statusCode = 409
  }
}

class InvalidCpfError extends Error {
  constructor() {
    super('CPF inválido')
    this.name = 'InvalidCpfError'
    this.statusCode = 400
  }
}

class InvalidNameError extends Error {
  constructor() {
    super('Nome deve ter no mínimo 3 caracteres')
    this.name = 'InvalidNameError'
    this.statusCode = 400
  }
}

/**
 * Caso de uso: cadastrar um novo cidadão.
 */
class RegisterCitizen {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute({ name, cpf }) {
    const trimmedName = String(name ?? '').trim()
    const sanitizedCpf = CpfValidator.sanitize(cpf)

    if (trimmedName.length < 3) {
      throw new InvalidNameError()
    }

    if (!CpfValidator.isValid(sanitizedCpf)) {
      throw new InvalidCpfError()
    }

    const existing = await this.citizenRepository.findByCpf(sanitizedCpf)
    if (existing) {
      throw new DuplicateCpfError()
    }

    const citizen = await this.citizenRepository.create({
      name: trimmedName,
      cpf: sanitizedCpf,
    })

    return citizen instanceof Citizen ? citizen : new Citizen(citizen)
  }
}

module.exports = {
  RegisterCitizen,
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
}
