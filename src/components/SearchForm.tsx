import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel, Button, Form } from "library-simplified-reusable-components";
import { SearchIcon } from "@nypl/dgx-svg-icons";
import Input from "./reusables/Input";

export interface SearchFormOwnProps {
  search: (data: FormData) => void;
  text: string;
  inputName: string;
  clear?: () => any;
  term?: string;
  resultsCount?: number;
}

export interface SearchFormState {
  searchTerm: string;
}

export default class SearchForm extends React.Component<SearchFormOwnProps, SearchFormState> {
  constructor(props: SearchFormOwnProps) {
    super(props);
    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.clear = this.clear.bind(this);
    this.message = this.message.bind(this);
    this.state = { searchTerm: "" };
  }

  render(): JSX.Element {
    let input = (
      <Input
        id="search-input"
        key="search-input"
        name={this.props.inputName}
        callback={this.updateSearchTerm}
      />
    );

    let message = this.message();

    let form = (
      <Form
        key="form-component"
        ref="form-component"
        onSubmit={this.props.search}
        content={input}
        buttonContent={<span>Search <SearchIcon /></span>}
        className="search-form inline"
        disableButton={!this.state.searchTerm.length}
        successText={message["success"]}
        errorText={message["error"]}
      />
    );

    let clearButton = null;
    if (this.props.clear) {
      clearButton =
        <Button
          key="form-button"
          className="left-align inverted"
          callback={this.clear}
          content="Clear search"
        />;
    }

    return (
      <Panel
        id="search"
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

  clear(): void {
    this.props.clear();
    (this.refs["form-component"] as any).formRef.current.reset();
  }

  message(): {} {
    let message = {};
    if (!this.props.term) {
      return message;
    }
    if (this.props.resultsCount) {
      let resultsNumber = `${this.props.resultsCount} ${this.props.resultsCount > 1 ? "results" : "result"}`;
      message["success"] = `Displaying ${resultsNumber} for ${this.props.term}:`;
    } else {
      message["error"] = `No results found for ${this.props.term}.`;
    }
    return message;
  }
}
