import { expect } from "chai";
import * as Enzyme from "enzyme";
import * as React from "react";
import LibraryStageItem from "../LibraryStageItem";

describe("LibraryStageItem", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let label;
  let value;
  beforeEach(() => {
    label = "Registry Stage";
    value = "cancelled";
    wrapper = Enzyme.mount(
      <LibraryStageItem
        label={label}
        value={value}
      />
    );
  });
  it("should display a legend", () => {
    let legend = wrapper.find("legend");
    expect(legend.length).to.equal(1);
    expect(legend.text()).to.equal("Registry Stage");
  });
  it("should display a badge", () => {
    let badge = wrapper.find(".badge");
    expect(badge.length).to.equal(1);
    expect(badge.text()).to.equal("cancelled");
    expect(badge.hasClass("badge-danger")).to.be.true;
  });
  it("should display a dropdown", () => {
    let dropdown = wrapper.find("select") as any;
    expect(dropdown.length).to.equal(1);
    expect(dropdown.props().name).to.equal("Registry Stage");
    expect(dropdown.props().defaultValue).to.equal("cancelled");

    let options = dropdown.find("option");
    expect(options.length).to.equal(3);
    expect(options.at(0).html()).to.contain("Testing");
    expect(options.at(1).html()).to.contain("Production");
    expect(options.at(2).html()).to.contain("Cancelled");
  });
  it("should have an aria-label", () => {
    let select = wrapper.find("select");

    expect(select.prop("aria-label")).to.equal(`Select ${label}`);
  });
  it("should update when the value prop changes", () => {
    wrapper.setProps({ value: "production" });

    let badge = wrapper.find(".badge");
    expect(badge.text()).to.equal("production");
    expect(badge.hasClass("badge-success")).to.be.true;

    let dropdown = wrapper.find("select") as any;
    expect(dropdown.props().defaultValue).to.equal("production");
  });
});
