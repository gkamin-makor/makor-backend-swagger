const dbHelper = require("../utils/db/db_helper");
const queries = require("../utils/sql/queries/util.queries");

const get_countries = async (payload,result) => {

    const data = await dbHelper.get(queries.get_countries())


    return result({status:200,data})

}

const get_positions = async (payload,result) => {
    
    const data = await dbHelper.get(queries.get_positions())

    return result({status:200,data})

    
}

const get_states = async (payload,result) => {

    const data = await dbHelper.get(queries.get_states())

    return result({status:200,data})

}

const get_regulators = async (payload,result) => {

    const data = await dbHelper.get(queries.get_regulators())

    return result({status:200,data})

}

const get_companies = async (payload,result) => {

    const data = await dbHelper.get(queries.get_companies())

    return result({status:200,data})

}

const get_dials = async (payload,result) => {

    const data = await dbHelper.get(queries.get_dials())

    return result({status:200,data})

}

const get_assets = async (payload,result) => {

    const {id} = payload



    var [company_id] = await dbHelper.get(queries.get_company_id(id))
    company_id = company_id.id

    const data = await dbHelper.get(queries.get_assets_by_company_id(company_id))


    return result({status:200,data})



}

module.exports = {
    get_countries,
    get_positions,
    get_states,
    get_regulators,
    get_companies,
    get_dials,
    get_assets
}