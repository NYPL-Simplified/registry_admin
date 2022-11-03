export const LOGIN = `${process.env.REGISTRY_API_DOMAIN}/log_in/jwt`;
export const REFRESH = `${process.env.REGISTRY_API_DOMAIN}/refresh_token`;
export const FETCH_LIBRARIES = process.env.REGISTRY_API_DOMAIN?.includes('qa')
  ? `${process.env.REGISTRY_API_DOMAIN}/libraries/qa`
  : `${process.env.REGISTRY_API_DOMAIN}/libraries`;
export const UPDATE_LIBRARY_STAGE = `${process.env.REGISTRY_API_DOMAIN}/libraries/registration`;
