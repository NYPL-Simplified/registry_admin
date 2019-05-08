import { expect } from "chai";
import * as Enzyme from "enzyme";
import * as React from "react";
import Input from "../Input";

describe("Input", () => {
  let wrapper: Enzyme.ShallowWrapper<any, {}>;
  beforeEach(() => {
    wrapper = Enzyme.shallow(
      <Input label="A label" name="inputName"/>
    );
  });
  it("displays a label", () => {
    let label = wrapper.find("label");
    expect(label.length).to.equal(1);
    expect(label.text()).to.equal("A label");
    expect(label.prop("htmlFor")).to.equal("inputName");
  });
  it("displays an input field with a name and id", () => {
    let input = wrapper.find("input");
    expect(input.prop("name")).to.equal("inputName");
    expect(input.prop("id")).to.equal("inputName");
  });
  it("defaults to setting the input's type as text", () => {
    let input = wrapper.find("input");
    expect(input.prop("type")).to.equal("text");
  });
  it("optionally accepts a type prop", () => {
    wrapper = Enzyme.shallow(
      <Input label="Radio" name="radioInputName" type="radio" />
    );
    let input = wrapper.find("input");
    expect(input.prop("type")).to.equal("radio");
  });
});
