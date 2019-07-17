import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import ContextProvider from "./components/ContextProvider";
import App from "./components/App";
import LogInForm from "./components/reusables/LogInForm";
import buildStore from "./store";

interface ConfigurationSettings {
  username?: string;
}

const store = buildStore();

/** The main admin interface application. Create an instance of this class
    to render the app and set up routing. */
class RegistryAdmin {
  constructor(config: ConfigurationSettings) {
    let div = document.createElement("div");
    div.id = "landing-page";
    document.getElementsByTagName("body")[0].appendChild(div);

    if (config["username"]) {
      ReactDOM.render(
        <ContextProvider {...config}>
          <Router history={browserHistory}>
            <Route path="/admin" component={App} />
          </Router>
        </ContextProvider>,
        document.getElementById("landing-page")
      );
    } else {
      ReactDOM.render(
        <ContextProvider {...config}>
          <LogInForm title="Library Registry Interface" store={store} />
        </ContextProvider>,
        document.getElementById("landing-page")
      );
    }
  }
}

export = RegistryAdmin;
