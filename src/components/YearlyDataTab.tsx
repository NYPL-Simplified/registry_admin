import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import StatsInnerList from "./StatsInnerList";
import DropdownButton from "./DropdownButton";
import { getPercentage, toggleState, findYear } from "../utils/sharedFunctions";

export interface YearlyDataTabProps {
  data: {[key: string]: LibraryData[]};
}

export interface YearlyDataTabState {
  styled: boolean;
  yearsToShow: {[key: number]: boolean};
  months: boolean;
}

export default class YearlyDataTab extends React.Component<YearlyDataTabProps, YearlyDataTabState> {
  private dataRef = React.createRef<HTMLUListElement>();
  constructor(props: YearlyDataTabProps) {
    super(props);
    this.state = { styled: true, yearsToShow: {}, months: false };
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
        let validated = library.urls_and_contact.contact_validated;
        let [year, formattedYear] = findYear(validated, null, "Unknown");
        year = year || "Unknown";
        if (year) {
          if (sortedByYear[year]) {
            sortedByYear[year][catName].push(library);
          } else {
            sortedByYear[year] = {"production": [], "testing": [], "cancelled": []};
            sortedByYear[year][catName].push(library);
          }
        }
        // Order by month, within each category.
        Object.keys(data).forEach(catName => data[catName] = this.sortByMonth(data[catName]));
      });
    });
    return sortedByYear;
  }
  sortByMonth(category: LibraryData[]): LibraryData[] {
    let sorted = (category as LibraryData[]).sort(function (x, y) {
      return new Date(
        x.urls_and_contact.contact_validated || x.basic_info.timestamp
      ).getMonth() - new Date(
        y.urls_and_contact.contact_validated || y.basic_info.timestamp
      ).getMonth();
    });
    return sorted;
  }
  getYearlyTotal(data: {[key: string]: LibraryData[]}) {
    return Object.values(data).map(v => v.length).reduce((accum, next) => accum + next);
  }
  toggleExpanded(e) {
    let [verb, year] = e.target.textContent.split(" ");
    let yearsToShow = {};
    let newValue = verb === "Show";
    if (year === "All") {
      Object.keys(this.state.yearsToShow).forEach(year => yearsToShow[year] = newValue);
    } else {
      yearsToShow[year] = newValue;
      yearsToShow = { ...this.state.yearsToShow, ...yearsToShow };
    }
    this.setState({ yearsToShow  });
  }
  render(): JSX.Element {
    let sortedByYear = this.sortByYear(this.props.data);
    let showOrHideAll: string = `${Object.keys(sortedByYear).every(year => this.state.yearsToShow[year]) ? "Hide" : "Show"} All`;
    let showOrHideYear = (year) => `${this.state.yearsToShow[year] ? "Hide" : "Show"} ${year}`;
    let monthsButton = (
      <Button
        key="months"
        callback={() => this.setState(toggleState("months", this.state))}
        content={`${this.state.months ? "Hide" : "Show"} Month Validated`}
        className="inline squared inverted left-align"
      />
    );
    let total = Object.keys(sortedByYear).map(y => this.getYearlyTotal(sortedByYear[y]));
    let years = Object.keys(sortedByYear).map((y, idx) => {
      let yearlyTotal = total[idx];
      return (
        <li key={y} className="year-li">
          <section className={this.state.styled ? "header-bar" : ""}>
            <span>{y}: {yearlyTotal} librar{yearlyTotal !== 1 ? "ies" : "y"} validated</span>
            <span>({getPercentage(yearlyTotal, total, true)})</span>
          </section>
          {
            this.state.yearsToShow[y] &&
            <section className={this.state.styled ? "list-holder" : ""}>
            { <StatsInnerList data={sortedByYear[y]} hasYear={y !== "Unknown"} styled={this.state.styled} showMonths={this.state.months} /> }
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
            callback={() => this.setState(toggleState("styled", this.state))}
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
          { Object.keys(this.state.yearsToShow).some(y => this.state.yearsToShow[y]) && monthsButton }
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
