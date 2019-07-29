import * as React from "react";
import * as ReactDOM from "react-dom";
import Input from "./reusables/Input";
import { Button } from "library-simplified-reusable-components";

export interface FilterProps {
  setFilter: (filter: string) => void;
  filterKeys: { [key: string]: boolean };
  flipFilter: () => void;
  title?: string;
  buttonText?: string[];
  initialFlip?: boolean;
}

export interface FilterState {
  flip: boolean;
}

export default class Filter extends React.Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.flip = this.flip.bind(this);
    this.state = { flip: this.props.initialFlip || false };
  }

  applyFilter(e) {
    this.props.setFilter(e.currentTarget.name);
  }

  flip() {
    this.setState({ flip: !this.state.flip });
    this.props.flipFilter();
  }

  render(): JSX.Element {
    let [flipped, unflipped] = this.props.buttonText || ["DO NOT have", "have"];
    let filterButton = <Button className="inline inverted top-align" content={this.state.flip ? flipped : unflipped} callback={this.flip} />;
    let title = <h3>{this.props.title || "Show items which"} {filterButton}</h3>;
    let filterNames = Object.keys(this.props.filterKeys);
    let isActive = (k) => this.props.filterKeys[k] ? " active" : "";
    let isFlipped = this.state.flip ? " flipped" : "";
    let filterInputs = filterNames.map((k) => {
      return (
        <Input
          className={`filter-box${isActive(k)}${isFlipped}`}
          type="checkbox"
          key={k}
          name={k}
          value={this.props.filterKeys[k]}
          label={k}
          callback={(e) => this.applyFilter(e)}
        />
      );
    });
    return (
      <div className="filters">
        {title}
        <hr/>
        <ul>{filterInputs}</ul>
      </div>
    );
  }
}
