const dbHelper = require('../utils/db/db_helper')
const queries = require('../utils/sql/queries/util.queries')

const getCountriesData = async (payload,result) => {

try{

    const res = await dbHelper.get(queries.get_country())

    return result({status:200,data: res})


}catch(err){

    return result({status:500})
}
}



module.exports = {
    getCountriesData
}

