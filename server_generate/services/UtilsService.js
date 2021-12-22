/* eslint-disable no-unused-vars */
const model = require('../models/Utils')
const Service = require('./Service')

/*
* get company assets
* get company assets
*
* id UUID id of the onboarding
* returns List
*/
const get_assets = (payload) =>
  new Promise((resolve) => {
    model.get_assets(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get companies data
* get companies data
*
* returns List
*/
const get_companies = (payload) =>
  new Promise((resolve) => {
    model.get_companies(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get countries data
* get countries data
*
* returns List
*/
const get_countries = (payload) =>
  new Promise((resolve) => {
    model.get_countries(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get dials data
* get dials data
*
* returns List
*/
const get_dials = (payload) =>
  new Promise((resolve) => {
    model.get_dials(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get positions data
* get positions data
*
* returns List
*/
const get_positions = (payload) =>
  new Promise((resolve) => {
    model.get_positions(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get regulators data
* get regulators data
*
* returns List
*/
const get_regulators = (payload) =>
  new Promise((resolve) => {
    model.get_regulators(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })
/*
* get states data
* get states data
*
* returns List
*/
const get_states = (payload) =>
  new Promise((resolve) => {
    model.get_states(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })

module.exports = {
  get_assets,
  get_companies,
  get_countries,
  get_dials,
  get_positions,
  get_regulators,
  get_states,
}
