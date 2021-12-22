const dbHelper = require("../utils/db/db_helper");
const queries = require("../utils/sql/queries/onboarding.queries");
const utilQueries = require("../utils/sql/queries/util.queries");
const mondayUtils = require('../utils/monday-utils')
const emailUtils = require('../utils/email-utils')
const moment = require('moment')

const handleIp = (ip) => {


  let ip_to_save

  for(let i=0; i< ip.length; i++){

    let currentLetter = ip[i]

    if(!isNaN(+currentLetter)) {

      ip_to_save = ip.slice(i)

      break;

    }

  }

  return ip_to_save

}

//! route func

const get_onboarding = async (payload, result) => {

  const {id} = payload



  var [onboarding_id] = await dbHelper.get(queries.get_id_by_uuid(id))
  onboarding_id = onboarding_id.id


  const [onboarding_data] = await dbHelper.get(queries.get_onboarding_data_to_show(id))

  const [onboarding_contact_data] = await dbHelper.get(queries.get_onboarding_contact_data_to_show(onboarding_id))

  var checked_assets = await dbHelper.get(utilQueries.get_checked_assets_by_id(onboarding_id))

  checked_assets = checked_assets.map(asset => asset.uuid)

  var progress = await getProgress(onboarding_id)
  progress = progress / 5 * 100

  const data = {...onboarding_data,...onboarding_contact_data,checked_assets,progress}


  return result({data,status:200})

}

//! route fucn!

const createOnboarding = async (payload, result) => {


    const unprocessed_data = payload.onboardingCreate


    const {name,email,phone,legal_entity_name} = await process_payload(unprocessed_data,result)

    
    //!create onboarding

    const company_id = 1 // only for now

    const onboardingData = {
      legal_entity_name,
      company_id
  }


    const onboarding_id = await createOnboardingFunc(onboardingData)




   //! create onboarding contact



  const contact_position_id = 6 //only for now


  var [position_name] = await dbHelper.get(utilQueries.get_contact_position_name(contact_position_id))
  position_name = position_name.name



    const contactData = {

      onboarding_id,
      contact_position_id,
      name,
      email,
      phone

    }



    await createOnboardingContact(contactData)




    //! create monday onboarding

    const progress = await getProgress(onboarding_id)


    const mondayItemId = await mondayUtils.createMondayOnBoarding(name,email,phone,legal_entity_name,company_id,position_name,progress)

    //!update the returned monday id on the onboarding

    const fieldToUpdate = {
      monday_id: mondayItemId
    }


    await updateOnboardingFunc(onboarding_id,fieldToUpdate)

    //!send mail!

    var [onboarding_uuid] = await dbHelper.get(queries.get_uuid_by_id(onboarding_id))
    onboarding_uuid = onboarding_uuid.uuid


    const _email = JSON.parse(email)

    _email.forEach(async email => await emailUtils.sendEmail(email,onboarding_uuid))



    result({status:200})

                                          
}

const createOnboardingFunc = async (onboardingData) => {


 
  const {insertId} = await  dbHelper.update(queries.insert_onboarding(onboardingData),onboardingData)


  return insertId

}

const updateOnboardingFunc = async (id,fieldToUpdate) => {

    await dbHelper.update(queries.update_onboarding(id,fieldToUpdate),fieldToUpdate)

}



const createOnboardingContact = async (contactData) => {
  await dbHelper.update(queries.insert_onboarding_contact(contactData),contactData)

}

//!route func

const updateOnboardingById = async (payload, result) => {

  const {id,onboardingUpdate,user_ip} = payload



  //if more than 1 entry stop

  if (Object.entries(onboardingUpdate).length > 1) return result({status:400})

  var [onboarding_id] = await dbHelper.get(queries.get_id_by_uuid(id))
  onboarding_id = onboarding_id.id


  //!prepering the data!

  const processed_data = await process_payload(onboardingUpdate,result,id,user_ip)


  //!choosing between onboarding, onboardingcontact and onboarding asset and update the db!
  
  const key = Object.keys(processed_data)[0]
  const contact_fields = ["name","phone","email","contact_position_id"]

  //!handle update contact
  if (contact_fields.includes(key)){

    await update_contact(processed_data,onboarding_id)

    //!handle update asset
  }else if (key === "company_asset_id"){

    const is_add = onboardingUpdate.company_asset.is_add

    await update_asset(processed_data,onboarding_id,is_add)
    


    //!handle update onboarding
  } else {

    await update_onboarding(processed_data,onboarding_id)


  }

  //! update monday!

  await mondayUtils.updateMondayOnBoarding(id,processed_data)

  //!update monday progress and send the progress back!

  var progress = await getProgress(onboarding_id)
  await updateMondayProgress(id,onboarding_id,progress)

  progress = progress / 5 * 100
  
return result({status:200,data:{progress}})
  
}
 
