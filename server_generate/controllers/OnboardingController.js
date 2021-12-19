/**
 * The OnboardingController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller')
const service = require('../services/OnboardingService')
const createOnboarding = async (request, response) => {
  await Controller.handleRequest(request, response, service.createOnboarding)
}

const getOnboardingDataById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getOnboardingDataById)
}

const updateOnboardingById = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateOnboardingById)
}

module.exports = {
  createOnboarding,
  getOnboardingDataById,
  updateOnboardingById,
}
