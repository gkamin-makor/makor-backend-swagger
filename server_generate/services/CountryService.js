/* eslint-disable no-unused-vars */
const model = require('../models/Country')
const Service = require('./Service')

/*
* get countries data
*  get countries data
*
* returns List
*/
const getCountriesData = (payload) =>
  new Promise((resolve) => {
    model.getCountriesData(payload, ({ data, status }) => {
      resolve(Service.successResponse(data, status || 500))
    })
  })

module.exports = {
  getCountriesData,
}
