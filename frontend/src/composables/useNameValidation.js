export const NAME_VALIDATION_MESSAGE =
  'Nome deve ter no mínimo 3 caracteres e conter letras.'

export function isValidName(name) {
  const trimmed = String(name ?? '').trim()

  if (trimmed.length < 3) {
    return false
  }

  return /\p{L}/u.test(trimmed)
}
