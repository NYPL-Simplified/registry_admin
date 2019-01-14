import * as React from "react";
import { connect } from "react-redux";
import { Store } from "redux";
import { AdminData } from "../../interfaces";
import Form from "./Form";
import Fieldset from "./Fieldset";
import Input from "./Input";
import ActionCreator from "../../actions";
import { State } from "../../reducers/index";

export interface LogInFormStateProps {
  admin?: AdminData;
}

export interface LogInFormDispatchProps {
  logIn: (data: FormData) => Promise<void>;
}

export interface LogInFormContext {
  store: Store<State>;
}

export interface LogInFormProps extends LogInFormStateProps, LogInFormDispatchProps {}

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
    let username = <Input key="username" name="username" label="Username" />;
    let password = <Input key="password" type="password" name="password" label="Password" />;
    let fieldset = <Fieldset key="credentials" legend="Credentials" elements={[username, password]} />;
    return(
      <Form title="Library Registry Interface" content={[fieldset]} buttonText="Log In" onSubmit={this.submit}/>
    );
  };
}

function mapStateToProps(state: State, ownProps: LogInFormProps) {
  return {
    admin: state.admin && state.admin.data
  };
}

function mapDispatchToProps(dispatch: Function, ownProps: LogInFormProps) {
  let actions = new ActionCreator(null, null);
  return {
    logIn: (data: FormData) => dispatch(actions.logIn(data))
  };
}

const ConnectedLogInForm = connect<LogInFormStateProps, LogInFormDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(LogInForm);

export default ConnectedLogInForm;