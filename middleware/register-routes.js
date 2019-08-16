const healthCheck = require('./health-check')
const attack = require('./attack')
const attackTable = require('./attack-table')
const validateSlackToken = require('./validate-slack-token')

function registerRoutes (app) {
  app.get('/v1/health-check', healthCheck)
  app.post('/v1/attack', validateSlackToken, attack)
  // app.post('/v1/attack-table', validateSlackToken, attackTable)
  app.post('/v1/attack-table', attackTable)
}

module.exports = registerRoutes

