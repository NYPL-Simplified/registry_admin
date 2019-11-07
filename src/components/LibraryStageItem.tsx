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
    const { label, value } = this.props;

    let select = (
      <select key={label} name={label} defaultValue={value} aria-label={`Select ${label}`}>
        <option value="testing" aria-selected={value === "testing"}>Testing</option>
        <option value="production" aria-selected={value === "production"}>Production</option>
        <option value="cancelled" aria-selected={value === "cancelled"}>Cancelled</option>
      </select>
    );

    return(
      <Fieldset
        legend={label}
        elements={[select]}
        badgeClass={colors[value]}
        badgeText={value}
      />
    );
  }
}
