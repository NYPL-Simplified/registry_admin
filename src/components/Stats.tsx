import * as React from "react";
import { Panel, Tabs } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import AggregateList from "./AggregateList";
import Charts from "./Charts";

export interface StatsProps {
  libraries?: LibraryData[];
}

export default class Stats extends React.Component<StatsProps, {}> {
  constructor(props: StatsProps) {
    super(props);
    this.sortLibraries = this.sortLibraries.bind(this);
  };

  render(): JSX.Element {
    let sorted = this.sortLibraries();
    let tabItems = {
      "List": <AggregateList data={sorted} />,
      "Charts": <Charts data={sorted} />
    };

    return (
      <Panel
        id="stats"
        headerText={"Aggregate Data"}
        openByDefault={true}
        content={
          <div className="stats-panel">
            <Tabs items={tabItems} uniqueId="stats-tabs"/>
          </div>
        }
      />
    );
  }

  sortLibraries() {
    let sorted = {"production": [], "testing": [], "cancelled": []};
    this.props.libraries && this.props.libraries.forEach((l) => {
      if (Object.values(l.stages).some(v => v === "cancelled")) {
        sorted.cancelled.push(l);
      }
      else if (Object.values(l.stages).some(v => v === "testing")) {
        sorted.testing.push(l);
      }
      else {
        sorted.production.push(l);
      }
    });
    return sorted;
  }
}
