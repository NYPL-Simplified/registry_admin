import * as React from "react";
import { connect } from "react-redux";
import { Store } from "redux";
import { Form, Input } from "library-simplified-reusable-components";
import Fieldset from "./Fieldset";
import ActionCreator from "../../actions";
import { State } from "../../reducers/index";
import { FetchErrorData } from "opds-web-client/lib/interfaces";

export interface LogInFormStateProps {
  error?: FetchErrorData;
}

export interface LogInFormOwnProps {
  extraFields?: Array<JSX.Element>;
  title?: string;
  legend?: string;
  store?: Store<State>;
}

export interface LogInFormDispatchProps {
  logIn: (data: FormData) => Promise<void>;
}

export interface LogInFormProps extends LogInFormStateProps, LogInFormOwnProps, LogInFormDispatchProps {}

export class LogInForm extends React.Component<LogInFormProps, {}> {
  constructor(props: LogInFormProps) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(data: FormData): Promise<void> {
    await this.props.logIn(data);
    window.location.reload();
  }

  render(): JSX.Element {
    let title = this.props.title ? this.props.title : "Log In";
    let legend = this.props.legend ? this.props.legend : "Credentials";

    let username = <Input id="username" key="username" name="username" label="Username" />;
    let password = <Input id="password" key="password" type="password" name="password" label="Password" />;
    let elements = this.props.extraFields ? [username, password].concat(this.props.extraFields) : [username, password];
    let fieldset = <Fieldset key="credentials" legend={legend} elements={elements} />;
    return(
      <Form
        className="centered border logIn"
        title={title}
        content={[fieldset]}
        buttonContent="Submit"
        buttonClass="centered"
        onSubmit={this.submit}
        errorText={this.props.error && (this.props.error.response || "Invalid credentials")}
      />
    );
  }
}

function mapStateToProps(state: State, ownProps: LogInFormOwnProps) {
  return {
    error: state.admin.fetchError
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: LogInFormOwnProps) {
  let actions = new ActionCreator(null);
  return {
    logIn: (data: FormData) => dispatch(actions.logIn(data))
  };
}

const ConnectedLogInForm = connect<LogInFormStateProps, LogInFormDispatchProps, LogInFormOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LogInForm);

export default ConnectedLogInForm;
