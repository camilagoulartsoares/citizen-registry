class Citizen {
  constructor({ id, name, cpf, createdAt }) {
    this.id = id
    this.name = name
    this.cpf = cpf
    this.createdAt = createdAt
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf,
      createdAt: this.createdAt,
    }
  }
}

module.exports = Citizen
