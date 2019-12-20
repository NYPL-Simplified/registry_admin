import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";

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
    Object.keys(data).map((name: string) => {
      let category = data[name];
      category.forEach((library) => {
        let year = library.basic_info.timestamp && library.basic_info.timestamp.match(/20\d+/)[0];
        if (year) {
          if (sortedByYear[year]) {
            sortedByYear[year][name].push(library.basic_info.name);
          } else {
            sortedByYear[year] = {"production": [], "testing": [], "cancelled": []};
            sortedByYear[year][name].push(library.basic_info.name);
          }
        }
      });
    });
    return(sortedByYear);
  }
  toggleFormatting() {
    this.setState({ styled: !this.state.styled });
  }
  render(): JSX.Element {
    let hasStyles = this.state.styled;
    let categories = (year) => <ul>{Object.keys(year).map(c => <li><p>{c.substr(0, 1).toUpperCase() + c.substr(1)}</p>{names(year[c])}</li>)}</ul>;
    let names = (category) => <ul className="yearly-library-list">{category.map(l => <li>{l}</li>)}</ul>;
    let sortedByYear = this.sortByYear(this.props.data);
    let years = Object.keys(sortedByYear).map(y =>
      <li key={y} className={hasStyles ? "year-li" : ""}><p>{y}</p>{categories(sortedByYear[y])}</li>
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
          {years}
        </ul>
      </div>
    );
  }
}
