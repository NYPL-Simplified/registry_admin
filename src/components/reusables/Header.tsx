import * as React from "react";
import { LogoutIcon } from "@nypl/dgx-svg-icons";
import { Button } from "library-simplified-reusable-components";

export interface HeaderProps {
  text?: string;
  imgSrc?: string;
  alt?: string;
  logOut?: string;
}

export default class Header extends React.Component<HeaderProps, void> {
  render(): JSX.Element {
    let src = this.props.imgSrc ? require(`${this.props.imgSrc}`) : "";
    return(
      <nav className="navbar navbar-default">
        <div className="navbar-header">
          <span>{this.props.text}</span>
          {
            this.props.imgSrc &&
            <img className="navbar-brand img-rounded" alt={this.props.alt || ""} src={src} />
          }
        </div>
        <Button
          className="navbar-btn"
          href={this.props.logOut}
          content={<span>Log Out<LogoutIcon /></span>}
        />
      </nav>
    );
  }
}
