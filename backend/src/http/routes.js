const express = require('express')
const { createCitizenController } = require('./citizenController')

function createRoutes(repository) {
  const router = express.Router()
  const controller = createCitizenController(repository)

  router.post('/citizens', (req, res, next) => controller.create(req, res, next))
  router.get('/citizens', (req, res, next) => controller.list(req, res, next))

  return router
}

module.exports = createRoutes
