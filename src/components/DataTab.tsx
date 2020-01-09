import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import { getPercentage } from "../utils/sharedFunctions";
import AdobeTab from "./AdobeTab";

export interface DataTabProps {
  data?: {[key: string]: LibraryData[]};
  component?: any;
}

export interface DataTabState {
  styled: boolean;
}

export default class DataTab extends React.Component<DataTabProps, DataTabState> {
  private dataRef = React.createRef<HTMLUListElement>();
  constructor(props: DataTabProps) {
    super(props);
    this.state = { styled: true };
    this.toggleFormatting = this.toggleFormatting.bind(this);
  }
  toggleFormatting() {
    this.setState({ styled: !this.state.styled });
  }
  render() {
    let buttons = (
      <div className="buttons">
        <Button
          key="format"
          callback={this.toggleFormatting}
          content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
          className="inline squared inverted left-align"
        />
        <CopyButton element={this.dataRef.current} />
      </div>
    );
    let data = this.props.data;
    // let component = this.props.data && React.createElement(AdobeTab, { ...this.props.data } );
    return (
      <div className={`data-tab ${this.state.styled && "adobe-data"}`}>
        {buttons}
        {this.props.component}
      </div>
    );
  }
}
