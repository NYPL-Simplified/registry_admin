import * as React from "react";
import { Store } from "redux";
import { State } from "../reducers/index";
import { LibraryData } from "../interfaces";
import EmailValidationForm from "./EmailValidationForm";

export interface EmailValidationSectionProps {
  library: LibraryData;
  store: Store<State>;
}

export default class EmailValidationSection extends React.Component<EmailValidationSectionProps, {}> {
  render(): JSX.Element {
    let emailForms = ["contact", "help", "copyright"].map((x) =>
      <li className="well">
        <EmailValidationForm
          store={this.props.store}
          uuid={this.props.library.uuid}
          email={`${x}_email`}
          libraryInfo={this.props.library.urls_and_contact}
        />
      </li>
    );
    return (
      <section className="validations">
        <ul>{emailForms}</ul>
      </section>
    );
  }
}
