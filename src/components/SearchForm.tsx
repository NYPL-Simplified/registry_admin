import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel } from "library-simplified-reusable-components";
import { SearchIcon } from "@nypl/dgx-svg-icons";
import Form from "./reusables/Form";
import Input from "./reusables/Input";

export interface SearchFormOwnProps {
  search: (data: FormData) => void;
  text: string;
  inputName: string;
}

export interface SearchFormState {
  searchTerm: string;
}

export default class SearchForm extends React.Component<SearchFormOwnProps, SearchFormState> {
  constructor(props: SearchFormOwnProps) {
    super(props);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.state = { searchTerm: "" };
  }

  render(): JSX.Element {
    let form = (
      <Form
        onSubmit={this.props.search}
        content={<Input name={this.props.inputName} callback={this.updateSearchTerm} />}
        buttonContent={<span>Search <SearchIcon /></span>}
        className="inline"
        disableButton={!this.state.searchTerm.length}
      />
    );

    return(
      <Panel
        content={form}
        style="info"
        collapsible={false}
        headerText={this.props.text}
      />
    );
  }

  updateSearchTerm(e): void {
    this.setState({ searchTerm: e.target.value });
  }
}
