import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel, Button } from "library-simplified-reusable-components";
import { SearchIcon } from "@nypl/dgx-svg-icons";
import Form from "./reusables/Form";
import Input from "./reusables/Input";

export interface SearchFormOwnProps {
  search: (data: FormData) => void;
  text: string;
  inputName: string;
  clear?: () => any;
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

    let clearButton = null;
    if (this.props.clear) {
      clearButton = <Button className="inverted" callback={this.props.clear} content="Clear search" />;
    }

    return(
      <Panel
        content={[form, clearButton]}
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
