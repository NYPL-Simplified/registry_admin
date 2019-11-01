import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import DropdownButton from "./DropdownButton";
import CopyButton from "./CopyButton";
import { getPercentage } from "../utils/sharedFunctions";

export interface AggregateListProps {
  data: {[key: string]: LibraryData[]};
}

export interface AggregateListState {
  styled: boolean;
  production: boolean;
  testing: boolean;
  cancelled: boolean;
}

export default class AggregateList extends React.Component<AggregateListProps, AggregateListState> {
  private statsRef = React.createRef<HTMLUListElement>();
  STAGES = ["Production", "Testing", "Cancelled"];

  constructor(props: AggregateListProps) {
    super(props);
    this.state = {
      styled: true,
      production: false,
      testing: false,
      cancelled: false
    };
    this.toggleFormatting = this.toggleFormatting.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.makeLi = this.makeLi.bind(this);
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
    return (
      <div className="list-view">
        <div className="buttons">
          { buttons }
        </div>
        <ul
          className="stats-list"
          ref={this.statsRef}
          contentEditable
          suppressContentEditableWarning
        >
          { Object.keys(this.props.data).map(category => this.makeLi(category)) }
        </ul>
      </div>
    );
  }

  toggleExpanded(e) {
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
    this.setState({ styled: !this.state.styled });
  }

  makeCategoryBar(category: string): JSX.Element[] {
    let name = category.replace(category[0], category[0].toUpperCase());
    let length = this.props.data[category].length;
    return [
      <span key={name}>{name}: {length}</span>,
      <span key={`${name}-${length}`}> ({getPercentage(length, Object.values(this.props.data), true)})</span>
    ];
  }

  makeLibraryNameList(category: string): JSX.Element[] {
    let libraries = this.props.data[category];
    return libraries.map(l => <li className="inner-stats-item" key={l.uuid}><p>{l.basic_info.name}</p></li>);
  }

  makeLi(category: string): JSX.Element {
    let hasStyles = this.state.styled;
    return (
      <li key={category} className={hasStyles ? "stats-category" : ""}>
        <section className={hasStyles ? "stats-category-name" : ""}>
          { this.makeCategoryBar(category) }
        </section>
        {
          this.state[category] &&
          <ul className={`${hasStyles ? "inner-stats-list " : ""}`}>
            {this.makeLibraryNameList(category)}
          </ul>
        }
      </li>
    );
  }
}
