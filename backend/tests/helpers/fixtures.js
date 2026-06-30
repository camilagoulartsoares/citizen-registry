const VALID_CPF = '52998224725'
const VALID_CPF_ALT = '11144477735'
const INVALID_CPF = '11111111111'

function buildCitizenPayload(overrides = {}) {
  return {
    name: 'Maria Silva',
    cpf: VALID_CPF,
    ...overrides,
  }
}

module.exports = {
  VALID_CPF,
  VALID_CPF_ALT,
  INVALID_CPF,
  buildCitizenPayload,
}
