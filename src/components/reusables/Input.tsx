import * as React from "react";

export interface InputProps {
  type?: string;
  name: string;
  label?: string;
  callback?: (e: any) => any;
}

export default class Input extends React.Component<InputProps, void> {
  render(): JSX.Element {
    return(
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input onChange={this.props.callback ? this.props.callback : null} ref="input" className="form-control" type={this.props.type || "text"} name={this.props.name} id={this.props.name} />
      </div>
    );
  };
}
