import * as React from "react";
import Fieldset from "./reusables/Fieldset";

export interface LibraryStageItemProps {
  label: string;
  value: string;
}
export default class LibraryStageItem extends React.Component<LibraryStageItemProps, {}> {
  render(): JSX.Element {
    const colors = {
      "testing": "warning",
      "production": "success",
      "cancelled": "danger"
    };

    let select = (
      <select key={this.props.label} name={this.props.label} defaultValue={this.props.value}>
        <option value="testing">Testing</option>
        <option value="production">Production</option>
        <option value="cancelled">Cancelled</option>
      </select>
    );

    return(
      <Fieldset
        legend={this.props.label}
        elements={[select]}
        badgeClass={colors[this.props.value]}
        badgeText={this.props.value}
      />
    );
  }
}
