import * as React from "react";
import Header from "./reusables/Header";
import LibrariesListContainer from "./LibrariesListContainer";

export default class App extends React.Component<{}, {}> {

  render(): JSX.Element {
    return(
      <div id="main-app-component">
        <Header text="Library Registry Interface" alt="SimplyE" imgSrc="./logo.png" logOut="/admin/log_out"/>
        <LibrariesListContainer />
      </div>
    );
  }
}
