import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { Button } from "library-simplified-reusable-components";
import CopyButton from "../CopyButton";

describe("CopyButton", () => {
  let wrapper;
  let element;
  beforeEach(() => {
    element = <span>Text to be copied</span>;
    wrapper = Enzyme.mount(<CopyButton element={element} />);
  });
  it("has a button to copy the specified text to the clipboard", () => {
    let copy = Sinon.stub(wrapper.instance(), "copy");
    wrapper.setProps({ copy });
    expect(wrapper.state()["copied"]).to.be.false;
    expect(copy.callCount).to.equal(0);
    let button = wrapper.find(Button);
    expect(button.text()).to.equal("Copy Data");
    button.simulate("click");
    expect(copy.callCount).to.equal(1);
    wrapper.setState({ copied: true });
    button = wrapper.find(Button);
    expect(button.text()).to.equal("Copy Data Again");
    copy.restore();
  });
  it("confirms that the text has been copied to the clipboard", () => {
    expect(wrapper.state()["showConfirm"]).to.be.false;
    let copyConfirm = wrapper.find(".copy-confirmation");
    expect(copyConfirm.length).to.equal(1);
    expect(copyConfirm.hasClass("visible")).to.be.false;
    wrapper.setState({ showConfirm: true });
    copyConfirm = wrapper.find(".copy-confirmation");
    expect(copyConfirm.length).to.equal(1);
    expect(copyConfirm.hasClass("visible")).to.be.true;
    expect(copyConfirm.text()).to.equal("Copied to clipboard");
    wrapper.instance().hideConfirm();
    wrapper.update();
    expect(wrapper.state()["showConfirm"]).to.be.false;
    copyConfirm = wrapper.find(".copy-confirmation");
    expect(copyConfirm.length).to.equal(1);
    expect(copyConfirm.hasClass("visible")).to.be.false;
  });
  it("optionally accepts a custom class name", () => {
    expect(wrapper.find(Button).prop("className")).to.equal("inline squared inverted left-align ");
    wrapper.setProps({ customClassName: "custom" });
    expect(wrapper.find(Button).prop("className")).to.equal("inline squared inverted left-align custom");
  });
  it("optionally accepts custom button text for before copying", () => {
    expect(wrapper.find(Button).text()).to.equal("Copy Data");
    wrapper.setProps({ customStartingText: "Click to copy!" });
    expect(wrapper.find(Button).text()).to.equal("Click to copy!");
  });
  it("optionally accepts custom button text for after copying", () => {
    wrapper.setState({ copied: true });
    expect(wrapper.find(Button).text()).to.equal("Copy Data Again");
    wrapper.setProps({ customCopiedText: "Re-copy!" });
    wrapper.setState({ copied: true });
    expect(wrapper.find(Button).text()).to.equal("Re-copy!");
  });
  it("optionally accepts a custom confirmation message", () => {
    wrapper.setState({ showConfirm: true });
    expect(wrapper.find(".copy-confirmation").text()).to.equal("Copied to clipboard");
    wrapper.setProps({ customConfirmText: "Success!" });
    wrapper.setState({ showConfirm: true });
    expect(wrapper.find(".copy-confirmation").text()).to.equal("Success!");
  });
});
