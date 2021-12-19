const path = require('path')
require('dotenv').config()

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: process.env.APP_PORT,
  URL_PATH: process.env.APP_URL,
  BASE_VERSION: '',
  CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
  PROJECT_DIR: __dirname,
}
config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'api', 'openapi.yaml')
config.FULL_PATH = `${config.APP_URL}:${config.APP_PORT}/${config.BASE_VERSION}`
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, 'uploaded_files')

module.exports = config
