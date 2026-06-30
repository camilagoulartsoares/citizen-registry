const NameValidator = require('../src/domain/NameValidator')

describe('NameValidator', () => {
  it('aceita nomes com letras e no mínimo 3 caracteres', () => {
    expect(NameValidator.isValid('Maria Silva')).toBe(true)
    expect(NameValidator.isValid('João')).toBe(true)
  })

  it('rejeita nomes com menos de 3 caracteres', () => {
    expect(NameValidator.isValid('Ab')).toBe(false)
    expect(NameValidator.isValid('')).toBe(false)
  })

  it('rejeita nomes apenas com números', () => {
    expect(NameValidator.isValid('123')).toBe(false)
    expect(NameValidator.isValid('999999')).toBe(false)
  })
})
