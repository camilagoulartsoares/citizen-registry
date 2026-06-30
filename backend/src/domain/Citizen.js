/**
 * Entidade de domínio representando um cidadão cadastrado.
 */
class Citizen {
  constructor({ id, name, cpf, createdAt, paymentStatus, paidAt }) {
    this.id = id
    this.name = name
    this.cpf = cpf
    this.createdAt = createdAt
    this.paymentStatus = paymentStatus ?? 'pending'
    this.paidAt = paidAt ?? null
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf,
      createdAt: this.createdAt,
      paymentStatus: this.paymentStatus,
      paidAt: this.paidAt,
    }
  }
}

module.exports = Citizen
