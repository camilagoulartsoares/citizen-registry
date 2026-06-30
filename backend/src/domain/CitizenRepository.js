/**
 * Contrato do repositório de cidadãos (implementado por SQLiteRepository).
 */
class CitizenRepository {
  async create(_citizen) {
    throw new Error('Method create() must be implemented')
  }

  async findById(_id) {
    throw new Error('Method findById() must be implemented')
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

  async findAllForExport({ _query }) {
    throw new Error('Method findAllForExport() must be implemented')
  }

  async update(_id, _data) {
    throw new Error('Method update() must be implemented')
  }

  async delete(_id) {
    throw new Error('Method delete() must be implemented')
  }
}

module.exports = CitizenRepository
