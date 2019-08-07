const express = require('express')
const serverlessExpress = require('aws-serverless-express')

const validateEnvironment = require('./util/validate-environment')
const registerMiddleware = require('./middleware/register-middleware')
const registerRoutes = require('./middleware/register-routes')

function bootstrap () {
  const app = express()
  const port = process.env.port || DEFAULT_PORT

  registerMiddleware(app)
  registerRoutes(app)

  const server = serverlessExpress.createServer(app)
  exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)

  const isDev = process.env.NODE_ENV === 'dev'
  if (isDev) {
    app.listen(port, () => console.log(
      `App listening on port ${ port }!`
    ))
  }
}

const DEFAULT_PORT = 5000

validateEnvironment()
bootstrap()

