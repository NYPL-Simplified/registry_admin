import * as React from "react";
import { Header } from "library-simplified-reusable-components";
import LibrariesPage from "./LibrariesPage";
import { Route } from "react-router-dom";
import LogInForm from "./reusables/LogInForm";
import { Store } from "redux";
import { State } from "../reducers/index";
import * as PropTypes from "prop-types";

export interface AppContext {
  store: Store<State>;
  username: string;
}

interface AppProps {
  imgSrc?: string;
}

export default class App extends React.Component<AppProps, {}> {
  static defaultProps = {
    imgSrc: "./logo.png"
  };

  context: AppContext;
  static contextTypes: React.ValidationMap<AppContext> = {
    store: PropTypes.object.isRequired as React.Validator<Store>,
    username: PropTypes.string
  };

  render(): JSX.Element {
    const { username, store } = this.context;
    // The app renders either the LogInForm or the LibrariesPage, depending on whether the user is logged in.
    return (
      <div id="main-app-component">
        <Header
          text="Library Registry Interface"
          alt="SimplyE"
          imgSrc={this.props.imgSrc}
          logOut="/admin/log_out"
          loggedIn={!!username}
        />
        <main>
          <Route
            path="/admin"
            render={() => (
              username ?
                <LibrariesPage store={this.context.store} /> :
                <LogInForm store={store} />
            )}
          />
        </main>
      </div>
    );
  }
}
