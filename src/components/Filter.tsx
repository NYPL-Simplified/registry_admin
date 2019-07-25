import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel, Button, Form } from "library-simplified-reusable-components";
import Input from "./reusables/Input";

export interface FilterProps {
  setFilter: (filters: { [key: string]: boolean }) => void;
  filterKeys: string[];
}

export interface FilterState {
  filters: { [key: string]: boolean };
}

export default class Filter extends React.Component<FilterProps, FilterState>{
  constructor(props: FilterProps) {
    super(props);
    this.state = { filters: {} };
    this.applyFilter = this.applyFilter.bind(this);
  }

  applyFilter(e) {
    let filterKey = e.currentTarget.name;
    let isChecked = e.currentTarget.checked;
    let filters = this.state.filters;
    filters[filterKey] = isChecked;
    this.setState({ filters: filters });
    this.props.setFilter(this.state.filters);
  }

  render(): JSX.Element {
    let filterInputs = this.props.filterKeys.map(k => <Input type="checkbox" name={k} value={k} label={k} callback={(e) => this.applyFilter(e)}/>);
    return <Panel openByDefault={true} headerText="Filters" content={filterInputs} />;
  }
}
