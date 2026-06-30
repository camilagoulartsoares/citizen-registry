const cors = require('cors')

function corsMiddleware() {
  return cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
}

module.exports = corsMiddleware
