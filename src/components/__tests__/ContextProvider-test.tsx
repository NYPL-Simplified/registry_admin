import { expect } from "chai";
import * as Enzyme from "enzyme";
import * as React from "react";

import ContextProvider from "../ContextProvider";
class FakeChild extends React.Component<any, any> {}

describe("ContextProvider", () => {
  const username = "some username";
  let wrapper: Enzyme.ShallowWrapper<any, {}>;

  beforeEach(() => {
    wrapper = Enzyme.shallow(
      <ContextProvider username={username}>
        <FakeChild />
      </ContextProvider>
    );
  });

  it("provides child context", () => {
    let instance = wrapper.instance() as any;
    let context = instance.getChildContext();
    expect(context.store.getState().libraries).to.be.ok;
    expect(context.store.getState().library).to.be.ok;
    expect(context.username).to.equal(username);
  });

  it("renders child", () => {
    let children = wrapper.find(FakeChild);
    expect(children.length).to.equal(1);
  });

});
