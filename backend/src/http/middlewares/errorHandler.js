const {
  DuplicateCpfError,
  InvalidCpfError,
  InvalidNameError,
} = require('../../application/RegisterCitizen')
const { CitizenNotFoundError } = require('../../application/GetCitizen')
const { PaymentAlreadyConfirmedError } = require('../../application/ConfirmPayment')

function errorHandler(err, _req, res, _next) {
  if (err instanceof DuplicateCpfError) {
    return res.status(409).json({ message: err.message })
  }

  if (err instanceof PaymentAlreadyConfirmedError) {
    return res.status(409).json({ message: err.message })
  }

  if (err instanceof CitizenNotFoundError) {
    return res.status(404).json({ message: err.message })
  }

  if (err instanceof InvalidCpfError || err instanceof InvalidNameError) {
    return res.status(400).json({ message: err.message })
  }

  console.error(err)
  res.status(500).json({ message: 'Erro interno do servidor' })
}

module.exports = errorHandler
