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

export default class DropdownButton extends React.Component<DropdownButtonProps, DropdownButtonState> {
  constructor(props: DropdownButtonProps) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  render() {
    return (
      <div className={`btn dropdown-button-container ${this.props.className}`}>
        <Button
          content={[this.props.mainContent, <GenericWedgeIcon className={`${this.state.isOpen ? "up" : "down"}-icon`}/>]}
          callback={this.toggle}
          className={this.props.className + " dropdown-button-main"}
        />
        { this.state.isOpen && this.renderMenu() }
      </div>
    );
  }

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
      <ul className="dropdown-button-menu">
        { (this.props.menuContent as any).map(item => {
            return (
              <li key={item}>
                {makeButton(item)}
              </li>
            );
          })
         }
      </ul>
    );
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
}
