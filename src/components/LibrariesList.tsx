import * as React from "react";
import { Store } from "redux";
import { State } from "../reducers/index";
import { LibraryData } from "../interfaces";
import LibrariesListItem from "./LibrariesListItem";
import LoadingIndicator from "opds-web-client/lib/components/LoadingIndicator";

export interface LibrariesListOwnProps {
  libraries?: LibraryData[];
  store?: Store<State>;
  isLoaded: boolean;
}

export default class LibrariesList extends React.Component<LibrariesListOwnProps, {}> {
  render(): JSX.Element {
    return (
      !this.props.isLoaded ?
        <LoadingIndicator /> :
        this.props.libraries ?
          <ul className="list">
            { this.props.libraries.map(library =>
              <LibrariesListItem
                key={library.uuid}
                library={library}
                store={this.props.store}
              />) }
          </ul> :
          <span>There are no libraries in this registry yet.</span>
    );
  }
}
