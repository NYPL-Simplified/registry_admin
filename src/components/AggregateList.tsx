import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../interfaces";

export interface AggregateListProps {
  data: {[key: string]: LibraryData[]};
}

export interface AggregateListState {
  copied: boolean;
  expanded: boolean;
  styled: boolean;
  showConfirm: boolean;
}

export default class AggregateList extends React.Component<AggregateListProps, AggregateListState> {
  private statsRef = React.createRef<HTMLUListElement>();

  constructor(props: AggregateListProps) {
    super(props);
    this.state = {
      copied: false,
      expanded: false,
      styled: true,
      showConfirm: false
    };
    this.copy = this.copy.bind(this);
    this.toggleFormatting = this.toggleFormatting.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.hideConfirm = this.hideConfirm.bind(this);
    this.makeLi = this.makeLi.bind(this);
  }

  render(): JSX.Element {
    let className = "inline squared inverted left-align";
    let buttons = [
      <Button
        key="format"
        callback={this.toggleFormatting}
        content={`${this.state.styled ? "Remove" : "Restore"} Formatting`}
        className={className}
      />,
      <Button
        key="expand"
        callback={this.toggleExpanded}
        content={`${this.state.expanded ? "Hide" : "Show"} Library Names`}
        className={className}
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

  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
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
          this.state.expanded &&
          <ul className={`${hasStyles ? "inner-stats-list " : ""}`}>
            {this.makeLibraryNameList(category)}
          </ul>
        }
      </li>
    );
  }
}
