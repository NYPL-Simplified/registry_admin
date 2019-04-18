import * as React from "react";

export interface SubmitButtonProps {
  callback: (event: React.MouseEvent<HTMLButtonElement>) => void;
  content?: string | JSX.Element;
  className?: string;
  disabled?: boolean;
}

export default class SubmitButton extends React.Component<SubmitButtonProps, {}> {

  constructor(props: SubmitButtonProps) {
    super(props);
  }

  render(): JSX.Element {
   let content = this.props.content || "Submit";
   let className = this.props.className || "btn-default";
   return (
     <button
       type="submit"
       className={`btn ${className}`}
       onClick={this.props.callback}
       disabled={this.props.disabled || null}
    >{content}</button>
   );
 }

}
