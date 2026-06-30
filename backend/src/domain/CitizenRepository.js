/**
 * Interface do repositório de cidadãos.
 * Implementações concretas ficam na camada de Infrastructure.
 */
class CitizenRepository {
  async create(_citizen) {
    throw new Error('Method create() must be implemented')
  }

  async findByCpf(_cpf) {
    throw new Error('Method findByCpf() must be implemented')
  }

  async findByQuery(_query) {
    throw new Error('Method findByQuery() must be implemented')
  }

  async findAll({ _page, _limit, _query }) {
    throw new Error('Method findAll() must be implemented')
  }
}

module.exports = CitizenRepository
