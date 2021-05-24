import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import DropdownButton from "./DropdownButton";
import CopyButton from "./CopyButton";
import { getPercentage } from "../utils/sharedFunctions";
import StatsInnerList from "./StatsInnerList";

export interface AggregateListProps {
  data: {[key: string]: LibraryData[]};
}

export interface AggregateListState {
  styled: boolean;
  production: boolean;
  testing: boolean;
  cancelled: boolean;
  geographicInfo: boolean;
}

export default class AggregateList extends React.Component<AggregateListProps, AggregateListState> {
  // This is the "List" tab in the Aggregate Data panel.
  private statsRef = React.createRef<HTMLElement>();
  STAGES = ["Production", "Testing", "Cancelled"];

  constructor(props: AggregateListProps) {
    super(props);
    this.state = {
      styled: true,
      production: false,
      testing: false,
      cancelled: false,
      geographicInfo: false
    };
    this.toggleFormatting = this.toggleFormatting.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.toggleGeographicInfo = this.toggleGeographicInfo.bind(this);
  }

  render(): JSX.Element {
    let className = "inline squared inverted left-align";
    let showOrHideAll: string = `${this.STAGES.every(x => this.state[x.toLowerCase()]) ? "Hide" : "Show"} All`;
    let showOrHideStage = (stage) => `${this.state[stage.toLowerCase()] ? "Hide" : "Show"} ${stage}`;
    let buttons = [
      <Button
        key="format"
        callback={this.toggleFormatting}
        content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
        className={className}
      />,
      <DropdownButton
        mainContent="Library Name Display"
        callback={(e) => { this.toggleExpanded(e); }}
        menuContent={
          [showOrHideAll].concat(this.STAGES.map(x => showOrHideStage(x)))
        }
        className={className}
        key="dropdown"
      />,
      <CopyButton key="copy-button" element={this.statsRef.current} />
    ];
    let geographicButton = (
      <Button
        key="geographicInfo"
        callback={this.toggleGeographicInfo}
        content={`${this.state.geographicInfo ? "Hide" : "Show"} Geographic Info`}
        className={className}
      />
    );
    // If any of the "Library Name Display" options have been selected, render the "Show Geographic Info" button.
    if (["production", "testing", "cancelled"].some(x => this.state[x])) {
      buttons.splice(2, 0, geographicButton);
    }
    return (
      <div className="list-view">
        <div className="buttons">
          { buttons }
        </div>
        <section
          className="stats-list"
          ref={this.statsRef}
          contentEditable
          suppressContentEditableWarning
        >
          <StatsInnerList
            data={this.props.data}
            styled={this.state.styled}
            stagesToShow={{
              production: this.state.production,
              testing: this.state.testing,
              cancelled: this.state.cancelled
            }}
            showGeographicInfo={this.state.geographicInfo}
          />
        </section>
      </div>
    );
  }

  toggleExpanded(e) {
    // Determining whether the elements in the Library Name Display dropdown should say "Show" or "Hide"
    let [verb, category] = e.target.textContent.toLowerCase().split(" ");
    let newState = {};
    let newValue = verb === "show";
    if (category === "all") {
      this.STAGES.map(x => newState[x.toLowerCase()] = newValue);
    } else {
      newState[category] = newValue;
    }
    this.setState({...this.state, ...newState});
  }

  toggleFormatting() {
    // Status of the Remove/Restore Formatting button--determines whether CSS styles are applied to the data
    this.setState({ styled: !this.state.styled });
  }

  toggleGeographicInfo() {
    this.setState({ geographicInfo: !this.state.geographicInfo });
  }
}
