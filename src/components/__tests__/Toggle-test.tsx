import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";

import Toggle from "../reusables/Toggle";

describe("Toggle", () => {
  let wrapper;
  let onToggle;
  beforeEach(() => {
    onToggle = Sinon.stub();
    wrapper = Enzyme.mount(
      <Toggle
        onToggle={onToggle}
        label="Filters"
      />
    );
  });

  let isOn = (status: boolean) => {
    expect(wrapper.state()["on"]).to.equal(status);
    let label = wrapper.find("label");
    expect(label.hasClass("active")).to.equal(status);
    let toggle = wrapper.find(".toggle");
    expect(toggle.hasClass("toggle-on")).to.equal(status);
    let slider = wrapper.find(".slider");
    expect(slider.hasClass("slider-on")).to.equal(status);
  };

  it("renders the toggle component", () => {
    let container = wrapper.find(".toggle-container");
    expect(container.length).to.equal(1);
    let label = container.find("label");
    expect(label.length).to.equal(1);
    let toggle = container.find(".toggle");
    expect(toggle.length).to.equal(1);
    let slider = toggle.find("button");
    expect(slider.length).to.equal(1);
    expect(slider.hasClass("slider")).to.be.true;
  });

  it("initially defaults to off", () => {
    isOn(false);
    wrapper = Enzyme.mount(<Toggle onToggle={onToggle} initialOn={true} label="Filters" />);
    isOn(true);
  });

  it("toggles", () => {
    expect(onToggle.callCount).to.equal(0);
    isOn(false);

    let slider = wrapper.find("button");
    slider.simulate("click");

    expect(onToggle.callCount).to.equal(1);
    expect(onToggle.args[0][0]).to.be.true;
    isOn(true);

    slider.simulate("click");

    expect(onToggle.callCount).to.equal(2);
    expect(onToggle.args[1][0]).to.be.false;
    isOn(false);
  });

  it("should have an aria-label", () => {
    let slider = wrapper.find("button");

    expect(slider.prop("aria-label")).to.equal("Toggle button");
  });
});
