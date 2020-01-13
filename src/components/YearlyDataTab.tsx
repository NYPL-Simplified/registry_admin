import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import StatsInnerList from "./StatsInnerList";
import DropdownButton from "./DropdownButton";
import { getPercentage } from "../utils/sharedFunctions";

export interface YearlyDataTabProps {
  data: {[key: string]: LibraryData[]};
}

export interface YearlyDataTabState {
  styled: boolean;
  yearsToShow: {[key: number]: boolean};
}

export default class YearlyDataTab extends React.Component<YearlyDataTabProps, YearlyDataTabState> {
  private dataRef = React.createRef<HTMLUListElement>();
  constructor(props: YearlyDataTabProps) {
    super(props);
    this.state = { styled: true, yearsToShow: {} };
    this.toggleFormatting = this.toggleFormatting.bind(this);
  }
  async componentWillReceiveProps() {
    await Object.values(this.props.data).some(x => x.length > 0);
    let years = Object.keys(this.sortByYear(this.props.data));
    let yearsToShow = {};
    years.forEach(y => yearsToShow[y] = false);
    this.setState({...this.state, ...{ yearsToShow }});
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
  getYearlyTotal(data: {[key: string]: LibraryData[]}) {
    return Object.values(data).map(v => v.length).reduce((accum, next) => accum + next);
  }
  toggleExpanded(e) {
    let [verb, year] = e.target.textContent.toLowerCase().split(" ");
    let yearsToShow = {};
    let newValue = verb === "show";
    if (year === "all") {
      Object.keys(this.state.yearsToShow).forEach(year => yearsToShow[year] = newValue);
    } else {
      yearsToShow[year] = newValue;
    }
    this.setState({...this.state, ...{ yearsToShow }});
  }
  render(): JSX.Element {
    let sortedByYear = this.sortByYear(this.props.data);
    let showOrHideAll: string = `${Object.keys(sortedByYear).every(year => this.state.yearsToShow[year]) ? "Hide" : "Show"} All`;
    let showOrHideYear = (year) => `${this.state.yearsToShow[year] ? "Hide" : "Show"} ${year}`;
    let total = Object.keys(sortedByYear).map(y => this.getYearlyTotal(sortedByYear[y]));
    let years = Object.keys(sortedByYear).map((y) => {
      let yearlyTotal = this.getYearlyTotal(sortedByYear[y]);
      return (
        <li key={y} className="year-li">
          <section className={this.state.styled ? "header-bar" : ""}>
            <span>{y}: {yearlyTotal}</span>
            <span>{getPercentage(yearlyTotal, total, true)}</span>
          </section>
          {
            this.state.yearsToShow[y] &&
            <section className={this.state.styled ? "list-holder" : ""}>
            { <StatsInnerList data={sortedByYear[y]} styled={this.state.styled} /> }
            </section>
          }
        </li>
      );
    });
    return (
      <div className="yearly-data">
        <div className="buttons">
          <Button
            key="format"
            callback={this.toggleFormatting}
            content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
            className="inline squared inverted left-align"
          />
          <DropdownButton
            mainContent="Year Display"
            callback={(e) => { this.toggleExpanded(e); }}
            menuContent={
              [showOrHideAll].concat(Object.keys(sortedByYear).map(x => showOrHideYear(x)))
            }
            className="inline squared inverted left-align"
            key="dropdown"
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
