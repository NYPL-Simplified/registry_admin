import * as React from "react";
import * as ReactDOM from "react-dom";

export interface ToggleOwnProps {
  onToggle: (status: boolean, name?: string) => void;
  initialOn?: boolean;
  label?: string;
  name?: string;
}

export interface ToggleState {
  on: boolean;
}

export default class Toggle extends React.Component<ToggleOwnProps, ToggleState> {
  static defaultProps = {
    name: "toggle"
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { on: this.props.initialOn || false };
  }

  componentWillReceiveProps(newProps: ToggleOwnProps) {
    this.setState({ on: newProps.initialOn });
  }

  render(): JSX.Element {
    let label = this.props.label ? `${this.props.label}: ${this.state.on ? "On" : "Off"}` : null;
    return (
      <form className="toggle-container">
        { label && <label className={this.state.on ? "active" : ""}><span>{label}</span></label> }
        <div className={`toggle${this.state.on ? " toggle-on" : ""}`}>
          <button tabIndex={0} className={`slider${this.state.on ? " slider-on" : ""}`} aria-pressed={this.state.on} onClick={this.toggle} />
        </div>
      </form>
    );
  }

 toggle(e) {
   e.preventDefault();
   let status = !this.state.on;
   this.props.onToggle(status, this.props.name);
   this.setState({ on: status });
  }
}
