const get_country = () => {
    return `SELECT * FROM country;`
}

const get_table_names = (table,id) => {
    return `SELECT name FROM ${table} where id=${id};`
}

const get_company_by_id = (id) => {
    return `SELECT name FROM company_entity where id=${id};`
}

const get_company_id = (name) => {
    return `SELECT id FROM company_entity where name='${name}';`
}

const get_country_id = (name) => {
    return `SELECT id FROM country WHERE name='${name}';`
}

const get_state_id = (name) => {
    return `SELECT id FROM us_state WHERE name='${name}';`
}

const get_asset_id = (name) => {
    return `SELECT id FROM asset WHERE name='${name}';`
}

const get_position_id = (name) => {
    return `SELECT id FROM contact_position WHERE name='${name}';`
}

const insert_has_company_entity_asset = (onboardingId,assetId) => {
    return `
    INSERT INTO onboarding_has_company_entity_asset(onboarding_id,company_entity_asset_id) VALUES(${onboardingId},${assetId});`
}

const remove_has_company_entity_asset = (onboardingId,assetId) => {
    return `
    DELETE FROM onboarding_has_company_entity_asset WHERE onboarding_id = ${onboardingId} and company_entity_asset_id = ${assetId};`
}

const get_contact_position_name = (id) => {
    return `SELECT name FROM contact_position WHERE id=${id}`
}




module.exports = {
    get_country,
    get_table_names,
    get_company_by_id,
    get_company_id,
    get_country_id,
    get_state_id,
    get_asset_id,
    get_position_id,
    insert_has_company_entity_asset,
    remove_has_company_entity_asset,
    get_contact_position_name
}
