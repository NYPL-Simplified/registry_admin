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
}

export interface LibrariesListProps extends LibrariesListStateProps, LibrariesListOwnProps, LibrariesListDispatchProps {};

export class LibrariesList extends React.Component<LibrariesListProps, LibrariesListState> {
  constructor(props: LibrariesListProps) {
    super(props);
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
    this.state = { showAll: true };
  }

  render(): JSX.Element {
    let hasLibraries = (this.props.libraries && this.props.libraries.libraries && this.props.libraries.libraries.length > 0);
    if (hasLibraries) {
      return (
        <ul className="list">
          <SearchForm
            search={this.search}
            text="Search for a library by name"
            inputName="name"
            clear={!this.state.showAll ? this.clear : null}
          />
        {
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
    else {
      return <span className="page-header">There are no libraries in this registry yet.</span>;
    }
  }

  componentWillMount() {
    this.props.fetchData();
  }

  async search(data: FormData) {
    console.log((data as any).get("name"));
    await this.props.search(data);
    this.setState({ showAll: false });
  }

  async clear() {
    await this.props.fetchData();
    this.setState({ showAll: true });
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
