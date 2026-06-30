import { describe, it, expect } from 'vitest'
import { useCpfMask } from '@/composables/useCpfMask'

describe('useCpfMask', () => {
  const { unmask, mask, isValid } = useCpfMask()

  describe('unmask', () => {
    it('remove caracteres não numéricos', () => {
      expect(unmask('529.982.247-25')).toBe('52998224725')
      expect(unmask('abc123')).toBe('123')
    })

    it('retorna string vazia para valor nulo', () => {
      expect(unmask(null)).toBe('')
      expect(unmask(undefined)).toBe('')
    })
  })

  describe('mask', () => {
    it('formata CPF completo', () => {
      expect(mask('52998224725')).toBe('529.982.247-25')
    })

    it('formata parcialmente conforme digitação', () => {
      expect(mask('529')).toBe('529')
      expect(mask('529982')).toBe('529.982')
      expect(mask('529982247')).toBe('529.982.247')
    })

    it('limita a 11 dígitos', () => {
      expect(mask('529982247251234')).toBe('529.982.247-25')
    })
  })

  describe('isValid', () => {
    it('aceita CPF válido com ou sem máscara', () => {
      expect(isValid('52998224725')).toBe(true)
      expect(isValid('529.982.247-25')).toBe(true)
    })

    it('rejeita CPF com dígitos verificadores incorretos', () => {
      expect(isValid('52998224726')).toBe(false)
    })

    it('rejeita sequência de dígitos iguais', () => {
      expect(isValid('111.111.111-11')).toBe(false)
    })

    it('rejeita tamanho incorreto', () => {
      expect(isValid('123')).toBe(false)
      expect(isValid('')).toBe(false)
    })
  })
})
