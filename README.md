# Registry Admin

Web front-end for the Library Registry administrative interface.

<!-- [![npm version](https://badge.fury.io/js/simplified-circulation-web.svg)](https://badge.fury.io/js/simplified-circulation-web)

[![Build Status](https://travis-ci.org/NYPL-Simplified/circulation-web.svg?branch=master)](https://travis-ci.org/NYPL-Simplified/circulation-web) -->

## Library Simplified Documentation

To see screenshots, read in-depth documentation, and find out more about the project, check out the [Confluence](https://confluence.nypl.org/display/SIM/) site hosted by The New York Public Library.

## Setup

This package is meant to be used with the Library Simplified [Library Registry](https://github.com/NYPL-Simplified/library_registry). The Library Registry is the main server app that runs and exposes endpoints that the Circulation Manager will use and also runs this front-end admin interface application.

### Cloning this repository

As written in the Library Registry [README](https://github.com/NYPL-Simplified/library_registry), you **must** install both repos in the _same_ directory.

Let's say your working path is `~/projects/simplified/registry`, then change directory into the working path:

```sh
cd ~/projects/simplified/registry
```

and run:

```sh
git clone https://github.com/NYPL-Simplified/library_registry.git
git clone https://github.com/NYPL-Simplified/registry_admin.git
```

Having both repos in the same directory allows the Library Registry's Docker configuration to read this app for local development.

### Installation

One the repo is cloned, change directory to `registry_admin` and then install the dependencies.

```sh
cd registry_admin
npm install
```

### Use Local Development Version

If you're working on the administrative interface and want to test local changes, follow the [Library Registry's README](https://github.com/NYPL-Simplified/library_registry) to run the server through Docker. **You do not need to use `npm link` in this setup.** If both the Library Registry and the Registry Admin are in the same directory, when the server is started through the Docker cluster it'll pick up this repo automatically.

Visit `localhost/admin/` to see the front-end admin interface.

Now you can make front-end changes to this repo and the Docker cluster will pick up any changes that are made. The Docker cluster's local dev server will take care of compiling and updating any new changes made locally for development. Just refresh the page to see updates without having to restart either the `library_registry` or `registry_admin` servers.

## Publishing

This package is [published to npm](https://www.npmjs.com/package/simplified-circulation-web).

To publish a new version, you need to create an npm account and be a collaborator on the package. Then you can run `npm publish` at the root of this repository to release a new version. Speak to an engineering at NYPL to be added as a collaborator in the npm NYPL organization.

## Accessibility

In order to develop user interfaces that are accessible to everyone, there are tools added to the workflow. Besides the Typescript `tslint-react-a11y` plugin, `react-axe` is also installed for local development. Using that module while running the app uses a lot of resources so it should be only when specifically testing for accessibility and not while actively developing new features or fixing bugs.

In order to run the app with `react-axe`, run `npm run dev-test-axe`. This will add a local global variable `process.env.TEST_AXE` (through webpack) that will trigger `react-axe` in `/src/index.tsx`. The output will be seen in the _browser's_ console terminal.

## Tests

Like the codebase, all the unit tests are written in Typescript. Tests are written for all React components as well as redux and utility functions, and all can be found in their respective `__tests__` folders.

To run the tests, perform `npm test`.

We use Travis CI for continuous integration. Any pull requests submitted must have tests and those tests must pass on Travis CI.

Manual tests and expectations for the Registry Admin's functionality can be found [here](https://docs.google.com/spreadsheets/d/1q9joHeNZpkTsZU-u1NwPBRUFYcxvRo23eP2vw79xPG4/edit#gid=0).

## License

```
Copyright © 2015 The New York Public Library, Astor, Lenox, and Tilden Foundations

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
