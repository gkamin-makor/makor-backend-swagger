/**
 * The UtilsController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller')
const service = require('../services/UtilsService')
const get_assets = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_assets)
}

const get_companies = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_companies)
}

const get_countries = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_countries)
}

const get_dials = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_dials)
}

const get_positions = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_positions)
}

const get_regulators = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_regulators)
}

const get_states = async (request, response) => {
  await Controller.handleRequest(request, response, service.get_states)
}

module.exports = {
  get_assets,
  get_companies,
  get_countries,
  get_dials,
  get_positions,
  get_regulators,
  get_states,
}
