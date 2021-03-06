// const { Middleware } = require('swagger-express-middleware');
const http = require('http')
const fs = require('fs')
const path = require('path')
const swaggerUI = require('swagger-ui-express')
const jsYaml = require('js-yaml')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { OpenApiValidator } = require('express-openapi-validator')
const logger = require('./logger')
const config = require('./config')
const AuthenticateJWT = require('./utils/Authenticate')
const Authorization = require('./utils/Authorization')

const options = {
  swaggerOptions: {
    deepLinking: true,
    filter: true,
    displayRequestDuration: true,
    syntaxHighlight: {
      activate: true,
      // theme: 'nord',
    },
  },
}

class ExpressServer {
  constructor(port, openApiYaml) {
    this.port = port
    this.app = express()
    this.openApiPath = openApiYaml
    try {
      this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml))
    } catch (e) {
      logger.error('failed to start Express Server', e.message)
    }
    this.setupMiddleware()
  }

  setupMiddleware() {
    // this.setupAllowedMedia();
    this.app.use(cors())
    this.app.use(bodyParser.json({ limit: '14MB' }))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cookieParser())
    //Simple test to see that the server is up and responding
    this.app.get('/hello', (req, res) => res.send(`Hello World. path: ${this.openApiPath}`))
    //Send the openapi document *AS GENERATED BY THE GENERATOR*
    this.app.get('/openapi', (req, res) => res.sendFile(path.join(__dirname, 'api', 'openapi.yaml')))
    //View the openapi document in a visual interface. Should be able to test from this page
    if (process.env.API_DOCS_FLAG && JSON.parse(process.env.API_DOCS_FLAG)) {
      this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema, options))
    }
    this.app.get('/login-redirect', (req, res) => {
      res.status(200)
      res.json(req.query)
    })
    this.app.get('/oauth2-redirect.html', (req, res) => {
      res.status(200)
      res.json(req.query)
    })
  }

  launch() {
    new OpenApiValidator({
      apiSpec: this.openApiPath,
      operationHandlers: path.join(__dirname),
      fileUploader: { dest: config.FILE_UPLOAD_PATH },
      validateRequests: false, //true by default
      validateResponses: false, // false by default
      validateSecurity: {
        handlers: {
          bearerAuth: async (req, scopes, schema) => {
            const authenticate = await AuthenticateJWT.checkJWT(req)
            if (authenticate !== 'ok') {
              throw { status: 401, message: authenticate }
            }
            const authorization = await Authorization.checkAuthorization(req)
            if (authorization === 'ok') return true
            throw { status: 403, message: authorization }
          },
        },
      },
    })
      .install(this.app)
      .catch((e) => console.log(e))
      .then(() => {
        // eslint-disable-next-line no-unused-vars
        this.app.use((err, req, res, next) => {
          // format errors
          res.status(err.status || 500).json({
            message: err.errors[0].message.message || err.errors[0].message,
            // code: err.errors[0].message.code || '7.0',
            // status: err.status,
          })
        })

        http.createServer(this.app).listen(this.port)
        console.log(`Listening on port ${this.port}`)
      })
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close()
      console.log(`Server on port ${this.port} shut down`)
    }
  }
}

module.exports = ExpressServer
