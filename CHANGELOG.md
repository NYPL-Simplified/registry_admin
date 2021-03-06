## Changelog

### v1.4.11
#### Added
- Added a Monthly Data tab to display a list of the libraries validated during any given month.

### v1.4.10
#### Updated
- Modified the date display features to use the date when the library's contact email address was validated, rather than the timestamp property (which is the date when the library was last modified).

### v1.4.9
#### Added
- Added display for and ability to validate the help email and copyright email, along with the contact email.

### v1.4.8
#### Added
- Updated the `opds-web-client` package to 0.3.4.

### v1.4.7
#### Added
- Added an option for displaying the month each library was added, in the Yearly Data tab.

### v1.4.6
#### Updated
- Refactored and added additional features to the Yearly Data tab.

### v1.4.5
#### Updated
- Displayed the total number of Adobe IDs in the Adobe Data tab.

### v1.4.4
#### Added
- Added a Yearly Data tab to the Stats panel, displaying a list of the libraries sorted by what year they were added.

### v1.4.3
#### Updated
- Updated the `opds-web-client` to version 0.3.2 and removing LibrariesListContainer.

### v1.4.2
#### Updated
- Enabled the Aggregate Data panel to pull geographical information from PLS IDs when necessary.

### v1.4.1
#### Added
- Implemented option for displaying geographical information alongside each library's name in the List tab of the Aggregate Data panel.

### v1.4.0
#### Updated
- Updated the `opds-web-client` to version 0.3.0, Typescript to version 3.7.2, and other related packages to their latest version. Fixed minor code issues based on update.
- Updated Travis to use Node 10 when building and running tests.

### v1.3.13
#### Fixed
- Fixed accessibility issues found by `react-axe`.

### v1.3.12
#### Fixed
- Grouped cancelled libraries with testing libraries, rather than displaying them in the production list.

### v1.3.11
#### Fixed
- Made it possible to change the UUID attribute within the modifyLibrary function.

### v1.3.10
#### Added
- Added `react-axe` to test for accessibility.
- Updated the `opds-web-client` package to version 0.2.10.

### v1.3.9
#### Updated
- Upgraded to v1.3.17 of library-simplified-reusable-components.

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
