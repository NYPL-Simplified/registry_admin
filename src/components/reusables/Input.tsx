import * as React from "react";

export interface InputProps {
  type?: string;
  name: string;
  label?: string;
  className?: string;
  callback?: (e: any) => any;
  value?: any;
}

export default class Input extends React.Component<InputProps, {}> {
  constructor(props: InputProps) {
    super(props);
  }
  render(): JSX.Element {
   return(
      <div className={`form-group ${this.props.className}`}>
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input
          onChange={this.props.callback ? this.props.callback : null}
          ref="input" className="form-control"
          type={this.props.type || "text"}
          name={this.props.name}
          id={this.props.name}
          defaultValue={this.props.value}
          readOnly={false}
          defaultChecked={this.props.type === "checkbox" && this.props.value}
        />
      </div>
    );
  };
}
