class CpfValidator {
  static sanitize(cpf) {
    return String(cpf ?? '').replace(/\D/g, '')
  }

  static isValid(cpf) {
    const digits = CpfValidator.sanitize(cpf)

    if (digits.length !== 11) return false
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
}

module.exports = CpfValidator
