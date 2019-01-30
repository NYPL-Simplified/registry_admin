import * as React from "react";
import { connect } from "react-redux";
import { Store } from "redux";
import Form from "./Form";
import Fieldset from "./Fieldset";
import Input from "./Input";
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
}

export interface LogInFormDispatchProps {
  logIn: (data: FormData) => Promise<void>;
}

export interface LogInFormContext {
  store: Store<State>;
}

export interface LogInFormProps extends LogInFormStateProps, LogInFormOwnProps, LogInFormDispatchProps {};

export class LogInForm extends React.Component<LogInFormProps, void> {

  context: LogInFormContext;
  static contextTypes: React.ValidationMap<LogInFormContext> = {
    store: React.PropTypes.object.isRequired
  };

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

    let username = <Input key="username" name="username" label="Username" />;
    let password = <Input key="password" type="password" name="password" label="Password" />;
    let elements = this.props.extraFields ? [username, password].concat(this.props.extraFields) : [username, password];
    let fieldset = <Fieldset key="credentials" legend={legend} elements={elements} />;
    return(
      <Form
        className="log-in"
        title={title}
        content={[fieldset]}
        buttonText="Log In"
        onSubmit={this.submit}
        errorText={this.props.error && (this.props.error.response || "Invalid credentials")}
      />
    );
  };
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

const ConnectedLogInForm = connect<{}, LogInFormDispatchProps, LogInFormOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LogInForm);

export default ConnectedLogInForm;