import * as React from "react";
import CopyButton from "./CopyButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import StatsInnerList from "./StatsInnerList";
import DropdownButton from "./DropdownButton";
import { months, hasLibraries, getMonth, toggleState, findYear } from "../utils/sharedFunctions";

const today = new Date() as any;
const thisMonth = today.toLocaleString("default", { month: "long" });
const thisYear = findYear(today.toDateString())[0];
export interface MonthlyDataTabProps {
  data: {[key: string]: LibraryData[]};
}

export interface MonthlyDataTabState {
  month: string;
  year: string;
  dataToShow: {[key: string]: LibraryData[]};
  styled: boolean;
}

export default class MonthlyDataTab extends React.Component<MonthlyDataTabProps, MonthlyDataTabState> {
  // Displays a list of libraries added during any given month/year combination.
  private monthlyDataRef = React.createRef<HTMLElement>();

  constructor(props: MonthlyDataTabProps) {
    super(props);
    this.state = {
      month: thisMonth,
      year: thisYear,
      styled: true,
      dataToShow: this.filter(thisMonth, thisYear)
    };
  }

  async componentWillReceiveProps() {
    await hasLibraries(this.props.data);
    this.setState({ dataToShow: this.filter(thisMonth, thisYear) });
  }

  updateTimeframe(e, key: string) {
    // valueToKeep is whichever item--month or year--the user has not selected a new value for.
    let valueToKeep = ["month", "year"].find(x => x !== key);
    let updatedTimes = {[key]: e.currentTarget.textContent, [valueToKeep]: this.state[valueToKeep]};
    let dataToShow = this.filter(updatedTimes.month, updatedTimes.year);
    this.setState({
      ...updatedTimes,
        dataToShow,
        styled: this.state.styled
    });
  }

  renderMenu(key: string, array: string[]): JSX.Element {
    // The array prop is a list of either all the months or all the years that should appear in the dropdown.
    let current = this.state[key];
    return (
      <DropdownButton
        mainContent={current}
        callback={(e) => { this.updateTimeframe(e, key); }}
        menuContent={array.filter(x => x !== current)}
        className="inline squared inverted left-align"
        key={`${key}-dropdown`}
      />
    );
  }

  getAllYears() {
    // A list of all the years in which a library has ever been added, i.e. the years that should appear in the dropdown.
    let years = [thisYear];
    Object.values(this.props.data).map((category) => {
      category.map((library) => {
        let year = findYear(library.urls_and_contact.contact_validated)[0];
        if (year !== "Unknown" && !years.includes(year)) {
          years.push(year);
        }
      });
    });
    return years;
  }

  filter(month: string, year: string) {
    let prod = this.props.data.production;
    let test = this.props.data.testing;
    let filterCategory = (cat: LibraryData[]) => cat?.filter(l =>
      getMonth(l.urls_and_contact.contact_validated) === month &&
      findYear(l.urls_and_contact.contact_validated)[0] === year
    );
    return { "production": filterCategory(prod), "testing": filterCategory(test) };
  }

  render(): JSX.Element {
    const { month, year } = this.state;

    const buttons: JSX.Element = (
      <section className="buttons">
        { this.renderMenu("month", months) }
        { this.renderMenu("year", this.getAllYears()) }
        <Button
          key="format"
          callback={() => this.setState(toggleState("styled", this.state))}
          content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
          className="inline squared inverted left-align"
        />
        <CopyButton element={this.monthlyDataRef.current} />
      </section>
    );
    const headerBar: JSX.Element = (
      <section className={this.state.styled ? "header-bar" : ""}>
        <span>{
          hasLibraries(this.state.dataToShow) ?
            `${this.state.month}, ${this.state.year}` :
            `No libraries were validated during ${month} of ${year}.`
        }</span>
      </section>
    );

    const data: JSX.Element = (
      <section
        className="disable-events"
        ref={this.monthlyDataRef}
        contentEditable
        suppressContentEditableWarning
      >
        { headerBar }
        {
          hasLibraries(this.state.dataToShow) &&
            <section className={this.state.styled ? "list-holder" : ""}>
              <StatsInnerList data={this.state.dataToShow} styled={this.state.styled} hasYear={true} />
            </section>
        }
      </section>
    );

    return (
      <div className="monthly-data">
        { buttons }
        { data }
      </div>
    );
  }
}
