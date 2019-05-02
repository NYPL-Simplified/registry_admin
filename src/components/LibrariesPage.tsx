import * as React from "react";
import { Store, Reducer } from "redux";
import { State } from "../reducers/index";
import { LibrariesData } from "../interfaces";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import LibrariesList from "./LibrariesList";
import SearchForm from "./SearchForm";

export interface LibrariesPageStateProps {
  libraries?: LibrariesData;
  results?: LibrariesData;
}

export interface LibrariesPageOwnProps {
  store: Store<State>;
}

export interface LibrariesPageDispatchProps {
  fetchData: () => Promise<LibrariesData>;
  search: (data: FormData) => Promise<LibrariesData>;
}

export interface LibrariesPageState {
  showAll: boolean;
  searchTerm: string;
}

export interface LibrariesPageProps extends LibrariesPageStateProps, LibrariesPageOwnProps, LibrariesPageDispatchProps {};

export class LibrariesPage extends React.Component<LibrariesPageProps, LibrariesPageState> {
  constructor(props: LibrariesPageProps) {
    super(props);
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
    this.state = { showAll: true, searchTerm: "" };
  }

  render(): JSX.Element {
    let hasLibraries = (this.props.libraries && this.props.libraries.libraries && this.props.libraries.libraries.length > 0);
    let allLibraries = hasLibraries && this.props.libraries.libraries;
    let results = !this.state.showAll && this.props.results && this.props.results.libraries;
    let noResults = !this.state.showAll && !this.props.results && [];
    let libraries = (results || noResults) || allLibraries;
    return (
      <div className="libraries-page">
        <SearchForm
          search={this.search}
          term={this.state.searchTerm}
          text="Search for a library by name"
          inputName="name"
          clear={!this.state.showAll ? this.clear : null}
          resultsCount={libraries && libraries.length}
        />
        <LibrariesList
          libraries={libraries}
          store={this.props.store}
        />
      </div>
    );
  }

  componentWillMount() {
    this.props.fetchData();
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

function mapStateToProps(state: State, ownProps: LibrariesPageOwnProps) {
  return {
    libraries: state.libraries && state.libraries.data,
    results: state.results && state.results.data
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: LibrariesPageOwnProps) {
  let actions = new ActionCreator(null);
  return {
    fetchData: () => dispatch(actions.fetchLibraries()),
    search: (data: FormData) => dispatch(actions.search(data)),
  };
}

const ConnectedLibrariesPage = connect<LibrariesPageStateProps, LibrariesPageDispatchProps, LibrariesPageOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LibrariesPage);

export default ConnectedLibrariesPage;
