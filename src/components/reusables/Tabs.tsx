import * as React from "react";

export interface TabsProps {
  items: Object;
}

export interface TabsState {
  tab: string;
}

export default class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
    this.makeTabs = this.makeTabs.bind(this);
    this.state = { tab: Object.keys(this.props.items)[0] };
  }

  select(e) {
    this.setState({ tab: e.currentTarget.innerText });
  }

  makeTabs() {
    let navs = [];
    let content = [];
    Object.entries(this.props.items).map(item => {
      let hidden = item[0] === this.state.tab ? "" : "hidden";
      let current = item[0] === this.state.tab ? "current" : "";
      let navItem = (
        <li className={`tab-nav ${current}`}>
          <button key={item[0]} className="btn btn-default" onClick={this.select}>
            {item[0]}
          </button>
        </li>
      );
      navs.push(navItem);
      let contentItem = <section key={item[0]} className={`tab-content ${hidden}`}>{item[1]}</section>;
      content.push(contentItem);
    });
    return [navs, content];
  }

  render(): JSX.Element {
    let navs = this.makeTabs()[0];
    let content = this.makeTabs()[1];

    return (
      <section className="tabs">
        <ul className="tab-navs">
          {navs}
        </ul>
        {content}
      </section>
    );
  }
}
