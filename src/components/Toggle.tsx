import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel, Button } from "library-simplified-reusable-components";
import { FilterIcon } from "@nypl/dgx-svg-icons";
import Form from "./reusables/Form";
import Input from "./reusables/Input";

export interface ToggleOwnProps {
  filter?: (filter: string | boolean) => void;
  initialPosition?: string;
}

export interface ToggleState {
  position: string;
  animate: boolean;
}

export default class Toggle extends React.Component<ToggleOwnProps, ToggleState> {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { position: "left", animate: false }
  }
  render(): JSX.Element {
    return (
      <form className="filter-box">
        <label className={this.state.position === "left" ? "active" : ""}>Production</label>
        <div className={`toggle`}>
          <button className={`slider slider-${this.state.position} ${this.state.animate && "animate-slider"}`} onClick={this.toggle} />
        </div>
        <label className={this.state.position === "right" ? "active" : ""}>QA</label>
      </form>
    )
  }

 toggle(e) {
   e.preventDefault();
   let position = this.state.position === "left" ? "right" : "left";
   this.props.filter(position);
   this.setState({ position, animate: true });
  }
}
