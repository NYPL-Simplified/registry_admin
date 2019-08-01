import * as React from "react";
import * as ReactDOM from "react-dom";
import Input from "./reusables/Input";
import Toggle from "./reusables/Toggle";
import { Button, Panel } from "library-simplified-reusable-components";

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
  static defaultProps = {
    initialFlip: false,
  };

  constructor(props: FilterProps) {
    super(props);
    this.flip = this.flip.bind(this);
    this.state = { flip: this.props.initialFlip };
    this.applyFilter = this.applyFilter.bind(this);
  }

  applyFilter(status: boolean, name: string) {
    this.props.setFilter(name);
  }

  flip() {
    this.setState({ flip: !this.state.flip });
    this.props.flipFilter();
  }

  render(): JSX.Element {
    let [flipped, unflipped] = this.props.buttonText || ["DO NOT have", "have"];
    let filterButton = <Button className="inline inverted top-align" content={this.state.flip ? flipped : unflipped} callback={this.flip} />;
    let title = <p>{this.props.title || "Show items which"} {filterButton}</p>;
    let filterNames = Object.keys(this.props.filterKeys);
    let filterInputs = filterNames.map((k) => {
      return (
        <li className="filter-box">
          <label>{k}
          </label>
          <Toggle
            initialOn={this.props.filterKeys[k]}
            name={k}
            onToggle={this.applyFilter}
          />
        </li>
      );
    });
    return (
      <Panel
        headerText="Filters"
        content={
          <div className="filters">
            {title}
            <hr/>
            <ul>{filterInputs}</ul>
          </div>
        }
      />
    );
  }
}
