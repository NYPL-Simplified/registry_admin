import * as React from "react";
import { Store } from "redux";
import { State } from "../reducers/index";
import { LibrariesData, LibraryData } from "../interfaces";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import LibrariesList from "./LibrariesList";
import SearchForm from "./SearchForm";
import Filter from "./Filter";
import Stats from "./Stats";
import Toggle from "./reusables/Toggle";

export interface LibrariesPageStateProps {
  libraries?: LibrariesData;
  results?: LibrariesData;
  updatedLibrary?: LibraryData;
  isLoaded?: boolean;
}

export interface LibrariesPageOwnProps {
  store: Store<State>;
}

export interface LibrariesPageDispatchProps {
  search: (data: FormData) => Promise<LibrariesData>;
  fetchQA: () => Promise<LibrariesData>;
}

export interface LibrariesPageState {
  showAll: boolean;
  searchTerm: string;
  qa: boolean;
  filters: { [key: string]: any };
}

export interface LibrariesPageProps
  extends LibrariesPageStateProps,
    LibrariesPageOwnProps,
    LibrariesPageDispatchProps {}

/** The main component containing both the Aggregate Data panel and the LibrariesList. */
export class LibrariesPage extends React.Component<
  LibrariesPageProps,
  LibrariesPageState
> {
  constructor(props: LibrariesPageProps) {
    super(props);
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
    this.toggleQA = this.toggleQA.bind(this);
    this.filterProduction = this.filterProduction.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.filterByAttribute = this.filterByAttribute.bind(this);
    this.flipFilter = this.flipFilter.bind(this);
    this.state = {
      showAll: true,
      searchTerm: "",
      qa: false,
      filters: { flipped: false, attributes: { "PLS ID": false } },
    };
  }

  convertToAttrName(name: string): string {
    return name.toLowerCase().split(" ").join("_");
  }

  render(): JSX.Element {
    let libraries = this.getLibraryList();

    let searchForm: JSX.Element = (
      <SearchForm
        search={this.search}
        term={this.state.searchTerm}
        text="Search"
        inputName="name"
        clear={!this.state.showAll ? this.clear : null}
        resultsCount={libraries && libraries.length}
      />
    );

    let filter: JSX.Element = (
      <Filter
        filterKeys={this.state.filters.attributes}
        setFilter={this.setFilter}
        flipFilter={this.flipFilter}
        title="Only show libraries which"
      />
    );

    let toggle: JSX.Element = (
      <Toggle
        onToggle={this.toggleQA}
        initialOn={this.state.qa}
        label="Show All"
      />
    );
    return (
      <div className="libraries-page">
        {toggle}
        <Stats
          libraries={this.props.libraries && this.props.libraries.libraries}
        />
        {searchForm}
        {filter}
        <LibrariesList
          libraries={libraries}
          store={this.props.store}
          isLoaded={this.props.isLoaded}
        />
      </div>
    );
  }

  componentWillMount() {
    this.props.fetchQA();
  }

  updateLibraryList(libraryList) {
    let newLibrary = this.props.updatedLibrary;
    let oldLibraryIdx = libraryList.findIndex(
      (l) => l.uuid === newLibrary.uuid
    );
    libraryList[oldLibraryIdx] = newLibrary;
    return libraryList;
  }

  filterProduction(libraries) {
    let inProduction = (l) =>
      Object.values(l.stages).every((s) => s === "production");
    return libraries.filter((l) => inProduction(l));
  }

  /**
   * @param {string} filter The library attribute to be filtered by
   */
  setFilter(filter: string) {
    let updatedFilters = this.state.filters.attributes;
    updatedFilters[filter] = !this.state.filters.attributes[filter];
    this.setState({
      filters: {
        flipped: this.state.filters.flipped,
        attributes: updatedFilters,
      },
    });
  }

  /**
   * Switch between showing libraries which have the specified attributes and showing libraries which do not
   * have them.
   */
  flipFilter() {
    this.setState({
      filters: {
        flipped: !this.state.filters.flipped,
        attributes: this.state.filters.attributes,
      },
    });
  }

  /**
   * Recursively check whether a library has a truthy value for a particular attribute
   */
  hasAttr(dict, attr) {
    let isDict = (dict) =>
      dict && typeof dict === "object" && !Array.isArray(dict);
    if (!isDict(dict)) {
      return;
    }
    if (Object.keys(dict).indexOf(attr) >= 0) {
      return !!dict[attr];
    }
    let subDicts = Object.values(dict).filter((v) => isDict(v));
    return !!subDicts.filter((sd) => this.hasAttr(sd, attr)).length;
  }

  /**
   * For each attribute that the user wants to filter by, narrow down the list of libraries to display.
   */
  filterByAttribute(libraries) {
    let attributes = Object.keys(this.state.filters.attributes).filter(
      (attr) => this.state.filters.attributes[attr]
    );
    libraries &&
      attributes.forEach((attr) => {
        attr = this.convertToAttrName(attr);
        libraries = libraries.filter((l) =>
          this.state.filters.flipped
            ? !this.hasAttr(l, attr)
            : this.hasAttr(l, attr)
        );
      });
    return libraries;
  }

  getLibraryList() {
    // Does the registry have libraries?
    let hasLibraries =
      this.props.libraries &&
      this.props.libraries.libraries &&
      this.props.libraries.libraries.length;
    // List of all libraries for the registry:
    let allLibraries = hasLibraries && this.props.libraries.libraries;
    // The user edited a library:
    if (allLibraries && this.props.updatedLibrary) {
      allLibraries = this.updateLibraryList(allLibraries);
    }
    // There might be QA libraries available, but the user only wants to see the production ones:
    let filteredLibraries =
      !this.state.qa && allLibraries && this.filterProduction(allLibraries);
    // The user has submitted a search, and there are results:
    let allResults =
      !this.state.showAll && this.props.results && this.props.results.libraries;
    // The user edited a search result:
    if (allResults && this.props.updatedLibrary) {
      allResults = this.updateLibraryList(allResults);
    }
    // The user has submitted a search, but only wants to see results for production libraries:
    let filteredResults =
      !this.state.qa && allResults && this.filterProduction(allResults);
    // The user has submitted a search, but there are no results:
    let noResults = !this.state.showAll && !this.props.results && [];

    // There are six possible scenarios:
    // 1) A search has been submitted, QA mode is active, and there are search results. Set the libraries variable to the list of results.
    // 2) A search has been submitted, QA mode is not active, and there are search results.  Set the libraries variable to a filtered list
    // of results--just the ones that are in production.
    // 3) A search has been submitted, and there are not search results. Set the libraries variable to an empty array;
    // this will generate a "no results were found" message.
    // 4) A search has not been submitted, the registry has libraries, and QA mode is not active.  Set the libraries
    // variable to a filtered list of libraries--just the ones that are in production.
    // 5) A search has not been submitted, the registry has libraries, and QA mode is active. Set the libraries variable
    // to the full list of the registry's libraries.
    // 6) A search has not been submitted, and the registry does not have libraries. Let the libraries
    // variable remain undefined; this will generate a "no libraries in this registry" message.

    // If one of the libraries undergoes changes--e.g. is put into/taken out of production--the libraries variable will be updated accordingly.

    let list =
      filteredResults ||
      allResults ||
      noResults ||
      filteredLibraries ||
      allLibraries;
    return this.filterByAttribute(list);
  }

  async toggleQA(showQA: boolean) {
    this.setState({ qa: showQA });
    if (showQA && this.state.searchTerm && !this.props.results) {
      // The user searched for a QA library, but didn't switch to QA mode until after submitting the search.
      let searchTerm = new (window as any).FormData();
      searchTerm.append("name", this.state.searchTerm);
      await this.search(searchTerm);
    }
  }

  async search(data: FormData) {
    this.setState({
      showAll: false,
      searchTerm: data.get("name") as string,
      filters: this.state.filters,
    });
    await this.props.search(data);
  }

  async clear() {
    this.setState({ showAll: true, searchTerm: "" });
    await this.props.fetchQA();
  }
}

function mapStateToProps(state: State, ownProps: LibrariesPageOwnProps) {
  return {
    libraries: state.libraries && state.libraries.data,
    updatedLibrary: state.library && state.library.data,
    results: state.results && state.results.data,
    isLoaded: state.libraries && state.libraries.isLoaded,
  };
}

function mapDispatchToProps(
  dispatch: Function,
  ownProps: LibrariesPageOwnProps
) {
  let actions = new ActionCreator(null);
  return {
    fetchQA: () => dispatch(actions.fetchLibraries("/qa")),
    search: (data: FormData) => dispatch(actions.search(data)),
  };
}

const ConnectedLibrariesPage = connect<
  LibrariesPageStateProps,
  LibrariesPageDispatchProps,
  LibrariesPageOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(LibrariesPage);

export default ConnectedLibrariesPage;
