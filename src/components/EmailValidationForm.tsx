import * as React from "react";
import { Form } from "library-simplified-reusable-components";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import { FetchErrorData } from "opds-web-client/lib/interfaces";
import { Store } from "redux";
import { State } from "../reducers/index";
import { CheckSoloIcon, XIcon } from "@nypl/dgx-svg-icons";

export interface EmailValidationFormState {
  validated: boolean;
}

export interface EmailValidationFormOwnProps {
  email: string;
  libraryInfo: {};
  uuid: string;
  store: Store<State>;
}

export interface EmailValidationFormStateProps {
  error?: FetchErrorData;
}

export interface EmailValidationFormDispatchProps {
  validateEmail: (data: FormData) => Promise<void>;
}

export interface EmailValidationFormProps extends EmailValidationFormOwnProps, EmailValidationFormDispatchProps, EmailValidationFormStateProps {}

export class EmailValidationForm extends React.Component<EmailValidationFormProps, EmailValidationFormState> {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.renderInfoText = this.renderInfoText.bind(this);
    this.state = { validated: false };
  }

  convertEmailTitle(email: string): string {
    return (email.includes("_") ? email.replace("_", " ") : email.replace(" ", "_"));
  }

  renderTitle(emailString: string, emailAddress: string, alreadyValidated: boolean): JSX.Element[] {
    let titleString = `${emailString}${emailAddress ? ": " + emailAddress : ""}`;
    let icon = ((alreadyValidated || this.state.validated) && !this.props.error) ? <CheckSoloIcon /> : <XIcon />;
    return [<span>{titleString}</span>, icon];
  }

  async validate(email: string, data: FormData): Promise<void> {
    data.append("email", email);
    await this.props.validateEmail(data);
    this.setState({ validated: true });
  }

  renderInfoText(emailString: string, emailAddress: string, validated: string, alreadyValidated: boolean): string {
    if (!emailAddress) {
      return `No ${emailString} configured`;
    } else if (!alreadyValidated) {
      return "Not validated";
    } else if (!this.state.validated && !this.props.error) {
      return `Validated: ${validated}`;
    }
  }

  render(): JSX.Element {
    let emailString = this.convertEmailTitle(this.props.email);
    let emailAddress = this.props.libraryInfo[this.props.email];
    // libraryInfo has "contact_validated", "help_validated", and "copyright_validated" properties.
    let validated = this.props.libraryInfo[`${this.props.email.split("_")[0]}_validated`];
    let alreadyValidated = validated && (validated !== "Not validated");
    let successText = `Successfully validated ${emailAddress}`;
    return (
      <Form
        className="validation"
        hiddenName="uuid"
        hiddenValue={this.props.uuid}
        title={this.renderTitle(emailString, emailAddress, alreadyValidated)}
        onSubmit={(e) => this.validate(this.props.email, e)}
        buttonContent={`Validate ${emailString}${alreadyValidated ? " again" : ""}`}
        buttonClass={`left-align top-align ${this.state.validated && "success"}`}
        disableButton={!emailAddress}
        infoText={!this.state.validated &&  this.renderInfoText(emailString, emailAddress, validated, alreadyValidated)}
        errorText={this.props.error ? this.props.error.response : null}
        successText={this.state.validated ? successText : null}
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
