const {
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('../../application/RegisterCitizen')

function errorHandler(err, _req, res, _next) {
  if (err instanceof DuplicateCpfError) {
    return res.status(409).json({ message: err.message })
  }

  if (err instanceof InvalidCpfError || err instanceof InvalidNameError) {
    return res.status(400).json({ message: err.message })
  }

  console.error(err)
  res.status(500).json({ message: 'Erro interno do servidor' })
}

module.exports = errorHandler
