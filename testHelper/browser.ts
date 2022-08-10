import '@testing-library/jest-dom/extend-expect';

process.env.QA_DOMAIN =
  'https://qa-libraryregistry.librarysimplified.org/admin';
process.env.LOGIN = `${process.env.QA_DOMAIN}/log_in/jwt`;
process.env.REFRESH = `${process.env.QA_DOMAIN}/refresh_token`;
process.env.FETCH_LIBRARIES = `${process.env.QA_DOMAIN}/libraries`;
jest.setTimeout(30000);
