/**
 * Composable para máscara e validação de CPF brasileiro.
 */
export function useCpfMask() {
  /**
   * Remove todos os caracteres não numéricos.
   */
  function unmask(value) {
    return String(value ?? '').replace(/\D/g, '')
  }

  /**
   * Aplica máscara 000.000.000-00 conforme o usuário digita.
   */
  function mask(value) {
    const digits = unmask(value).slice(0, 11)

    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  /**
   * Formata um CPF já completo (11 dígitos) para exibição.
   */
  function format(cpf) {
    const digits = unmask(cpf)
    if (digits.length !== 11) return cpf
    return mask(digits)
  }

  /**
   * Detecta se o valor digitado parece ser um CPF (predominância de dígitos).
   */
  function looksLikeCpf(value) {
    const str = String(value ?? '')
    const digits = unmask(str)
    if (digits.length === 0) return false
    // Aplica máscara quando há ao menos 3 dígitos e poucos caracteres alfabéticos
    const alphaCount = (str.match(/[a-zA-ZÀ-ÿ]/g) || []).length
    return alphaCount === 0 && digits.length >= 3
  }

  /**
   * Valida CPF com algoritmo oficial dos dígitos verificadores.
   */
  function isValid(cpf) {
    const digits = unmask(cpf)

    if (digits.length !== 11) return false

    // Rejeita sequências repetidas (111.111.111-11, etc.)
    if (/^(\d)\1{10}$/.test(digits)) return false

    const calcCheckDigit = (base, factor) => {
      let sum = 0
      for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i], 10) * (factor - i)
      }
      const remainder = (sum * 10) % 11
      return remainder === 10 ? 0 : remainder
    }

    const firstCheck = calcCheckDigit(digits.slice(0, 9), 10)
    const secondCheck = calcCheckDigit(digits.slice(0, 10), 11)

    return (
      firstCheck === parseInt(digits[9], 10) &&
      secondCheck === parseInt(digits[10], 10)
    )
  }

  return {
    unmask,
    mask,
    format,
    looksLikeCpf,
    isValid,
  }
}
