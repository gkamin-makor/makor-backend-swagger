const dbHelper = require("../utils/db/db_helper");
const queries = require("../utils/sql/queries/onboarding.queries");
const utilQueries = require("../utils/sql/queries/util.queries");
const mondayUtils = require('../utils/monday-utils')

//! route fucn!

const createOnboarding = async (payload, result) => {



    const unprocessed_data = payload.onboardingCreate


    const {name,email,phone,legal_entity_name} = await process_payload(unprocessed_data,result)


    
    //!create onboarding

    const company_entity_id = 1 // only for now

    const onboardingData = {
      legal_entity_name,
      company_entity_id
  }


    const onboarding_id = await createOnboardingFunc(onboardingData)


   //! create onboarding contact



  const contact_position_id = 6 //only for now

  var [position_name] = await dbHelper.get(utilQueries.get_contact_position_name(6))
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


    const mondayItemId = await mondayUtils.createMondayOnBoarding(name,email,phone,legal_entity_name,company_entity_id,position_name)

    //!update the returned monday id on the onboarding

    const fieldToUpdate = {
      monday_id: mondayItemId
    }

    await updateOnboardingFunc(onboarding_id,fieldToUpdate)


    result({status:200})

                                          
};

const createOnboardingFunc = async (onboardingData) => {

 
  const {insertId} = await  dbHelper.update(queries.insert_onboarding(onboardingData),onboardingData)


  return insertId

}

const updateOnboardingFunc = async (id,fieldToUpdate) => {

    await dbHelper.update(queries.update_onboarding(id,fieldToUpdate),fieldToUpdate)

}



const createOnboardingContact = async (contactData) => {

  console.log(contactData);

   await dbHelper.update(queries.insert_onboarding_contact(contactData),contactData)

}

//!route func

const updateOnboardingById = async (payload, result) => {

  const {id,onboardingUpdate} = payload


  //if more than 1 entry stop

  if (Object.entries(onboardingUpdate).length > 1) return result({status:400})

  const processed_data = await process_payload(onboardingUpdate,result,id)

  


return result({status:200})
  
}


module.exports = {
  createOnboarding,
  updateOnboardingById
};

const process_payload = async (data,result,uuid = null) => {


  const processed_data = {};

  for ([key, val] of Object.entries(data)) {


    switch (key) {


      case "company":
        processed_data['legal_entity_name'] = val
        break;

      case "company_entity":

        var [id] = await dbHelper.get(utilQueries.get_company_id(val))

        val = id.id

        processed_data['company_entity_id'] = val


        break;

      case "legal_entity_identifier":
        processed_data[key] = val
        break

      case "registration_gapi_location": 
        processed_data[key] = val // only for now!
        break

      case "country":

        var [id] = await dbHelper.get(utilQueries.get_country_id(val))

        val = id.id

        processed_data['country_id'] = val

        break

      case "us_state":

        var [id] = await dbHelper.get(utilQueries.get_state_id(val))

        val = id.id
0
        processed_data['us_state_id'] = val

        break

      case "regulator":
        processed_data[key] = val
        break

      case "regulation_number":
        processed_data[key] = val
        break

      case "activity_description":
        processed_data[key] = val
        break

      case "company_asset":
        const {asset,is_add} = val
        //get onboarding id
        var [onboarding_id] = await dbHelper.get(queries.get_id_by_uuid(uuid))
        onboarding_id = onboarding_id.id
        //get asset id
        var [asset_id] = await dbHelper.get(utilQueries.get_asset_id(asset))
        asset_id = asset_id.id

        processed_data["onboarding_id"] = onboarding_id
        processed_data["company_entity_asset_id"] = asset_id

        break

      case "contact_position":
        var [position_id] = await dbHelper.get(utilQueries.get_position_id(val))
        position_id = position_id.id

        processed_data["contact_position_id"] = position_id

        break

      case "contact_name":
        processed_data["name"] = val
        break

      case "contact_email":
        processed_data["email"] = JSON.stringify(val)
        break

      case "contact_phone":
        processed_data["phone"] = JSON.stringify(val)
        break

      
      default:

        return result({ status: 500 });

    }
  }

  return processed_data;

};


