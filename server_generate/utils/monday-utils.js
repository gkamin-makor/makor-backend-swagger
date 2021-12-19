const axios = require("axios");
const dbHelper = require('./db/db_helper')
const utilQueries = require('./sql/queries/util.queries')

// async function updateMondayOnBoarding(uuid, fieldToUpdate) {
//   try {

    
//     var updatedValue;

//     const fieldsMap = {
//       company_entity_id: "text",
//       legal_entity_name: "text_12",
//       legal_entity_identifier: "text_2",
//       registration_gapi_location: "text_3",
//       country_id: "text_4",
//       us_state_id: "text_5",
//       regulator: "text_6",
//       regulation_number: "text_7",
//       activity_description: "text_8",
//       contact_position_id: "text83",
//       name: "text1",
//       email: "text5",
//       phone: "text11",
//       progress: "status",
//       company_entity_asset: "text_9",
//     };

//     //getting the relevant data in case of dealing with id

//     //getting the table name without the _id and the relevant data
//     if (
//       fieldToUpdate.field === "company_entity_id" ||
//       fieldToUpdate.field === "country_id" ||
//       fieldToUpdate.field === "us_state_id" ||
//       fieldToUpdate.field === "contact_position_id"
//     ) {
//       var table = fieldToUpdate.field.split("_");
//       table = table.slice(0, table.length - 1).join("_");

//      const data = await dbUtils.getTableNames(table,fieldToUpdate.value)
     

//       fieldToUpdate.value = data.name;
//     }

//     //handle company asset

//     if (fieldToUpdate.field === "company_entity_asset") {
//       const [onboardingId] = await dbService.runSQL(
//         queries.get_id_by_uuid(uuid)
//       );

//       const data = await dbService.runSQL(
//         queries.get_company_assets(onboardingId.id)
//       );

//       const assetsIds = data.map((asset) => asset.company_entity_asset_id);

//       const assetsNames = await dbService.runSQL(
//         queries.get_assets_names(`${assetsIds}`)
//       );

//       fieldToUpdate.value = `${assetsNames.map((asset) => asset.name)}`;
//     }

//     //handle diffrent jsons

//     switch (fieldToUpdate.field) {
//       case "registration_gapi_location":
//         //later on
//         break;

//       case "email":
//         fieldToUpdate.value = `${fieldToUpdate.value}`;
//         break;

//       case "phone":
//         fieldToUpdate.value = fieldToUpdate.value
//           .map((phone) => "+" + phone.dialing_code + phone.number)
//           .join(",");
//         break;
//     }

//     //string
//     if (typeof fieldToUpdate.value === "string")
//       updatedValue = fieldToUpdate.value;
//     //object
//     else if (typeof fieldToUpdate.value === "object")
//       updatedValue = JSON.stringify(fieldToUpdate.value);
//     //int
//     else updatedValue = `${fieldToUpdate.value}`;

//     const [itemId] = await dbService.runSQL(queries.get_monday_id(uuid));

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: process.env.TOKEN,
//     };

//     const body = {
//       query: `
//           mutation ($boardId: Int!, $itemId: Int!, $columnId:String! $columnValue: String!) {
//             change_simple_column_value (
//               board_id: $boardId,
//               item_id: $itemId,
//               column_id: $columnId,
//               value: $columnValue
//             ) {
//               id
//             }
//           }
//           `,
//       variables: {
//         boardId: +process.env.BOARD_ID,
//         itemId: +itemId.monday_id,
//         columnId: fieldsMap[fieldToUpdate.field],
//         columnValue: updatedValue,
//       },
//     };

//     await axios.post("https://api.monday.com/v2", body, { headers });
//   } catch (err) {
//     throw err;
//   }
// }

async function createMondayOnBoarding(name,email,phone,legalName,companyId,position_name) {
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
        columnValues: JSON.stringify({text83:position_name,text_12:legalName,text1:name,text5:`${JSON.parse(email)}`,text11:`${JSON.parse(phone)}`,text:company})
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







module.exports = {
  // updateMondayOnBoarding,
  createMondayOnBoarding,
};
