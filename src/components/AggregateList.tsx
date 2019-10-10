import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";
import DropdownButton from "./DropdownButton";

export interface AggregateListProps {
  data: {[key: string]: LibraryData[]};
}

export interface AggregateListState {
  copied: boolean;
  styled: boolean;
  showConfirm: boolean;
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
      copied: false,
      styled: true,
      showConfirm: false,
      production: false,
      testing: false,
      cancelled: false
    };
    this.copy = this.copy.bind(this);
    this.toggleFormatting = this.toggleFormatting.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.hideConfirm = this.hideConfirm.bind(this);
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
      <Button
        key="copy"
        callback={this.copy}
        content={this.state.copied ? "Copy Data Again" : "Copy Data"}
        className={className}
      />
    ];
    return (
      <div className="list-view">
        <div className="buttons">
          { buttons }
          <span
            className={`copy-confirmation ${this.state.showConfirm ? "visible" : ""}`}
          >Copied to clipboard</span>
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

  copy() {
    let copyArea = this.statsRef.current;
    copyArea.focus();
    document.execCommand("selectAll");
    let copy = document.execCommand("copy");
    if (copy) {
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      copyArea.blur();
      this.setState({ copied: true, showConfirm: true });
      setTimeout(this.hideConfirm, 5000);
    }
  }

  hideConfirm() {
    this.setState({ showConfirm: false });
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
    let total = Object.values(this.props.data).map(x => (x as any).length).reduce((x, y) =>  x + y);
    let getPercentage = x => Math.round((x / total) * 100);
    let name = category.replace(category[0], category[0].toUpperCase());
    let length = this.props.data[category].length;
    return [
      <span key={name}>{name}: {length}</span>,
      <span key={`${name}-${length}`}> ({getPercentage(length)}%)</span>
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
