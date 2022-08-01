import '@testing-library/jest-dom/extend-expect';

process.env.QA_DOMAIN =
  'https://qa-libraryregistry.librarysimplified.org/admin';
process.env.QA_LOGIN = `${process.env.QA_DOMAIN}/log_in/jwt`;
process.env.QA_REFRESH = `${process.env.QA_DOMAIN}/refresh_token`;

jest.setTimeout(30000);
