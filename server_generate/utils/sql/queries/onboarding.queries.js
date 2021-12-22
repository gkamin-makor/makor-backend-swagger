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


const get_uuid_by_id = (id) => {
  return `SELECT uuid FROM onboarding WHERE id=${id}`
}

const insert_asset = (onboardingId,assetId) => {
  return `
  INSERT INTO onboarding_has_company_asset(onboarding_id,company_asset_id) VALUES(${onboardingId},${assetId}) ON DUPLICATE KEY UPDATE onboarding_id=${onboardingId},company_asset_id=${assetId};`
}

const remove_asset = (onboarding_id,asset_id) => {
  return `delete from onboarding_has_company_asset where onboarding_id=${onboarding_id} and company_asset_id=${asset_id};`
}

const clear_all_assets = () => {
  return `DELETE FROM onboarding_has_company_asset;`
}

const get_assets_ids = (uuids) => {
  return `SELECT id from company_asset WHERE uuid in (${uuids})`
}

const get_required_fields = (id) => {
  return `
  select onboarding.country_id,onboarding.company_id,onboarding.legal_entity_name,onboarding_contact.email
from onboarding join onboarding_contact 
on onboarding.id = onboarding_contact.onboarding_id 
where onboarding.id = ${id}
  `
}

const get_onboarding_data_to_show = (uuid) => {
  return `SELECT onboarding.legal_entity_name as company_name,onboarding.legal_entity_identifier as LEI,onboarding.registration_gapi_location as address,onboarding.regulation_number as regulation_number,onboarding.activity_description as comment,regulator.uuid as regulator_id,us_state.abbreviation as state_id,country.iso_code_2 as country_id,company.uuid as company_id 
  FROM onboarding 
  left join regulator on onboarding.regulator_id = regulator.id
  left join us_state on onboarding.us_state_id = us_state.id
  left join country on onboarding.country_id = country.id 
  left join company on onboarding.company_id = company.id 
  where onboarding.uuid='${uuid}';`
}

const get_onboarding_contact_data_to_show = (id) => {
  return `SELECT onboarding_contact.name, onboarding_contact.email, onboarding_contact.phone,contact_position.uuid as position_id
  From onboarding_contact join contact_position
  ON onboarding_contact.contact_position_id = contact_position.id
  WHERE onboarding_contact.onboarding_id = ${id};`
}




module.exports = {
    insert_onboarding,
    update_onboarding,
    insert_onboarding_contact,
    getonboarding_by_uuid,
    get_id_by_uuid,
    update_onboarding_by_uuid,
    update_onboarding_contact_by_id,
    insert_asset,
    remove_asset,
    clear_all_assets,
    get_assets_ids,
    get_required_fields,
    get_onboarding_data_to_show,
    get_onboarding_contact_data_to_show,
    get_uuid_by_id
}


