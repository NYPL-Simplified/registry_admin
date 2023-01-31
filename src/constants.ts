export const LOGIN = `${process.env.REGISTRY_API_DOMAIN}/log_in/jwt`;
export const REFRESH = `${process.env.REGISTRY_API_DOMAIN}/refresh_token`;
// despite this endpoint including /qa, it is indeed supposed to be used in production :'(
export const FETCH_LIBRARIES = `${process.env.REGISTRY_API_DOMAIN}/libraries/qa`;
export const UPDATE_LIBRARY_STAGE = `${process.env.REGISTRY_API_DOMAIN}/libraries/registration`;
