import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import AdobeTab from "../AdobeTab";
import CopyButton from "../CopyButton";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";

describe("AdobeTab", () => {
  let wrapper;
  let data;

  beforeEach(() => {
    data = [testLibrary1, testLibrary2, modifyLibrary(testLibrary1, { name: "Test Library 3", number_of_patrons: "2" })];
    wrapper = Enzyme.mount(<AdobeTab data={data} />);
  });

  it("renders the data", () => {
    let listItems = wrapper.find("li");
    expect(listItems.length).to.equal(3);
    expect(listItems.at(0).text()).to.equal("Test Library 1: 3 (50%)");
    expect(listItems.at(1).text()).to.equal("Test Library 2: 1 (17%)");
    expect(listItems.at(2).text()).to.equal("Test Library 3: 2 (33%)");
  });

  it("handles the case in which there are no patrons", () => {
    data = data.map(x => modifyLibrary(x, {number_of_patrons: "0"}));
    wrapper.setProps({ data });
    let listItems = wrapper.find("li");
    expect(listItems.length).to.equal(3);
    listItems.map((item, idx) => {
      expect(item.text()).to.equal(`Test Library ${idx + 1}: 0 (0%)`);
    });
  });

  it("renders a CopyButton", () => {
    let copyButton = wrapper.find(CopyButton);
    expect(copyButton.length).to.equal(1);
  });

  it("removes and restores the formatting", () => {
    let listItems = wrapper.find("li");
    listItems.map(l => expect(l.hasClass("adobe-data-li")).to.be.true);
    expect(wrapper.state()["styled"]).to.be.true;
    let formattingButton = wrapper.find("button").at(0);
    expect(formattingButton.text()).to.equal("Remove Formatting");
    formattingButton.simulate("click");
    listItems = wrapper.find("li");
    listItems.map(l => expect(l.hasClass("adobe-data-li")).to.be.false);
    expect(wrapper.state()["styled"]).to.be.false;
    expect(formattingButton.text()).to.equal("Restore Formatting");
  });
});