const updateMondayProgress = async (uuid,id,progress) => {


  await mondayUtils.updateMondayOnBoarding(uuid,{progress})

}

const getProgress = async (id) => {

  const [requied_fields] = await dbHelper.get(queries.get_required_fields(id))

  var fields_count = Object.entries(requied_fields).reduce((acc,[key,value])=>{

    if (value) acc++

    return acc

  },0)

  const checked_assets = await dbHelper.get(utilQueries.get_checked_assets(id))

  fields_count = checked_assets.length? fields_count + 1 : fields_count

return fields_count


}

const update_contact  = async (data,id) => {


  await dbHelper.update(queries.update_onboarding_contact_by_id(id,data),data)

}

const update_asset = async ({company_asset_id,onboarding_id},id,is_add) => {


if (is_add) company_asset_id.forEach(async asset => await dbHelper.get(queries.insert_asset(onboarding_id,asset)))  

else company_asset_id.forEach(async asset => await dbHelper.get(queries.remove_asset(onboarding_id,asset))) 


}

const update_onboarding = async (data,id) => {


  await dbHelper.update(queries.update_onboarding(id,data),data)

  if (Object.keys(data)[0] === "company_id") dbHelper.get(utilQueries.clear_all_assets())


}


module.exports = {
  createOnboarding,
  updateOnboardingById,
  get_onboarding
};

const process_payload = async (data,result,uuid = null,ip) => {


  const processed_data = {};

  for ([key, val] of Object.entries(data)) {


    switch (key) {

      case "is_agreed":



      if (val){

        processed_data["agreed_at"] = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        processed_data["agreed_ip"] = ip

      }else{

        processed_data["agreed_at"] = null
        processed_data["agreed_ip"] = null

      }

        break

      case "company_id":


        var [id] = await dbHelper.get(utilQueries.get_company_id(val))

        val = id.id

        processed_data['company_id'] = val


        break;


      case "company_name":
        processed_data['legal_entity_name'] = val
        break;

     
      case "LEI":
        processed_data["legal_entity_identifier"] = val
        break

      case "address": 
        processed_data["registration_gapi_location"] = JSON.stringify(val) /// only for now
        break

      case "country_id":

        var [id] = await dbHelper.get(utilQueries.get_country_id(val))

        val = id.id

        processed_data[key] = val

        break

      case "us_state_id":

        var [id] = await dbHelper.get(utilQueries.get_state_id(val))

        val = id.id
0
        processed_data[key] = val

        break

      case "regulator_id":

        var [id] = await dbHelper.get(utilQueries.get_regulator_id(val))

        val = id.id
0
        processed_data[key] = val

        break

      case "regulation_number":
        processed_data[key] = val
        break

      case "comment":
        processed_data["activity_description"] = val
        break

      case "company_asset":
        var {asset_id} = val
        asset_id = asset_id.map(asset => `"${asset}"`)
        //get onboarding id
        var [onboarding_id] = await dbHelper.get(queries.get_id_by_uuid(uuid))
        onboarding_id = onboarding_id.id
        //get assets ids
        var assets_ids = await dbHelper.get(queries.get_assets_ids(asset_id)) 
        assets_ids = assets_ids.map(asset => asset.id)

        processed_data["company_asset_id"] = assets_ids
        processed_data["onboarding_id"] = onboarding_id

        break

      case "contact_position_id":
        var [position_id] = await dbHelper.get(utilQueries.get_position_id(val))
        position_id = position_id.id

        processed_data[key] = position_id

        break

      case "contact_name":
        processed_data["name"] = val
        break

      case "contact_email":
        processed_data["email"] = JSON.stringify(val)
        break

      case "contact_phone":
        const phone = val.map(phone => phone.dialing_code + '-' + phone.number + ',')
        processed_data["phone"] = JSON.stringify(phone)
        break

      
      default:

        return result({ status: 500 });

    }
  }

  return processed_data;

};


