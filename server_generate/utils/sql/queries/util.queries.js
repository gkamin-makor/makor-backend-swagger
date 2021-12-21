const get_country = () => {
    return `SELECT * FROM country;`
}

const get_table_names = (table,id) => {
    return `SELECT name FROM ${table} where id=${id};`
}

const get_company_by_id = (id) => {
    return `SELECT name FROM company where id=${id};`
}

const get_company_id = (uuid) => {
    return `SELECT id FROM company where uuid='${uuid}';`
}

const get_country_id = (code) => {
    return `SELECT id FROM country WHERE  iso_code_2='${code}';`
}

const get_state_id = (abbreviation) => {
    return `SELECT id FROM us_state WHERE abbreviation='${abbreviation}';`
}

const get_asset_id = (uuid) => {
    return `SELECT asset_id FROM company_asset WHERE uuid='${uuid}';`
}

const get_assets_names = (ids) => {
    return `select name from asset where id in (${ids})`
}

const get_position_id = (uuid) => {
    return `SELECT id FROM contact_position WHERE uuid='${uuid}';`
}

const insert_has_company_entity_asset = (onboardingId,assetId) => {
    return `
    INSERT INTO onboarding_has_company_asset(onboarding_id,company_entity_asset_id) VALUES(${onboardingId},${assetId});`
}

const remove_has_company_entity_asset = (onboardingId,assetId) => {
    return `
    DELETE FROM onboarding_has_company_asset WHERE onboarding_id = ${onboardingId} and company_entity_asset_id = ${assetId};`
}

const get_contact_position_name = (id) => {
    return `SELECT name FROM contact_position WHERE id=${id}`
}

const get_regulator_id = (uuid) => {
    return `SELECT id FROM regulator WHERE uuid='${uuid}'`
}

const get_monday_id = (uuid) => {
    return `SELECT monday_id FROM onboarding WHERE uuid='${uuid}'`
}

const get_checked_assets_ids = (id) => {
    return `select distinct company_asset.asset_id
    from company_asset join onboarding_has_company_asset
    on company_asset.id = onboarding_has_company_asset.company_asset_id
    where onboarding_has_company_asset.onboarding_id = ${id}`
}

const get_table_name = (table,id) => {
    return `SELECT name FROM ${table} where id=${id};`
}

const get_checked_assets = (id) => {
    return `
    SELECT company_asset_id FROM onboarding_has_company_asset WHERE onboarding_id = ${id};
    `
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
    get_contact_position_name,
    get_regulator_id,
    get_monday_id,
    get_checked_assets_ids,
    get_assets_names,
    get_table_name,
    get_checked_assets
}
