import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import { getPercentage } from "../utils/sharedFunctions";

export interface AdobeTabProps {
  data: LibraryData[];
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
    this.total = this.total.bind(this);
  }

  total() {
    let idCounts = this.props.data.map(l => parseInt(l.basic_info.number_of_patrons));
    if (idCounts.length > 0) {
      return idCounts.reduce((accum, next) => accum + next);
    }
    return 0;
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
          <p className={this.state.styled && "adobe-total"}>Total Adobe IDs: {this.total()}</p>
          { this.props.data && this.props.data.map((library) => {
            let name = library.basic_info.name;
            let numberOfPatrons = parseInt(library.basic_info.number_of_patrons);
              return (
                <li key={name} className={hasStyles ? "adobe-li" : ""}>
                  <section className={hasStyles ? "header-bar" : ""}>
                    <span>{name}: {numberOfPatrons} patron{numberOfPatrons !== 1 && "s"}</span>
                    <span>({getPercentage(numberOfPatrons, this.props.data.map(l => l.basic_info.number_of_patrons), true)})</span>
                  </section>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  toggleFormatting() {
    this.setState({ styled: !this.state.styled });
  }
}
