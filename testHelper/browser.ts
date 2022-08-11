import '@testing-library/jest-dom/extend-expect';

process.env.REGISTRY_API_DOMAIN =
  'https://qa-libraryregistry.librarysimplified.org/admin';
process.env.LOGIN = `${process.env.REGISTRY_API_DOMAIN}/log_in/jwt`;
process.env.REFRESH = `${process.env.REGISTRY_API_DOMAIN}/refresh_token`;
process.env.FETCH_LIBRARIES = `${process.env.REGISTRY_API_DOMAIN}/libraries`;
jest.setTimeout(30000);
