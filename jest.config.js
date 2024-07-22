/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults } = require('jest-config');

module.exports = {
  // preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transformIgnorePatterns: [
    './node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/testHelper/browser.ts'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
};
