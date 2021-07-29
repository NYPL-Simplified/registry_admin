import * as React from "react";
import { LibraryData } from "../interfaces";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import { Store } from "redux";
import { State } from "../reducers/index";
import LibraryDetailItem from "./LibraryDetailItem";
import LibraryStageItem from "./LibraryStageItem";
import { Form, Tabs } from "library-simplified-reusable-components";
import EmailValidationSection from "./EmailValidationSection";
import PlsIDForm from "./PlsIDForm";

export interface LibraryDetailPageDispatchProps {
  editStages: (data: FormData) => Promise<void>;
  fetchLibrary: (uuid: string) => LibraryData;
}

export interface LibraryDetailPageStateProps {
  fullLibrary?: LibraryData;
}

export interface LibraryDetailPageOwnProps {
  library: LibraryData;
  store: Store<State>;
  updateColor: (stages: Array<string>) => void;
}

export interface LibraryDetailPageState {
  libraryStage: string;
  registryStage: string;
}

export interface LibraryDetailPageProps
  extends LibraryDetailPageStateProps,
    LibraryDetailPageDispatchProps,
    LibraryDetailPageOwnProps {}

/** The expanded display of information about an individual LibrariesListItem. */
export class LibraryDetailPage extends React.Component<
  LibraryDetailPageProps,
  LibraryDetailPageState
> {
  constructor(props: LibraryDetailPageProps) {
    super(props);
    this.submit = this.submit.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.renderStages = this.renderStages.bind(this);
    this.state = {
      libraryStage:
        this.props.library && this.props.library.stages.library_stage,
      registryStage:
        this.props.library && this.props.library.stages.registry_stage,
    };
  }

  renderItems(category: { [key: string]: string }): JSX.Element {
    // If the value is an array--e.g. of focus or service areas--format it as a semicolon-separated list.
    let formatValue = (value: string | string[]) => {
      return Array.isArray(value) ? value.join("; ") : `${value}`;
    };

    // Only create LibraryDetailItems for fields which actually have a value.
    let fields = Object.keys(category)
      .filter((label) => category[label] && category[label].length)
      .map((label) => (
        <LibraryDetailItem
          key={label}
          label={label}
          value={formatValue(category[label])}
        />
      ));

    return <ul className={`list-group`}>{fields}</ul>;
  }

  /** The form for viewing/editing the library stage and registry stage. */
  renderStages(): JSX.Element {
    return (
      <Form
        className="border"
        hiddenName="uuid"
        hiddenValue={this.props.library.uuid}
        onSubmit={this.submit}
        content={[
          <LibraryStageItem
            key="lib"
            label={"Library Stage"}
            value={this.state.libraryStage}
          />,
          <LibraryStageItem
            key="reg"
            label={"Registry Stage"}
            value={this.state.registryStage}
          />,
        ]}
      />
    );
  }

  /** Edit the library stage and registry stage, and update the parent element's background color accordingly. */
  async submit(data: FormData): Promise<void> {
    await this.props.editStages(data);
    await this.props.fetchLibrary(this.props.library.uuid);

    let libraryStage = this.props.fullLibrary.stages.library_stage;
    let registryStage = this.props.fullLibrary.stages.registry_stage;
    this.props.updateColor([libraryStage, registryStage]);
    this.setState({ libraryStage, registryStage });
  }

  render(): JSX.Element {
    if (!this.props.library) {
      return null;
    }
    let library =
      this.props.fullLibrary &&
      this.props.fullLibrary.uuid === this.props.library.uuid
        ? this.props.fullLibrary
        : this.props.library;
    let tabItems = {};

    const categories = {
      "Basic Information": "basic_info",
      "Contact & URLs": "urls_and_contact",
      Areas: "areas",
    };
    // Sort the library information by category, and create a tab for each category.
    Object.entries(categories).forEach(([k, v]) => {
      let category = library[v];
      if (category) {
        let categoryItems: (string | string[])[] = Object.values(category);
        // // If there are no meaningful items in this category--e.g. it's an Areas category in which
        // // both values are empty arrays--then don't bother making a blank tab for it.
        let hasItems = categoryItems.some((x) => x && x.length > 0);
        hasItems && (tabItems[k] = this.renderItems(category));
      }
    });
    return (
      <div>
        {this.renderStages()}
        <hr />
        <EmailValidationSection store={this.props.store} library={library} />
        <hr />
        <PlsIDForm
          store={this.props.store}
          currentID={library.basic_info.pls_id}
          fetchLibrary={this.props.fetchLibrary}
          uuid={library.uuid}
        />
        <hr />
        <div className="detail-content">
          <Tabs items={tabItems} uniqueId={library.basic_info.name} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State, ownProps: LibraryDetailPageOwnProps) {
  return {
    fullLibrary: state.library && state.library.data,
  };
}

function mapDispatchToProps(
  dispatch: Function,
  ownProps: LibraryDetailPageOwnProps
) {
  let actions = new ActionCreator(null);
  return {
    editStages: (data: FormData) => dispatch(actions.editStages(data)),
    fetchLibrary: (uuid: string) => dispatch(actions.fetchLibrary(uuid)),
  };
}

const ConnectedLibraryDetailPage = connect<
  LibraryDetailPageStateProps,
  LibraryDetailPageDispatchProps,
  LibraryDetailPageOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(LibraryDetailPage);

export default ConnectedLibraryDetailPage;
