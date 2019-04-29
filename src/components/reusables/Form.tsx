import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "library-simplified-reusable-components";
import Fieldset from "./Fieldset";

export interface FormProps {
  content?: Array<JSX.Element>;
  onSubmit: any;
  title?: string;
  hiddenName?: string;
  hiddenValue?: string;
  buttonContent?: string | JSX.Element;
  buttonClass?: string;
  className?: string;
  errorText?: string;
  successText?: string;
  infoText?: string;
  disableButton?: boolean;
}

export default class Form extends React.Component<FormProps, {}> {

  constructor(props: FormProps) {
    super(props);
    this.submit = this.submit.bind(this);
    this.message = this.message.bind(this);
  }

  componentDidUpdate() {
    if (this.refs["errorMessage"]) {
      (this.refs["errorMessage"] as HTMLElement).focus();
    }
  }

  submit(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    let form = (this.refs["form"] as any);
    const data = new (window as any).FormData(form);
    this.props.onSubmit(data);
  };

  message(text: string, type: string): JSX.Element {
    return (
      <p className={`alert alert-${type}`} role="alert" ref={`${type}Message`} tabIndex={-1}>
        {text}
      </p>
    );
  }

  render(): JSX.Element {
    return(
      <form ref="form" className={`clearfix${this.props.className ? " " + this.props.className : ""}`}>
        {
          this.props.errorText && this.message(this.props.errorText, "danger")
        }
        {
          this.props.successText && !this.props.errorText && this.message(this.props.successText, "success")
        }
        {
          this.props.infoText && this.message(this.props.infoText, "info")
        }
        { this.props.title &&
          <label className="form-title">{this.props.title}</label>
        }
        { this.props.hiddenName &&
          <input
            type="hidden"
            name={this.props.hiddenName}
            value={this.props.hiddenValue}
          />
        }
        { this.props.content }
        <br />
        <Button
          callback={this.submit}
          content={this.props.buttonContent && this.props.buttonContent}
          className={this.props.buttonClass && this.props.buttonClass}
          disabled={this.props.disableButton}
        />
      </form>
    );
  }
}
