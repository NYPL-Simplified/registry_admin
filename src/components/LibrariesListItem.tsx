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
}

export default class LibrariesListItem extends React.Component<LibrariesListItemProps, LibrariesListItemState> {
  constructor(props: LibrariesListItemProps) {
    super(props);
    const color = this.colorCode(Object.values(this.props.library.stages));
    this.state = { color };
    this.colorCode = this.colorCode.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.content = this.content.bind(this);
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

  updateColor(stages: Array<string>): void {
      let color = this.colorCode(stages);
      this.setState({ color });
  }

  colorCode(stages: Array<string>): string {
    // If both library_stage and registry_stage are in production, background is green;
    // if at least one of them is cancelled, background is red;
    // otherwise, background is yellow.
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
    return(
      <li>
        <Panel id={name.replace(/ /g, "-")} style={style} headerText={name} content={this.content()} />
      </li>
    );
  }
}
