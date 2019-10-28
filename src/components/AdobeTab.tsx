import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { AdobeData } from "../interfaces";

export interface AdobeTabProps {
  data: AdobeData;
}

export interface AdobeTabState {
  styled: boolean;
}

export default class AdobeTab extends React.Component<AdobeTabProps, AdobeTabState> {
  private dataRef = React.createRef<HTMLUListElement>();
  constructor(props: AdobeTabProps) {
    super(props);
    this.state = { styled: true };
    this.toggleFormatting = this.toggleFormatting.bind(this);
  }

  render(): JSX.Element {
    let hasStyles = this.state.styled;
    return (
      <div className="adobe-data">
        <div className="buttons">
          <Button
            key="format"
            callback={this.toggleFormatting}
            content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
            className="inline squared inverted left-align"
          />
          <CopyButton element={this.dataRef.current} />
        </div>
        <ul
          ref={this.dataRef}
          contentEditable
          suppressContentEditableWarning
        >
          { this.props.data && Object.keys(this.props.data).map((libraryName) => {
              return (
                <li key={libraryName} className={hasStyles ? "adobe-data-li" : ""}>
                  <span>{libraryName}: {this.props.data[libraryName]} </span>
                  <span>({this.getPercentage(this.props.data[libraryName])}%)</span>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  getPercentage(x: number): number {
    let total = Object.values(this.props.data).reduce((x, y) => x + y);
    let percentage = Math.round((x / total) * 100);
    return percentage;
  }

  toggleFormatting() {
    this.setState({ styled: !this.state.styled });
  }
}
