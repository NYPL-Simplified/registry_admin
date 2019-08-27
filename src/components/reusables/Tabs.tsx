import * as React from "react";

export interface TabsProps {
  items: {
    [key: string]: JSX.Element;
  };
  uniqueId: string;
}

export interface TabsState {
  tab: number;
}

export default class Tabs extends React.Component<TabsProps, TabsState> {
  constructor(props: TabsProps) {
    super(props);
    this.select = this.select.bind(this);
    this.makeTabs = this.makeTabs.bind(this);
    this.state = { tab: 0 };
  }

  select(e:  React.KeyboardEvent<HTMLButtonElement> & React.MouseEvent<HTMLButtonElement>) {
    // The element's ID is in the form `button-{idx}-{uniqueId}`
    let idx = parseInt((e.currentTarget as HTMLElement).id.split("button-")[1]);
    if (e.keyCode) {
      // Keyboard navigation with arrow keys
      // idx is the index of the tab you're already on, that you're trying to navigate away from;
      // newIdx will be the index of the tab you're trying to go to.
      let newIdx: number;
      let tabs = Object.keys(this.props.items);
      if (e.keyCode === 39) {
        // Right arrow key: go to the next tab, or go back to the beginning if you were already on the last tab
        newIdx = idx < tabs.length - 1 ? idx + 1 : 0;
      }
      else if (e.keyCode === 37) {
        // Left arrow key: go to the previous tab, or go to the end if you were already on the first tab
        newIdx = idx === 0 ? tabs.length - 1 : idx - 1;
      }
      else {
        // If the user pressed something other than a right/left arrow key, ignore it.
        // Note: this does not interfere with the tab key's intended functionality.
        return;
      }
      this.setState({ tab: newIdx });
      // The focus is still on the original tab; manually update it to the new tab.
      (this.refs[newIdx] as HTMLElement).focus();
    }
    else {
      // Click
      // idx is the index of the tab you're trying to go to.
      this.setState({ tab: idx });
    }
  }

  makeTabs(): Array<Array<JSX.Element>> {
    let navs = [] as Array<JSX.Element>;
    let content = [] as Array<JSX.Element>;
    let items = Object.entries(this.props.items);

    items.map((item, idx) => {
      let [name, data] = item;
      let current = idx === this.state.tab;
      let idString = `${idx.toString()}-${this.props.uniqueId.split(" ").join("-")}`;

      let navItem = (
        <li key={name} role="presentation" className={`tab-nav ${current ? "current" : ""}`}>
          <button
            aria-controls={`panel-${idString}`}
            aria-selected={current}
            className="btn bottom-align left-align bottom-squared"
            id={`button-${idString}`}
            onClick={this.select}
            onKeyDown={this.select}
            role="tab"
            tabIndex={current ? 0 : -1}
            ref={`${idx}`}
          >
            {name}
          </button>
        </li>
      );

      navs.push(navItem);

      let contentItem = (
        <section
          aria-labelledby={`button-${idString}`}
          className={`tab-content ${current ? "" : "hidden"}`}
          id={`panel-${idString}`}
          key={name}
          role="tabpanel"
          tabIndex={0}
        >
          {data}
        </section>
      );

      content.push(contentItem);
    });
    return [navs, content];
  }

  render(): JSX.Element {
    let [navs, content] = this.makeTabs();
    return (
      <section className="tabs">
        <ul role="tablist" className="tab-navs">
          {navs}
        </ul>
        {content}
      </section>
    );
  }
}
