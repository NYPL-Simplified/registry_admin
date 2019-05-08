import { expect } from "chai";

import * as React from "react";
import * as Enzyme from "enzyme";
import Header from "../reusables/Header";

describe("Header", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  beforeEach(() => {
    wrapper = Enzyme.mount(
      <Header text="Test Header!" logOut="logout_url"/>
    );
  });
  it("should render text", () => {
    let text = wrapper.find("span").at(0);
    expect(text.text()).to.equal("Test Header!");
  });
  it("should render a logout button", () => {
    let logout = wrapper.find(".navbar-btn");
    expect(logout.length).to.equal(1);
    expect(logout.find(".logoutIcon").length).to.equal(1);
    expect(logout.text()).to.contain("Log Out");
    expect((logout.props() as any).href).to.equal("logout_url");
  });
});
