import * as React from "react";
import { PanelGroup } from "react-bootstrap";
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

export class LibrariesList extends React.Component<LibrariesListProps, void> {

  render(): JSX.Element {
    return(
      <ul className="panel-group">
        { this.props.libraries &&
          this.props.libraries.libraries.map(library =>
            <LibrariesListItem
              key={library.uuid}
              library={library}
              store={this.props.store}
            />
          )
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
