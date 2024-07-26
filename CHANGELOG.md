# CHANGELOG

## UNRELEASED CHANGES

## 2.1.0

### Add

- Adds the following `npm` packages:
  `babel/preset-typescript`, `babel-jest`

### Update

- Upgrade to Node 20.
- Uses `ts-jest` over `esbuild-jest`.
- Updates the Reservoir DS to `3.1.7` and removes unnecessary stylesheet.
- Updates the following `npm` packages:
  `@nypl/design-system-react-components`, `@parcel/transformer-sass`, `@testing-library/jest-dom`, `@testing-library/react`, `@types/jest`, `@types/js-cookie`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/react-test-renderer`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `esbuild`, `eslint`, `eslint-config-prettier`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `husky`, `jest`, `jest-config`, `jest-environment-jsdom`, `js-cookie`, `lint-staged`, `os-browserify`, `parcel`, `path-browserify`, `process`, `react`, `react-dom`, `react-error-boundary`, `react-test-renderer`, `ts-jest`, `ts-node`

### Remove

- Removes the following `npm` packages:
  `esbuild-jest`

## 2.0.2

- Use /libraries/qa endpoint to fetch libraries on production

## 2.0.1

- Hotfix point QA library endpoint to production

## 2.0.0

- SIMPLY-4065: Convert application to a new parcel build
- SIMPLY-4066: Install Reservoir (NYPL Design System) and use components to build UI.
- SIMPLY-4126: Fix bug where "Registry Stage" dropdown was showing "testing" when it should have shown "canceled."
- SIMPLY-4125: Add patron counts to simple list view.
- SIMPLY-4172: Add library description to library details.
- SIMPLY-4069: Create functional login page.
- SIMPLY-4067: Fetch real library data.
- SIMPLY-4162: Make POST requests when a user changes a library's stage.
- SIMPLY-4184: Add QA testing checklist to README.
- SIMPLY-4068: Add error handling for fetch requests.
- SIMPLY-4166: Configure AWS deployments
- SIMPLY-4194: Add a top-level error boundary.

## 1.4.15

- Version 1 of the app, where it was deployed as an npm package and linked to the library_registry as static .js and .css files.
