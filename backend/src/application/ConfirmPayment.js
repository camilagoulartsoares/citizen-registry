const Citizen = require('../domain/Citizen')
const { CitizenNotFoundError } = require('./GetCitizen')

class PaymentAlreadyConfirmedError extends Error {
  constructor() {
    super('Pagamento já confirmado para este cidadão')
    this.name = 'PaymentAlreadyConfirmedError'
    this.statusCode = 409
  }
}

/**
 * Caso de uso: confirmar pagamento do cidadão.
 */
class ConfirmPayment {
  constructor(citizenRepository) {
    this.citizenRepository = citizenRepository
  }

  async execute(id) {
    const existing = await this.citizenRepository.findById(id)
    if (!existing) {
      throw new CitizenNotFoundError()
    }

    if (existing.paymentStatus === 'paid') {
      throw new PaymentAlreadyConfirmedError()
    }

    const updated = await this.citizenRepository.confirmPayment(id)
    return updated instanceof Citizen ? updated : new Citizen(updated)
  }
}

module.exports = { ConfirmPayment, PaymentAlreadyConfirmedError }
