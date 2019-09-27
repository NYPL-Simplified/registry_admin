import * as React from "react";
import { Panel, Button, Tabs } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import { ResponsiveContainer, PieChart, Pie, Sector, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export interface StatsProps {
  libraries?: LibraryData[];
}

export interface StatsState {
  expanded: boolean;
  copied: boolean;
  styled: boolean;
}

export default class Stats extends React.Component<StatsProps, StatsState> {
  private statsRef = React.createRef<any>();

  constructor(props: StatsProps) {
    super(props);
    this.renderListView = this.renderListView.bind(this);
    this.renderChartView = this.renderChartView.bind(this);
    this.copy = this.copy.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.toggleFormatting = this.toggleFormatting.bind(this);
    this.state = { expanded: false, copied: false, styled: true };
  };

  render(): JSX.Element {
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

    let tabItems = {
      "List": this.renderListView(sorted),
      "Charts": this.renderChartView(sorted)
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

  renderListView(sorted) {
    let buttons = [
      <Button
        key="copy"
        callback={this.copy}
        content={this.state.copied ? "Copy Again" : "Copy"}
        className={"inline squared inverted left-align"}
      />,
      <Button
        key="format"
        callback={this.toggleFormatting}
        content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
        className="inline squared inverted"
      />,
      <Button
        key="expand"
        callback={this.toggleExpanded}
        content={`${this.state.expanded ? "Hide" : "Show"} Library Names`}
        className="inline squared inverted"
      />
    ];
    return (
      <div className="list-view">
        { buttons }
        <ul
          className="stats-list"
          ref={this.statsRef}
          contentEditable
          suppressContentEditableWarning
        >
          {this.makeLis(sorted)}
        </ul>
      </div>
    );
  }


  renderChartView(sorted) {
    const colors = {
      "production": "#809F69",
      "testing": "#FFCD61",
      "cancelled": "#DA5D62"
    };
    let chartData = Object.keys(sorted).map((category) => {
      return { "name": category, "value": sorted[category].length };
    });

    return (
        <div className="chart-view">
          <ResponsiveContainer width={400} height={400}>
            <PieChart ref="pie-chart-svg">
              <Legend
                payload={ chartData.map(
                  item => ({
                    id: item.name,
                    type: "diamond",
                    value: item.name,
                    color: colors[item.name],
                  })
                )}
                layout="vertical"
                height={60}
                width={200}
                align="center"
                verticalAlign="bottom"
              />
              <Pie label data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width={400} height={400}>
            <BarChart ref="bar-chart-svg" width={400} height={400} data={chartData}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="name" interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" barSize={40} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  copy() {
    let copyArea = (this.statsRef.current as any);
    copyArea.focus();
    document.execCommand("selectAll");
    let copy = document.execCommand("copy");
    if (copy) {
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      copyArea.blur();
      this.setState({ copied: true });
    }
  }

  makeLis(sorted) {
    let total = Object.values(sorted).map(x => (x as any).length).reduce((x, y) => { return x + y; });
    let getPercentage = (x) => { return (x / total) * 100; };
    let withStyles = this.state.styled;
    let categoryInfo = (category) => {
      let name = category.replace(category[0], category[0].toUpperCase());
      let length = sorted[category].length;
      return [
        <span key={name}>{name}: {length}</span>,
        <span key={`${name}-${length}`}> ({getPercentage(length)}%)</span>
      ];
    };

    return Object.keys(sorted).map((category) => {
      return (
        <li key={category} className={withStyles ? "stats-category" : ""}>
          <section className={withStyles ? "stats-category-name" : ""}>
            { categoryInfo(category) }
          </section>
          <ul className={`${withStyles ? "inner-stats-list " : ""}${this.state.expanded ? "" : "hidden"}`}>
            {sorted[category].map((l) => {
              return <li className="inner-stats-item" key={l.uuid}><p>{l.basic_info.name}</p></li>;
            })}
          </ul>
        </li>
      );
    });
  }

  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  toggleFormatting() {
    this.setState({ styled: !this.state.styled });
  }

}
