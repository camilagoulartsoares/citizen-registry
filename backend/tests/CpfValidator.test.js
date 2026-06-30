const CpfValidator = require('../src/domain/CpfValidator')

describe('CpfValidator', () => {
  describe('sanitize', () => {
    it('remove caracteres não numéricos', () => {
      expect(CpfValidator.sanitize('123.456.789-09')).toBe('12345678909')
    })
  })

  describe('isValid', () => {
    it('aceita CPF válido', () => {
      expect(CpfValidator.isValid('529.982.247-25')).toBe(true)
      expect(CpfValidator.isValid('52998224725')).toBe(true)
    })

    it('rejeita CPF com dígitos verificadores incorretos', () => {
      expect(CpfValidator.isValid('123.456.789-00')).toBe(false)
    })

    it('rejeita CPF com todos os dígitos iguais', () => {
      expect(CpfValidator.isValid('111.111.111-11')).toBe(false)
      expect(CpfValidator.isValid('00000000000')).toBe(false)
    })

    it('rejeita CPF com tamanho incorreto', () => {
      expect(CpfValidator.isValid('123456789')).toBe(false)
      expect(CpfValidator.isValid('')).toBe(false)
    })
  })
})
