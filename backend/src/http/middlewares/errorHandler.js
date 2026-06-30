const {
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('../../application/RegisterCitizen')
const { CitizenNotFoundError } = require('../../application/GetCitizen')

function errorHandler(err, _req, res, _next) {
  if (err instanceof DuplicateCpfError) {
    return res.status(409).json({ message: err.message })
  }

  if (err instanceof CitizenNotFoundError) {
    return res.status(404).json({ message: err.message })
  }

  if (err instanceof InvalidCpfError || err instanceof InvalidNameError) {
    return res.status(400).json({ message: err.message })
  }

  console.error(err)

  if (err?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ message: 'Este CPF já está cadastrado no sistema.' })
  }

  res.status(500).json({ message: 'Erro interno do servidor' })
}

module.exports = errorHandler
