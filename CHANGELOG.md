## Changelog

### v1.3.9
#### Added
- Added `react-axe` to test for accessibility.

### v1.3.8
#### Added
- Added a third tab to the Aggregate Data panel and a new item to the library detail component, displaying information about how many Adobe Account IDs are associated with each production library.

### v1.3.7
#### Added
- Created an Aggregate Data panel to display how many libraries are in production, testing, and cancelled.

### v1.3.6
#### Updated
- Imported the reusable Input component and updated the SearchForm, LogInForm, and PlsIDForm components to comply with accessibility standards.

### v1.3.5
#### Added
- Imported the reusable Tabs component, and passed it a uniqueId prop to comply with accessibility standards.

### v1.3.4
#### Added
- Typedoc for generating code documentation.
#### Updated
- Updated the Panel components to take in new props and used the Header from Reusable Components.
- Updated the PlsIDForm to use the `uuid` prop as an ID to its `Input` component for accessibility purposes.

### v1.3.3
#### Added
- Rendered a loading indicator component while the list of libraries is being loaded.

### v1.3.2
#### Updated
- Changed the label on the search form to reflect new functionality.

### v1.3.1
#### Added
- Enabled filtering the list of libraries by attribute.

### v1.3.0
#### Updated
- Updated the version of react-router to v5. Updated the header to render all the time and how the main app is rendered with the router.

### v1.2.7
#### Added
- Enabled admins to add, edit, and view each library's PLS ID.
- `tslint-react-a11y` linter extension to review accessibility in React components.

### v1.2.6
#### Updated
- Updated the version of the opds-web-client, Redux, and Typescript.

### v1.2.5
#### Updated
- Updated the minifier configuration options.

### v.1.2.4
#### Updated
- Updated to v1.3.9 of library-simplified-reusable-components.

### v1.2.3
#### Updated
- Continuing to update the uglification plugin.

### v1.2.2
#### Fixed
- Configuring the uglification plugin.

### v1.2.1
#### Updated
- Integrated the Form component from the [https://github.com/NYPL-Simplified/reusable-components](library-simplified-reusable-components) package.

### v1.2.0
#### Updated
- Updating to React 16 and Enzyme 3.9 with updates to unit tests.

### v1.1.6
#### Added
- Created a new tab to display information about each library's focus area and service area.

### v1.1.5
#### Added
- Implemented a toggle for switching between production mode and QA mode.

### v1.1.4
#### Updated
- Utilized new built-in styling options for the Button component.

### v1.1.3
#### Updated
- Updating the reusable-components package version which now uses React 16.

### v1.1.2
#### Updated
- Updating to Webpack 4.

### v1.1.1
#### Added
- Implemented a search feature for the list of libraries

### v1.1.0
#### Updated
- Updated `typings` to `@types`, updated Typescript, and updated unit tests with fetch-mock. These updates are needed to import the updated `opds-web-client` v0.2.0 package.

### v1.0.5
#### Updated
- Integrated the Button component from the [https://github.com/NYPL-Simplified/reusable-components](library-simplified-reusable-components) package
- Updating the `reusable-components` npm package version to 1.3.1.

### v1.0.4
#### Updated
- Integrated the Panel component from the [https://github.com/NYPL-Simplified/reusable-components](library-simplified-reusable-components) package

### v1.0.3
#### Updated
- Made the validation timestamp automatically update as soon as a user validates an email address

### v1.0.2
#### Updated
- Implemented functionality for manually validating an email address

### v1.0.1
#### Added
- Implemented form for re-sending validation emails

### v1.0.0
#### Added
- Log in functionality

### v0.0.2
#### Added
- Rendered list of libraries
- Rendered details about each library
- Implemented functionality for editing library stage and registry stage
- Made library details more readable by implementing an accessible Tabs component

### v0.0.1
#### Added
- Set up the interface
