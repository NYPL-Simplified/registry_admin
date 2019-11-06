import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./components/ContextProvider";
import App from "./components/App";

interface ConfigurationSettings {
  username?: string;
  imgSrc?: string;
}

/** The main admin interface application. Create an instance of this class
    to render the app and set up routing. */
class RegistryAdmin {
  constructor(config: ConfigurationSettings) {
    let div = document.createElement("div");
    div.id = "landing-page";
    document.getElementsByTagName("body")[0].appendChild(div);

    // `react-axe` should only run in development and testing mode.
    // Running this is resource intensive and should only be used to test
    // for accessibility and not while active development.
    if (process.env.TEST_AXE === 'true') {
      let axe = require('react-axe');
      axe(React, ReactDOM, 1000);
    }

    ReactDOM.render(
      <ContextProvider {...config}>
        <BrowserRouter>
          <App imgSrc={config.imgSrc} />
        </BrowserRouter>
      </ContextProvider>,
      document.getElementById("landing-page")
    );
  }
}

export = RegistryAdmin;
