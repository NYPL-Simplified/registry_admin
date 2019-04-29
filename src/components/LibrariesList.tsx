import * as React from "react";
import { Store, Reducer } from "redux";
import { State } from "../reducers/index";
import { LibrariesData } from "../interfaces";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import LibrariesListItem from "./LibrariesListItem";
import SearchForm from "./SearchForm";

export interface LibrariesListStateProps {
  libraries?: LibrariesData;
}

export interface LibrariesListOwnProps {
  store?: Store<State>;
}

export interface LibrariesListDispatchProps {
  fetchData: () => Promise<LibrariesData>;
  search: (data: FormData) => Promise<LibrariesData>;
}

export interface LibrariesListState {
  showAll: boolean;
  searchTerm: string;
}

export interface LibrariesListProps extends LibrariesListStateProps, LibrariesListOwnProps, LibrariesListDispatchProps {};

export class LibrariesList extends React.Component<LibrariesListProps, LibrariesListState> {
  constructor(props: LibrariesListProps) {
    super(props);
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
    this.getFormMessage = this.getFormMessage.bind(this);
    this.state = { showAll: true, searchTerm: "" };
  }

  render(): JSX.Element {
    let libraryItems;
    let hasLibraries = (this.props.libraries && this.props.libraries.libraries && this.props.libraries.libraries.length > 0);
    let libraries = hasLibraries && this.props.libraries.libraries;
    if (hasLibraries) {
      libraryItems = libraries.map(library =>
        <LibrariesListItem
          key={library.uuid}
          library={library}
          store={this.props.store}
        />
      );
    } else {
        libraryItems = <span className="page-header">There are no libraries in this registry yet.</span>;
    }

    let formMessage = this.getFormMessage;
    let form = (<SearchForm
      search={this.search}
      text="Search for a library by name"
      inputName="name"
      clear={!this.state.showAll ? this.clear : null}
      message={this.getFormMessage(libraries && libraries.length)}
    />);

    return (
      <ul className="list">
        {form}
        {libraryItems}
      </ul>
    );
  }

  componentWillMount() {
    this.props.fetchData();
  }

  getFormMessage(libraryCount: number | null): {} | null {
    if (!this.state.searchTerm) {
      return null;
    }

    let message = {};
    if (libraryCount) {
      let resultsNumber = `${libraryCount} ${libraryCount > 1 ? "results" : "result"} `;
      message["success"] = this.state.searchTerm ? `Displaying ${resultsNumber} for ${this.state.searchTerm}:` : null;
    }
    else {
      message["error"] = `No results found for ${this.state.searchTerm}.`;
    }

    return message;
  }

  async search(data: FormData) {
    this.setState({ showAll: false, searchTerm: (data.get("name") as string) });
    await this.props.search(data);
  }

  async clear() {
    this.setState({ showAll: true, searchTerm: "" });
    await this.props.fetchData();
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
    fetchData: () => dispatch(actions.fetchLibraries()),
    search: (data: FormData) => dispatch(actions.search(data)),
  };
}

const ConnectedLibrariesList = connect<LibrariesListStateProps, LibrariesListDispatchProps, LibrariesListOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LibrariesList);

export default ConnectedLibrariesList;
