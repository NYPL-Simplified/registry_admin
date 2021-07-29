import * as React from "react";
import { Panel } from "library-simplified-reusable-components";
import { Store } from "redux";
import { State } from "../reducers/index";
import { LibraryData } from "../interfaces";
import LibraryDetailPage from "./LibraryDetailPage";

export interface LibrariesListItemProps {
  library: LibraryData;
  store: Store<State>;
}

export interface LibrariesListItemState {
  color: string;
  panelOpen: boolean;
}

/** A color-coded panel displayed for each item in LibraryList, containing a LibraryDetailPage. */
export default class LibrariesListItem extends React.Component<
  LibrariesListItemProps,
  LibrariesListItemState
> {
  constructor(props: LibrariesListItemProps) {
    super(props);
    const color = this.colorCode(Object.values(this.props.library.stages));
    this.state = { color, panelOpen: false };
    this.colorCode = this.colorCode.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.content = this.content.bind(this);
    this.handleLibraryPanelClick = this.handleLibraryPanelClick.bind(this);
  }

  /**
   * This function sets the state of the LibrariesListItem component to open or close,
   * which in turn tells the Panel component whether to render its content or not.
   */
  handleLibraryPanelClick() {
    this.setState((prevState) => ({
      ...prevState,
      panelOpen: !prevState.panelOpen,
    }));
  }

  content() {
    return (
      <LibraryDetailPage
        library={this.props.library}
        updateColor={this.updateColor}
        store={this.props.store}
      />
    );
  }

  /**
   * Passed as a callback to the child LibraryDetailPage component, so that the LibrariesListItem
   * background color will update to reflect changes to the library's stages.
   */
  updateColor(stages: Array<string>): void {
    let color = this.colorCode(stages);
    this.setState({ color });
  }

  /**
   *If both library_stage and registry_stage are in production, background is green;
   * if at least one of them is cancelled, background is red;
   * otherwise, background is yellow.
   */
  colorCode(stages: Array<string>): string {
    if (stages.every((stage) => stage === "production")) {
      return "success";
    } else if (stages.some((stage) => stage === "cancelled")) {
      return "danger";
    }
    return "warning";
  }

  render(): JSX.Element {
    let style = this.state.color;
    let { name } = this.props.library.basic_info;
    return (
      <li>
        <Panel
          id={name.replace(/ /g, "-")}
          style={style}
          headerText={name}
          content={this.state.panelOpen ? this.content() : null}
          onClick={this.handleLibraryPanelClick}
        />
      </li>
    );
  }
}
