import '@testing-library/jest-dom/extend-expect';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

process.env.REGISTRY_API_DOMAIN =
  'https://qa-libraryregistry.librarysimplified.org/admin';
process.env.LOGIN = `${process.env.REGISTRY_API_DOMAIN}/log_in/jwt`;
process.env.REFRESH = `${process.env.REGISTRY_API_DOMAIN}/refresh_token`;
process.env.FETCH_LIBRARIES = `${process.env.REGISTRY_API_DOMAIN}/libraries/qa`;
process.env.UPDATE_LIBRARY_STAGE = `${process.env.REGISTRY_API_DOMAIN}/libraries/registration`;

jest.setTimeout(30000);
