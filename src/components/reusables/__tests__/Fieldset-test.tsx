import { expect } from "chai";
import * as Enzyme from "enzyme";
import * as React from "react";
import Fieldset from "../Fieldset";

describe("Fieldset", () => {
  let wrapper: Enzyme.ShallowWrapper<any, {}>;
  let legend = "TEST_LEGEND";
  let input1 = <input value="A" />;
  let input2 = <input value="B" />;
  beforeEach(() => {
    wrapper = Enzyme.shallow(
      <Fieldset legend={legend} elements={[input1, input2]} />
    );
  });
  it("displays a legend", () => {
    let legend = wrapper.find("legend");
    expect(legend.length).to.equal(1);
    expect(legend.text()).to.equal("TEST_LEGEND");
  })
  it("displays elements", () => {
    let inputs = wrapper.find("input");
    expect(inputs.length).to.equal(2);
    expect(inputs.at(0).prop("value")).to.equal("A");
    expect(inputs.at(1).prop("value")).to.equal("B");
  });
  it("optionally displays a badge", () => {
    wrapper.setProps({ badgeText: "here's a badge!" });
    let badge = wrapper.find(".badge");
    expect(badge.length).to.equal(1);
    expect(badge.text()).to.equal("here's a badge!");
    expect(badge.hasClass("badge-default")).to.be.true;
  });
  it("optionally specifies a class for the badge", () => {
    wrapper.setProps({ badgeText: "Success!", badgeClass: "success" });
    let badge = wrapper.find(".badge");
    expect(badge.length).to.equal(1);
    expect(badge.text()).to.equal("Success!");
    expect(badge.hasClass("badge-success")).to.be.true;
  });
});
