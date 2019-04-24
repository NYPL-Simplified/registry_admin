import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel } from "library-simplified-reusable-components";
import { SearchIcon } from "@nypl/dgx-svg-icons";
import Form from "./reusables/Form";
import Input from "./reusables/Input";

export interface SearchFormOwnProps {
  search: (data: FormData) => void;
  updateSearchTerm: (e: any) => void;
  disableButton: boolean;
  text: string;
  inputName: string;
}

export default class SearchForm extends React.Component<SearchFormOwnProps, void> {
  render(): JSX.Element {
    let form = (
      <Form
        onSubmit={this.props.search}
        content={<Input name={this.props.inputName} callback={this.props.updateSearchTerm}/>}
        buttonContent={<span>Search <SearchIcon /></span>}
        className="inline"
        disableButton={this.props.disableButton}
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
}
