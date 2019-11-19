import * as React from "react";
import { Store } from "redux";
import buildStore from "../store";
import { State } from "../reducers/index";
import * as PropTypes from "prop-types";

interface ContextProps {
  username?: string;
}

/** Provides a redux store, configuration options, and a function to create URLs
    as context to admin interface pages. */
export default class ContextProvider extends React.Component<ContextProps, {}> {
  store: Store<State>;
  username: string;

  constructor(props) {
    super(props);
    this.store = buildStore();
    this.username = this.props.username;
  }

  static childContextTypes: React.ValidationMap<any> = {
    store: PropTypes.object.isRequired,
    username: PropTypes.string
  };

  getChildContext() {
    return {
      store: this.store,
      username: this.username
    };
  }

  render() {
    return React.Children.only(this.props.children) as JSX.Element;
  }
}
