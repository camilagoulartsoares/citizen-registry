const CpfValidator = require('../domain/CpfValidator')

function formatCpf(cpf) {
  const digits = CpfValidator.sanitize(cpf)
  if (digits.length !== 11) return cpf
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function escapeCsvField(value) {
  const str = String(value ?? '')
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function citizensToCsv(citizens) {
  const header = ['Nome', 'CPF', 'Data de cadastro']
  const rows = citizens.map((citizen) => {
    const data = typeof citizen.toJSON === 'function' ? citizen.toJSON() : citizen
    return [
      escapeCsvField(data.name),
      escapeCsvField(formatCpf(data.cpf)),
      escapeCsvField(formatDate(data.createdAt)),
    ].join(';')
  })

  return [header.join(';'), ...rows].join('\r\n')
}

module.exports = { citizensToCsv }
