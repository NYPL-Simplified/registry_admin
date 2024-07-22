# Registry Admin

Web front-end for the [Library Registry](https://github.com/NYPL-Simplified/library_registry).

## Library Simplified Documentation

To see screenshots, read in-depth documentation, and find out more about the project, check out the [Confluence](https://confluence.nypl.org/display/SIM/) site hosted by The New York Public Library.

## Local Development & Installation

This project is a React app bundled with [parcel](https://parceljs.org/).

One the repo is cloned, change directory to `registry_admin` and then install the dependencies.

```sh
cd registry_admin
npm install
```

## Tests

Like the codebase, all the unit tests are written in Typescript. Tests are written for all React components as well as redux and utility functions, and all can be found in their respective `__tests__` folders.

To run the tests, perform `npm test`.

We use Github Actions for continuous integration. Any pull requests submitted must have tests, whether new or updated, and those tests must pass on Github Actions.

Manual tests and expectations for the Registry Admin's functionality can be found [here](https://docs.google.com/spreadsheets/d/1q9joHeNZpkTsZU-u1NwPBRUFYcxvRo23eP2vw79xPG4/edit#gid=0).

## Docker

We build a docker image and push it to AWS for QA and production environments. Sometimes you'll need to build the image locally for testing or debugging.

To build the docker image locally, run

```
docker build -t registryadmin --build-arg REGISTRY_API_DOMAIN=https://qa-libraryregistry.librarysimplified.org/admin .
```

To run the docker image, run

```
docker run -p 1234:1234 registryadmin:latest
```

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
