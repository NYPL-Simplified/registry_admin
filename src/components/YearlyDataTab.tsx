import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import StatsInnerList from "./StatsInnerList";

export interface YearlyDataTabProps {
  data: {[key: string]: LibraryData[]};
}

export interface YearlyDataTabState {
  styled: boolean;
}

export default class YearlyDataTab extends React.Component<YearlyDataTabProps, YearlyDataTabState> {
  private dataRef = React.createRef<HTMLUListElement>();
  constructor(props: YearlyDataTabProps) {
    super(props);
    this.state = { styled: true };
    this.toggleFormatting = this.toggleFormatting.bind(this);
  }
  sortByYear(data) {
    let sortedByYear = {};
    Object.keys(data).forEach((catName: string) => {
      let category = data[catName];
      category.forEach((library) => {
        let year = library.basic_info.timestamp && library.basic_info.timestamp.match(/20\d+/)[0];
        if (year) {
          if (sortedByYear[year]) {
            sortedByYear[year][catName].push(library);
          } else {
            sortedByYear[year] = {"production": [], "testing": [], "cancelled": []};
            sortedByYear[year][catName].push(library);
          }
        }
      });
    });
    return sortedByYear;
  }
  toggleFormatting() {
    this.setState({ styled: !this.state.styled });
  }
  render(): JSX.Element {
    let sortedByYear = this.sortByYear(this.props.data);
    let years = Object.keys(sortedByYear).map(y =>
      <li key={y} className="year-li">
        <section className={this.state.styled ? "header-bar" : ""}>
          <span>{y}</span>
        </section>
        <section className={this.state.styled ? "list-holder" : ""}>
          { <StatsInnerList data={sortedByYear[y]} styled={this.state.styled} /> }
        </section>
      </li>
    );
    return (
      <div className="yearly-data">
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
          { years }
        </ul>
      </div>
    );
  }
}
