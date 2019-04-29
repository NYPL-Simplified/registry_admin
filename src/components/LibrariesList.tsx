import * as React from "react";
import { Store, Reducer } from "redux";
import { State } from "../reducers/index";
import { LibrariesData, LibraryData } from "../interfaces";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import LibrariesListItem from "./LibrariesListItem";

export interface LibrariesListStateProps {
  libraries?: LibrariesData;
}

export interface LibrariesListOwnProps {
  store?: Store<State>;
}

export interface LibrariesListDispatchProps {
  fetchData: () => Promise<LibrariesData>;
}

export interface LibrariesListProps extends LibrariesListStateProps, LibrariesListOwnProps, LibrariesListDispatchProps {};

export class LibrariesList extends React.Component<LibrariesListProps, {}> {

  render(): JSX.Element {
    let hasLibraries = (this.props.libraries && this.props.libraries.libraries && this.props.libraries.libraries.length > 0);
    return(
      <ul className="list">
        { hasLibraries ?
          this.props.libraries.libraries.map(library =>
            <LibrariesListItem
              key={library.uuid}
              library={library}
              store={this.props.store}
            />
          ) :
          <span className="page-header">There are no libraries in this registry yet.</span>
        }
      </ul>
    );
  }

  componentWillMount() {
    this.props.fetchData();
  }

}

function mapStateToProps(state: State, ownProps: LibrariesListOwnProps) {
  return {
    libraries: state.libraries && state.libraries.data
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: LibrariesListOwnProps) {
  let actions = new ActionCreator(null);
  return {
    fetchData: () => dispatch(actions.fetchLibraries())
  };
}

const ConnectedLibrariesList = connect<LibrariesListStateProps, LibrariesListDispatchProps, LibrariesListOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LibrariesList);

export default ConnectedLibrariesList;
