import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import { GenericWedgeIcon } from "@nypl/dgx-svg-icons";

export interface DropdownButtonProps {
  mainContent: string | JSX.Element;
  menuContent: string[] | JSX.Element[];
  callback: (event: React.MouseEvent) => void | any;
  className?: string;
}

export interface DropdownButtonState {
  isOpen: boolean;
}

/** This is the dropdown menu used by AggregateList, MonthlyDataTab, and YearlyDataTab. */
export default class DropdownButton extends React.Component<DropdownButtonProps, DropdownButtonState> {

  constructor(props: DropdownButtonProps) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  render() {
    return (
      <div className={`btn dropdown-button-container ${this.props.className}`} onMouseEnter={() => { this.toggle(true); }} onMouseLeave={() => { this.toggle(false); }}>
        <Button
          content={[this.props.mainContent, <GenericWedgeIcon key="icon" className={`${this.state.isOpen ? "up" : "down"}-icon`}/>]}
          callback={() => { this.toggle(!this.state.isOpen); }}
          className={`${this.props.className} dropdown-button-main`}
          key="dropdown-button-main"
        />
        { this.renderMenu() }
      </div>
    );
  }

  /** Create the items in the dropdown by making a Button for each thing in the menuContent prop. */
  renderMenu() {
    let makeButton = (item => {
      return (
        <Button
          className={this.props.className}
          callback={this.props.callback}
          content={item}
        />
      );
    });
    return (
      <ul className={`dropdown-button-menu ${this.state.isOpen ? "" : "hidden"}`} key="dropdown-button-menu">
        { (this.props.menuContent as Array<string | JSX.Element>).map((item, idx) => {
            return (
              <li key={idx}>
                {makeButton(item)}
              </li>
            );
          })
         }
      </ul>
    );
  }

  /** Show/hide the dropdown on hover. */
  toggle(newValue: boolean) {
    this.setState({ isOpen: newValue });
  }
}
