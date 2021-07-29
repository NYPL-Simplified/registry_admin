import * as React from "react";
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
  panelOpen: boolean;
}

/**
 * A reusable class for generating a panel populated with toggles for each of a list of specified attributes
 */
export default class Filter extends React.Component<FilterProps, FilterState> {
  static defaultProps = {
    initialFlip: false,
  };

  constructor(props: FilterProps) {
    super(props);
    this.flip = this.flip.bind(this);
    this.state = { flip: this.props.initialFlip, panelOpen: false };
    this.applyFilter = this.applyFilter.bind(this);
    this.handleFilterPanelClick = this.handleFilterPanelClick.bind(this);
  }

  /**
   * applyFilter()
   * @param {string} name The name of the attribute being turned on or off.  This doesn't
   * affect whether we're filtering by the attribute's presence vs. by its absence; it just
   * determines whether the filter should take this attribute into account in the first place.
   */
  applyFilter(name: string) {
    this.props.setFilter(name);
  }

  /**
   * Toggle whether we're filtering via the specified attributes' presence vs. via their absence
   */
  flip() {
    this.setState({ flip: !this.state.flip });
    this.props.flipFilter();
  }

  handleFilterPanelClick() {
    this.setState((prevState) => ({
      ...prevState,
      panelOpen: !prevState.panelOpen,
    }));
  }

  render(): JSX.Element {
    let [flipped, unflipped] = this.props.buttonText || ["DO NOT have", "have"];
    let filterButton = (
      <Button
        className="inline inverted top-align"
        content={this.state.flip ? flipped : unflipped}
        callback={this.flip}
      />
    );
    let title = (
      <p>
        {this.props.title || "Show items which"} {filterButton}
      </p>
    );
    let filterNames = Object.keys(this.props.filterKeys);
    let filterInputs = filterNames.map((k) => {
      return (
        <li className="filter-box" key={k}>
          <label>{k}</label>
          <Toggle
            initialOn={this.props.filterKeys[k]}
            name={k}
            onToggle={() => this.applyFilter(k)}
          />
        </li>
      );
    });
    return (
      <Panel
        id="filters"
        headerText="Filters"
        content={
          this.state.panelOpen ? (
            <div className="filters">
              {title}
              <hr />
              <ul>{filterInputs}</ul>
            </div>
          ) : null
        }
        onClick={this.handleFilterPanelClick}
      />
    );
  }
}
