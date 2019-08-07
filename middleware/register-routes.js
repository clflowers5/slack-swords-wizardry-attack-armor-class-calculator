const healthCheck = require('./health-check');
const attack = require('./attack');
const validateSlackToken = require('./validate-slack-token');

function registerRoutes(app) {
  app.get('/v1/health-check', healthCheck);
  app.post('/v1/attack', validateSlackToken, attack);
}

module.exports = registerRoutes;

