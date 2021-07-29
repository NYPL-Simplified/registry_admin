import * as React from "react";
import { Panel, Tabs } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import AggregateList from "./AggregateList";
import Charts from "./Charts";
import AdobeTab from "./AdobeTab";
import YearlyDataTab from "./YearlyDataTab";
import MonthlyDataTab from "./MonthlyDataTab";

export interface StatsProps {
  libraries?: LibraryData[];
}
export interface StatsState {
  panelOpen: boolean;
}

/** The Aggregate Data panel. */
export default class Stats extends React.Component<StatsProps, StatsState> {
  constructor(props: StatsProps) {
    super(props);
    this.state = { panelOpen: false };
    this.sortLibraries = this.sortLibraries.bind(this);
    this.handleStatsPanelClick = this.handleStatsPanelClick.bind(this);
  }

  /**
   * This function sets the state of the Stats component to open or close,
   * which in turn tells the Panel component whether to render its content or not.
   */
  handleStatsPanelClick() {
    this.setState((prevState) => ({
      ...prevState,
      panelOpen: !prevState.panelOpen,
    }));
  }

  render(): JSX.Element {
    let sorted = this.sortLibraries();
    let tabItems = {
      List: <AggregateList data={sorted} />,
      Charts: <Charts data={sorted} />,
      "Adobe Data": <AdobeTab data={sorted.production} />,
      "Yearly Data": <YearlyDataTab data={sorted} />,
      "Monthly Data": <MonthlyDataTab data={sorted} />,
    };
    return (
      <Panel
        id="stats"
        headerText={"Aggregate Data"}
        content={
          this.state.panelOpen ? (
            <div className="stats-panel">
              <Tabs items={tabItems} uniqueId="stats-tabs" />
            </div>
          ) : null
        }
        onClick={this.handleStatsPanelClick}
      />
    );
  }

  sortLibraries() {
    let sorted = { production: [], testing: [], cancelled: [] };
    this.props.libraries &&
      this.props.libraries.forEach((l) => {
        if (Object.values(l.stages).some((v) => v === "cancelled")) {
          sorted.cancelled.push(l);
        } else if (Object.values(l.stages).some((v) => v === "testing")) {
          sorted.testing.push(l);
        } else {
          sorted.production.push(l);
        }
      });
    return sorted;
  }
}
