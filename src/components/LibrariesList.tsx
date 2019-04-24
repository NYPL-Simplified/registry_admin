import * as React from "react";
import * as ReactDOM from "react-dom";
import { Store, Reducer } from "redux";
import { State } from "../reducers/index";
import { LibrariesData, LibraryData } from "../interfaces";
import { connect } from "react-redux";
import { Panel } from "library-simplified-reusable-components";
import ActionCreator from "../actions";
import LibrariesListItem from "./LibrariesListItem";
import { SearchIcon } from "@nypl/dgx-svg-icons";
import SearchForm from "./SearchForm";
import Form from "./reusables/Form";
import Input from "./reusables/Input";

export interface LibrariesListStateProps {
  libraries?: LibrariesData;
  libraryFromSearch?: LibraryData;
}

export interface LibrariesListOwnProps {
  store?: Store<State>;
}

export interface LibrariesListDispatchProps {
  fetchData: () => Promise<LibrariesData>;
  search?: (data: FormData) => Promise<LibraryData>;
  clearSearch?: () => void;
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
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.state = { showAll: !this.props.libraryFromSearch, searchTerm: "" };
  }

  render(): JSX.Element {
    let hasLibraries = (this.props.libraries && this.props.libraries.libraries && this.props.libraries.libraries.length > 0);
    if (hasLibraries) {
      let libraries = (this.state.showAll || !this.props.libraryFromSearch) ? this.props.libraries.libraries : [this.props.libraryFromSearch];
      return (
        <ul className="list">
          <SearchForm
            search={this.search}
            updateSearchTerm={this.updateSearchTerm}
            disableButton={this.state.showAll && !this.state.searchTerm.length}
          />
        {
          this.props.libraries.libraries.map(library =>
            <LibrariesListItem
              key={library.uuid}
              library={library}
              store={this.props.store}
              current={this.props.libraryFromSearch && library.uuid === this.props.libraryFromSearch.uuid}
              ref={library.uuid}
            />
          )
        }
        </ul>
      );
    }
    else {
      return <span className="page-header">There are no libraries in this registry yet.</span>;
    }
  }

  componentWillMount() {
    this.props.fetchData();
  }

  updateSearchTerm(e): void {
    this.setState({...this.state, searchTerm: e.currentTarget.value});
  }

  async search(data: FormData) {
    this.props.clearSearch();
    await this.props.search(data);
    if (this.props.libraryFromSearch && this.refs[this.props.libraryFromSearch.uuid]) {
      let position = (ReactDOM.findDOMNode(this.refs[this.props.libraryFromSearch.uuid]) as any).offsetTop;
      window.scrollTo(0, position - 20);
    }
    this.setState({...this.state, showAll: !this.state.showAll });
  }
}

function mapStateToProps(state: State, ownProps: LibrariesListOwnProps) {
  return {
    libraries: state.libraries && state.libraries.data,
    libraryFromSearch: state.library && state.library.data
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: LibrariesListOwnProps) {
  let actions = new ActionCreator(null);
  return {
    fetchData: () => dispatch(actions.fetchLibraries()),
    search: (data: FormData) => dispatch(actions.search(data)),
    clearSearch: () => dispatch(actions.clearSearch())
  };
}

const ConnectedLibrariesList = connect<LibrariesListStateProps, LibrariesListDispatchProps, LibrariesListOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LibrariesList);

export default ConnectedLibrariesList;
