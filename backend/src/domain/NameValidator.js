class NameValidator {
  static isValid(name) {
    const trimmed = String(name ?? '').trim()

    if (trimmed.length < 3) {
      return false
    }

    return /\p{L}/u.test(trimmed)
  }
}

module.exports = NameValidator
