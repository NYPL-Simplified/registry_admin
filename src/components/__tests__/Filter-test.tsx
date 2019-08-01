import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";

import Filter from "../Filter";

describe("Filter", () => {
  let wrapper;
  let filterKeys = {
    "key_1": false,
    "key_2": false,
    "key_3": true
  };
  let setFilter: Sinon.SinonStub;
  let flipFilter: Sinon.SinonStub;

  beforeEach(() => {
    setFilter = Sinon.stub();
    flipFilter = Sinon.stub();
    wrapper = Enzyme.mount(<Filter filterKeys={filterKeys} setFilter={setFilter} flipFilter={flipFilter} />);
  });

  it("renders a filters div", () => {
    let filters = wrapper.find(".filters");
    expect(filters.length).to.equal(1);
  });

  it("renders a title", () => {
    expect(wrapper.find("h3").text()).to.equal("Show items which have");
    wrapper.setProps({ title: "Filtering out things if they" });
    expect(wrapper.find("h3").text()).to.equal("Filtering out things if they have");
  });

  it("renders custom button text", () => {
    expect(wrapper.find("button").text()).to.equal("have");
    wrapper.setState({ flip: true });
    expect(wrapper.find("button").text()).to.equal("DO NOT have");
    wrapper.setProps({ buttonText: ["don't contain", "contain"] });
    expect(wrapper.find("button").text()).to.equal("don't contain");
    wrapper.setState({ flip: false });
    expect(wrapper.find("button").text()).to.equal("contain");
  });

  it("renders checkboxes", () => {
    let inputs = wrapper.find("ul > li > .filter-box");
    expect(inputs.length).to.equal(3);
    inputs.forEach((input, idx) => {
      let keyName = Object.keys(filterKeys)[idx];
      expect(input.prop("type")).to.equal("checkbox");
      expect(input.prop("name")).to.equal(keyName);
      expect(input.prop("label")).to.equal(keyName);
      expect(input.prop("checked")).to.equal(filterKeys[keyName]);
    });
  });

  it("optionally starts out flipped", () => {
    expect(wrapper.state()["flip"]).to.be.false;
    wrapper = Enzyme.mount(<Filter initialFlip={true} filterKeys={filterKeys} setFilter={setFilter} flipFilter={flipFilter} />);
    expect(wrapper.state()["flip"]).to.be.true;
  });

  it("calls setFilter", () => {
    expect(setFilter.callCount).to.equal(0);
    let box1 = wrapper.find(".filter-box").first().find("input");
    box1.simulate("change");
    expect(setFilter.callCount).to.equal(1);
    expect(setFilter.args[0][0]).to.equal("key_1");
  });

  it("calls flipFilter", () => {
    expect(flipFilter.callCount).to.equal(0);
    expect(wrapper.state("flip")).to.be.false;
    let flipButton = wrapper.find("button");
    flipButton.simulate("click");
    expect(flipFilter.callCount).to.equal(1);
    expect(wrapper.state("flip")).to.be.true;
    flipButton.simulate("click");
    expect(flipFilter.callCount).to.equal(2);
    expect(wrapper.state("flip")).to.be.false;
  });

  it("sets the class name", () => {
    let input = wrapper.find(".filter-box").first();
    expect(input.prop("className")).to.equal("filter-box");
    wrapper.setProps({ filterKeys: {...filterKeys, ...{key_1: true}}});
    input = wrapper.find(".filter-box").first();
    expect(input.prop("className")).to.equal("filter-box active");
    wrapper.setState({ flip: true });
    input = wrapper.find(".filter-box").first();
    expect(input.prop("className")).to.equal("filter-box active flipped");
  });

});
