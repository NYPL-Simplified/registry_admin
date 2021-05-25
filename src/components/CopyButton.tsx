import * as React from "react";
import { Button } from "library-simplified-reusable-components";

export interface CopyButtonProps {
  element: HTMLElement;
  customStartingText?: string;
  customCopiedText?: string;
  customConfirmText?: string;
  customClassName?: string;
}

export interface CopyButtonState {
  copied: boolean;
  showConfirm: boolean;
}

/** The "Copy Data" button that appears at the top of all the Aggregate Data tabs other than "Charts" */
export default class CopyButton extends React.Component<CopyButtonProps, CopyButtonState> {
  constructor(props) {
    super(props);
    this.state = { copied: false, showConfirm: false };
    this.copy = this.copy.bind(this);
    this.hideConfirm = this.hideConfirm.bind(this);
  }

  render(): JSX.Element {
    // When the user clicks the button, the "Copied to clipboard" confirmation message should appear, and the button text should switch to saying "Copy Data Again".
    return (
      <div className="copy-button">
        <Button
          key="copy"
          callback={this.copy}
          content={this.state.copied ? (this.props.customCopiedText || "Copy Data Again") : (this.props.customStartingText || "Copy Data")}
          className={"inline squared inverted left-align " + (this.props.customClassName || "")}
        />
        <span
          className={`copy-confirmation ${this.state.showConfirm ? "visible" : ""}`}
        >{this.props.customConfirmText || "Copied to clipboard"}</span>
      </div>
    );
  }

  copy() {
    // Other than the last two lines, this is just boilerplate.
    let copyArea = this.props.element;
    copyArea.focus();
    document.execCommand("selectAll");
    let copy = document.execCommand("copy");
    if (copy) {
      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      copyArea.blur();
      this.setState({ copied: true, showConfirm: true });
      setTimeout(this.hideConfirm, 5000);
    }
  }

  /** The "Copied to clipboard" confirmation message disappears after 5 seconds. */
  hideConfirm() {
    this.setState({ showConfirm: false });
  }

}
