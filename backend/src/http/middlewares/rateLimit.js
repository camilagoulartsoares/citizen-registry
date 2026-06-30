const rateLimit = require('express-rate-limit')

function rateLimitMiddleware() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    message: { message: 'Muitas requisições. Tente novamente em alguns minutos.' },
  })
}

module.exports = rateLimitMiddleware
