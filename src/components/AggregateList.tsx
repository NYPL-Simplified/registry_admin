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
  geographicInfo: boolean;
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
      cancelled: false,
      geographicInfo: false
    };
    this.toggleFormatting = this.toggleFormatting.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.toggleGeographicInfo = this.toggleGeographicInfo.bind(this);
    this.getGeographicInfo = this.getGeographicInfo.bind(this);
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
    let geographicButton = (
      <Button
        key="geographicInfo"
        callback={this.toggleGeographicInfo}
        content={`${this.state.geographicInfo ? "Hide" : "Show"} Geographic Info`}
        className={className}
      />
    );
    if (["production", "testing", "cancelled"].some(x => this.state[x])) {
      buttons.splice(2, 0, geographicButton);
    }
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

  toggleGeographicInfo() {
    this.setState({ geographicInfo: !this.state.geographicInfo });
  }

  makeCategoryBar(category: string): JSX.Element[] {
    let name = category.replace(category[0], category[0].toUpperCase());
    let length = this.props.data[category].length;
    let allLengths = Object.values(this.props.data).map(x => x.length);
    return [
      <span key={name}>{name}: {length}</span>,
      <span key={`${name}-${length}`}> ({getPercentage(length, allLengths, true)})</span>
    ];
  }

  makeLibraryNameList(category: string): JSX.Element[] {
    let libraries = this.props.data[category];
    return libraries.map((l) => {
      return (
        <li className="inner-stats-item" key={l.uuid}><p>{l.basic_info.name}{this.getGeographicInfo(l.areas)}</p></li>
      );
    });
  }

  getGeographicInfo(areas: { [key: string]: string[] }): string {
    if (!this.state.geographicInfo) {
      return "";
    }
    let areaString: string = "";
    let allAreas: string[] = areas.focus.concat(areas.service);
    allAreas.forEach((a: string) => {
      // Each string is in the format "Zip code/city, (state abbreviation)".  We're just interested in the state abbreviation
      // right now, so we get it by pulling out any two-letter sequence between parentheses.
      // (If there's something longer than two letters between parentheses, it's the server-generated string "unknown",
      // which we don't need to add individually to areaString; if everything was unknown, we'll handle it later.)
      let regExp: RegExp = /\(([^)]{2})\)/;
      let match: string[] = regExp.exec(a);
      if (!match) {
        return "";
      }
      // If the library serves multiple towns/zip codes within the same state, and/or if the same state is listed in both the focus and the service areas,
       // we don't need to list the state more than once.
      // If there's already something in the areaString--i.e. if this item is not going to be the first
      // thing in it--then this should be separated by a comma and a space from whatever comes before it.
      if (!areaString.includes(match[1])) {
        areaString += `${areaString.length ? ", " : ""}${match[1]}`;
      }
    });
    return (areaString.length && ` (${areaString})`) || " (state unknown)";
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
