const axios = require("axios");
const dbHelper = require('./db/db_helper')
const utilQueries = require('./sql/queries/util.queries')
const onboardingQueries = require('./sql/queries/onboarding.queries')



async function createMondayOnBoarding(name,email,phone,legalName,companyId,position_name,fieldsCount) {
  try {




    var [company] = await dbHelper.get(utilQueries.get_company_by_id(companyId))



    company = company.name



    const headers = {
      "Content-Type": "application/json",
      Authorization: process.env.TOKEN,
    };

    const body = {
      query: `
          mutation ($boardId: Int!, $itemName: String!, $columnValues: JSON!) {
            create_item (
              board_id: $boardId,
              item_name: $itemName,
              column_values: $columnValues
            ) {
              id
            }
          }
          `,
      variables: {
        boardId: +process.env.BOARD_ID,
        itemName: `On boarding`,
        columnValues: JSON.stringify({status:`${fieldsCount}/5`,text83:position_name,text_12:legalName,text1:name,text5:`${JSON.parse(email)}`,text11:`${JSON.parse(phone)}`,text:company})
      },
    };

    const res = await axios.post("https://api.monday.com/v2", body, {
      headers,
    });

    const itemId = res.data.data.create_item.id;

    return itemId;
  } catch (err) {
    throw err;
  }
}

async function updateMondayOnBoarding(uuid, data) {
  try {

    

    var fieldToUpdate = Object.entries(data)[0]

    var [field,updatedValue] = fieldToUpdate




    const fieldsMap = {
      company_id: "text",
      legal_entity_name: "text_12",
      legal_entity_identifier: "text_2",
      registration_gapi_location: "text_3",
      country_id: "text_4",
      us_state_id: "text_5",
      regulator_id: "text_6",
      regulation_number: "text_7",
      activity_description: "text_8",
      contact_position_id: "text83",
      name: "text1",
      email: "text5",
      phone: "text11",
      progress: "status",
      onboarding_has_company_asset: "text_9",
      agreed_at: "status0",
      company_asset_id:"text_9"
    };


    // return

    //!handle company asset 

    if (field === "company_asset_id") {

      var [onboarding_id] = await dbHelper.get(onboardingQueries.get_id_by_uuid(uuid))
      onboarding_id = onboarding_id.id

      var assets_ids = await dbHelper.get(utilQueries.get_checked_assets_ids(onboarding_id))
      assets_ids = assets_ids.map(asset => asset.asset_id)

      var assets_names = assets_ids.length? await dbHelper.get(utilQueries.get_assets_names(assets_ids)) : []
      assets_names = assets_names.map(asset => asset.name)   
      
      updatedValue = assets_names


      //!handle agreed
    } else if(field === "agreed_at"){
      updatedValue = updatedValue? "✔" : "✖"

      //!handle dealing with id
    } else if(field === "company_id" || field === "regulator_id" || field === "country_id" || field === "us_state_id" ||field === "contact_position_id"){
      //getting the id out of the table name
      var table_name = field.split('_')
      table_name.length = table_name.length - 1
      table_name = table_name.join('_')

      var [name] = await dbHelper.get(utilQueries.get_table_name(table_name,updatedValue))
      name = name.name

      updatedValue = name


    }else if (field === "progress"){
      updatedValue = `${updatedValue}/5`
    }

    //! handle diffrent jsons

    switch (field) {

      case "registration_gapi_location":
        //later on
        break;

      case "email":
        updatedValue= `${JSON.parse(updatedValue)}`;
        break;

      case "phone":
        updatedValue = `${JSON.parse(updatedValue)}`
        break;

      case "company_asset_id":
        updatedValue = `${updatedValue}`
        break;
    }


    //!handle diffrent types

    //string
    if (typeof updatedValue === "string")
      updatedValue = updatedValue
    //object
    else if (typeof updatedValue === "object")
      updatedValue = JSON.stringify(updatedValue);
    //int
    else updatedValue = `${updatedValue}`;




    var [itemId] = await dbHelper.get(utilQueries.get_monday_id(uuid))
    itemId = itemId.monday_id

        
    const headers = {
      "Content-Type": "application/json",
      Authorization: process.env.TOKEN,
    };

    const body = {
      query: `
          mutation ($boardId: Int!, $itemId: Int!, $columnId:String! $columnValue: String!) {
            change_simple_column_value (
              board_id: $boardId,
              item_id: $itemId,
              column_id: $columnId,
              value: $columnValue
            ) {
              id
            }
          }
          `,
      variables: {
        boardId: +process.env.BOARD_ID,
        itemId: +itemId,
        columnId: fieldsMap[field],
        columnValue: updatedValue === 'null'? '' : updatedValue,
      },
    };

    await axios.post("https://api.monday.com/v2", body, { headers })

  } catch (err) {
    throw err;
  }
}


module.exports = {
  updateMondayOnBoarding,
  createMondayOnBoarding
};
