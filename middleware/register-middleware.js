const bodyParser = require('body-parser')

function registerMiddleware(app) {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
}

module.exports = registerMiddleware;
