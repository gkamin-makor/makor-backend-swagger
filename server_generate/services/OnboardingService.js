/* eslint-disable no-unused-vars */
const model = require('../models/Onboarding')
const Service = require('./Service')

/*
* Create contact and onboarding
*
* onboardingCreate OnboardingCreate body structure
* no response value expected for this operation
*/
const createOnboarding = (payload) =>
  new Promise((resolve) => {
    model.createOnboarding(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get onboarding data
* get onboarding data
*
* id UUID id of the onboarding
* no response value expected for this operation
*/
const get_onboarding = (payload) =>
  new Promise((resolve) => {
    model.get_onboarding(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* update onboarding by id
*  update onboarding by id
*
* id UUID id of the onboarding
* onboardingUpdate OnboardingUpdate any of the following could be sended.
* no response value expected for this operation
*/
const updateOnboardingById = (payload) =>
  new Promise((resolve) => {
    model.updateOnboardingById(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })

module.exports = {
  createOnboarding,
  get_onboarding,
  updateOnboardingById,
}
