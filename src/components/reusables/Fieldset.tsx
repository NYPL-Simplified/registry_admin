import * as React from "react";

export interface FieldsetProps {
  legend: string;
  elements: Array<JSX.Element>;
  badgeClass?: string;
  badgeText?: string;
}

export default class Fieldset extends React.Component<FieldsetProps, {}> {
  render(): JSX.Element {
    return(
      <fieldset className="form-group well">
        <legend>{this.props.legend}</legend>
        {this.props.elements}
        {
          this.props.badgeText &&
          <span className={`badge badge-${this.props.badgeClass || "default"}`}>{this.props.badgeText}</span>
        }
      </fieldset>
    );
  }
}
