const insert_onboarding = (data) => {
    return `
    INSERT INTO onboarding (${Object.keys(data)})
    VALUES (${Object.values(data).map((key) => '?')});
  `
}

const update_onboarding = (id, data) => {
  return `
      UPDATE onboarding SET ${Object.keys(data).map(key => `${key} = ?`)} WHERE id = ${id};
  `
}

const update_onboarding_by_uuid = (uuid, data) => {
  return `
      UPDATE onboarding SET ${Object.keys(data).map(key => `${key} = ?`)} WHERE uuid = '${uuid}';
  `
}

const update_onboarding_contact_by_id = (id, data) => {
  return `
      UPDATE onboarding_contact SET ${Object.keys(data).map(key => `${key} = ?`)} WHERE onboarding_id = ${id};
  `
}


const insert_onboarding_contact = (data) => {
  return `
  INSERT INTO onboarding_contact (${Object.keys(data)})
  VALUES (${Object.values(data).map((key) => '?')});
`
}

const getonboarding_by_uuid = (uuid) => {
  return `SELECT company_entity_id,legal_entity_name,legal_entity_identifier,registration_gapi_location,country,us_ FROM onboarding where uuid='${uuid}';`
}



const get_id_by_uuid = (uuid) => {
  return `SELECT id FROM onboarding WHERE uuid='${uuid}'`
}



module.exports = {
    insert_onboarding,
    update_onboarding,
    insert_onboarding_contact,
    getonboarding_by_uuid,
    get_id_by_uuid,
    update_onboarding_by_uuid,
    update_onboarding_contact_by_id
}


