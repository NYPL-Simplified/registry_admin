import * as React from "react";
import { Form } from "library-simplified-reusable-components";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import { FetchErrorData } from "opds-web-client/lib/interfaces";
import { Store } from "redux";
import { State } from "../reducers/index";
import { LibraryData } from "../interfaces";
import { CheckSoloIcon } from "@nypl/dgx-svg-icons";

export interface EmailValidationFormState {
  sent: boolean;
}

export interface EmailValidationFormOwnProps {
  library: LibraryData;
  store: Store<State>;
  fetchLibrary: (uuid: string) => LibraryData;
}

export interface EmailValidationFormDispatchProps {
  validateEmail: (data: FormData) => Promise<void>;
}

export interface EmailValidationFormStateProps {
  error?: FetchErrorData;
}

export interface EmailValidationFormProps extends EmailValidationFormOwnProps, EmailValidationFormDispatchProps, EmailValidationFormStateProps {}

export class EmailValidationForm extends React.Component<EmailValidationFormProps, EmailValidationFormState> {

  constructor(props) {
    super(props);
    this.sendEmail = this.sendEmail.bind(this);
    this.state = { sent: false };
  }

  async sendEmail(data: FormData): Promise<void> {
    await this.props.validateEmail(data);
    await this.props.fetchLibrary(this.props.library.uuid);
    this.setState({ sent: !this.props.error });
  }

  render(): JSX.Element {
    let icon = this.state.sent ? <CheckSoloIcon /> : null;
    let alreadyValidated = this.props.library.urls_and_contact.validated !== "Not validated";
    let hasEmail = !!this.props.library.urls_and_contact.contact_email;

    let buttonText = hasEmail ? "Validate email address" : "No email address configured";
    let buttonContent = <span>{buttonText}{icon}</span>;
    let infoText = (alreadyValidated && !this.state.sent && !this.props.error) ? "Already validated" : null;
    let successText = `Successfully validated ${this.props.library.urls_and_contact.contact_email}`;

    return (
        <Form
          className="validation"
          hiddenName="uuid"
          hiddenValue={this.props.library.uuid}
          title="Validation"
          onSubmit={this.sendEmail}
          buttonContent={buttonContent}
          buttonClass={`left-align top-align ${this.state.sent && "success"}`}
          disableButton={!hasEmail}
          infoText={infoText}
          errorText={this.props.error ? this.props.error.response : null}
          successText={this.state.sent ? successText : null}
        />
    );
  }
}

function mapStateToProps(state: State, ownProps: EmailValidationFormOwnProps) {
  return {
    error: state.validation && (state.validation.formError || state.validation.fetchError)
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: EmailValidationFormOwnProps) {
  let actions = new ActionCreator(null);
  return {
    validateEmail: (data: FormData) => dispatch(actions.validateEmail(data)),
  };
}

const ConnectedEmailValidationForm = connect<EmailValidationFormStateProps, EmailValidationFormDispatchProps, EmailValidationFormOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(EmailValidationForm);

export default ConnectedEmailValidationForm;
