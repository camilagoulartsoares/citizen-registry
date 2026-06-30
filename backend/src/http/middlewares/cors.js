const cors = require('cors')

function corsMiddleware() {
  return cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
}

module.exports = corsMiddleware
