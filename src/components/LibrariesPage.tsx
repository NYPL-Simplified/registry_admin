import * as React from "react";
import { Store, Reducer } from "redux";
import { State } from "../reducers/index";
import { LibrariesData } from "../interfaces";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import LibrariesList from "./LibrariesList";
import SearchForm from "./SearchForm";
import Toggle from "./reusables/Toggle";

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
  fetchQA: () => Promise<LibrariesData>;
}

export interface LibrariesPageState {
  showAll: boolean;
  searchTerm: string;
  qa: boolean;
}

export interface LibrariesPageProps extends LibrariesPageStateProps, LibrariesPageOwnProps, LibrariesPageDispatchProps {};

export class LibrariesPage extends React.Component<LibrariesPageProps, LibrariesPageState> {
  constructor(props: LibrariesPageProps) {
    super(props);
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
    this.toggleQA = this.toggleQA.bind(this);
    this.state = { showAll: true, searchTerm: "", qa: false };
  }

  render(): JSX.Element {
    // Does the registry have libraries?
    let hasLibraries = (this.props.libraries && this.props.libraries.libraries && this.props.libraries.libraries.length);
    // List of all libraries for the registry:
    let allLibraries = hasLibraries && this.props.libraries.libraries;
    // The user has submitted a search, and there are results:
    let results = !this.state.showAll && this.props.results && this.props.results.libraries;
    // The user has submitted a search, but there are no results:
    let noResults = !this.state.showAll && !this.props.results && [];
    // There are four possible scenarios:
    // 1) A search has been submitted, and there are search results. Set the libraries variable to the list of results.
    // 2) A search has been submitted, and there are not search results. Set the libraries variable to an empty array;
    // this will generate a "no results were found" message.
    // 3) A search has not been submitted, and the registry has libraries. Set the libraries variable to the full
    // list of the registry's libraries.
    // 4) A search has not been submitted, and the registry does not have libraries. Let the libraries
    // variable remain undefined; this will generate a "no libraries in this registry" message.
    let libraries = (results || noResults) || allLibraries;

    let searchForm: JSX.Element = <SearchForm
      search={this.search}
      term={this.state.searchTerm}
      text="Search for a library by name"
      inputName="name"
      clear={!this.state.showAll ? this.clear : null}
      resultsCount={libraries && libraries.length}
    />;
    let toggle: JSX.Element = <Toggle onToggle={this.toggleQA} initialOn={this.state.qa} label="QA" />;

    return (
      <div className="libraries-page">
        { toggle }
        { searchForm }
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

  async toggleQA(showQA: boolean) {
    this.setState({ "qa": showQA });
    let fetch = showQA ? this.props.fetchQA : this.props.fetchData;
    await fetch();
  }

  async search(data: FormData) {
    this.setState({ showAll: false, searchTerm: (data.get("name") as string) });
    await this.props.search(data);
  }

  async clear() {
    this.setState({ showAll: true, searchTerm: "" });
    let fetch = this.state.qa ? this.props.fetchQA : this.props.fetchData;
    await fetch();
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
    fetchQA: () => dispatch(actions.fetchLibraries("/qa")),
    search: (data: FormData) => dispatch(actions.search(data)),
  };
}

const ConnectedLibrariesPage = connect<LibrariesPageStateProps, LibrariesPageDispatchProps, LibrariesPageOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LibrariesPage);

export default ConnectedLibrariesPage;
