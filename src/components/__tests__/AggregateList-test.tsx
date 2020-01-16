import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import AggregateList from "../AggregateList";
import DropdownButton from "../DropdownButton";
import CopyButton from "../CopyButton";
import StatsInnerList from "../StatsInnerList";

describe("AggregateList", () => {
  let wrapper;
  let data;
  let productionLibrary1 = modifyLibrary(testLibrary1, { "name": "Production Library 1", "registry_stage": "production" });
  let productionLibrary2 = modifyLibrary(productionLibrary1, { "uuid": "UUID2", "name": "Production Library 2" });

  beforeEach(() => {
    data = {
      "production": [productionLibrary1, productionLibrary2],
      "testing": [testLibrary1],
      "cancelled": [testLibrary2]
    };
    wrapper = Enzyme.mount(<AggregateList data={data} />);
  });
  let getNumber = (name, dataset) => {
    return dataset[name.toLowerCase()].length;
  };
  it("displays the StatsInnerList", () => {
    let list = wrapper.find(StatsInnerList);
    expect(list.length).to.equal(1);
    expect(list.prop("data")).to.equal(wrapper.prop("data"));
    expect(list.prop("styled")).to.be.true;
    expect(list.prop("stagesToShow")).to.eql({ production: false, testing: false, cancelled: false });
    expect(list.prop("showGeographicInfo")).to.be.false;
  });
  it("has a button to toggle the list of library names", () => {
    let list = wrapper.find(StatsInnerList);
    let stages = ["Production", "Testing", "Cancelled"];
    let nameLists = wrapper.find(".stats-category-list");
    expect(list.length).to.equal(1);
    expect(nameLists.length).to.equal(0);
    stages.forEach((x) => {
      expect(wrapper.state()[x.toLowerCase()]).to.be.false;
      expect(list.prop("stagesToShow")[x.toLowerCase()]).to.be.false;
    });

    let spyToggleExpanded = Sinon.spy(wrapper.instance(), "toggleExpanded");
    wrapper.setProps({ toggleExpanded: spyToggleExpanded });
    expect(spyToggleExpanded.callCount).to.equal(0);

    let dropdown = wrapper.find(DropdownButton);
    let mainButton = dropdown.find("button").at(0);
    expect(mainButton.text()).to.contain("Library Name Display");
    let menuOptions = dropdown.find(".dropdown-button-menu").find("li");
    expect(menuOptions.length).to.equal(4);
    menuOptions.forEach((x, idx) => expect(x.text()).to.equal(`Show ${["All"].concat(stages)[idx]}`));

    menuOptions.at(0).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(1);
    list = wrapper.find(StatsInnerList);
    nameLists = list.find(".stats-category-list");
    expect(nameLists.length).to.equal(3);
    stages.forEach((x) => {
      expect(wrapper.state()[x.toLowerCase()]).to.be.true;
      expect(list.prop("stagesToShow")[x.toLowerCase()]).to.be.true;
    });

    menuOptions.forEach((x, idx) => expect(x.text()).to.equal(`Hide ${["All"].concat(stages)[idx]}`));

    menuOptions.at(1).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(2);
    list = wrapper.find(StatsInnerList);
    nameLists = list.find(".stats-category-list");
    expect(nameLists.length).to.equal(2);
    expect(wrapper.state()["production"]).to.be.false;
    expect(list.prop("stagesToShow").production).to.be.false;
    expect(menuOptions.at(1).text()).to.equal("Show Production");
    expect(menuOptions.at(0).text()).to.equal("Show All");

    menuOptions.at(2).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(3);
    list = wrapper.find(StatsInnerList);
    nameLists = list.find(".stats-category-list");
    expect(nameLists.length).to.equal(1);
    expect(wrapper.state()["testing"]).to.be.false;
    expect(list.prop("stagesToShow").testing).to.be.false;
    expect(menuOptions.at(2).text()).to.equal("Show Testing");

    menuOptions.at(3).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(4);
    list = wrapper.find(StatsInnerList);
    nameLists = list.find(".stats-category-list");
    expect(nameLists.length).to.equal(0);
    expect(wrapper.state()["cancelled"]).to.be.false;
    expect(list.prop("stagesToShow").cancelled).to.be.false;
    expect(menuOptions.at(3).text()).to.equal("Show Cancelled");

    spyToggleExpanded.restore();
  });
  it("has a button to toggle the formatting", () => {
    wrapper.setState({ "production": true, "testing": true, "cancelled": true });
    expect(wrapper.state()["styled"]).to.be.true;
    let spyToggleFormatting = Sinon.spy(wrapper.instance(), "toggleFormatting");
    wrapper.setProps({ toggleFormatting: spyToggleFormatting });
    expect(spyToggleFormatting.callCount).to.equal(0);
    let list = wrapper.find(StatsInnerList);
    expect(list.prop("styled")).to.be.true;

    let button = wrapper.find(".list-view").find("button").at(0);
    expect(button.text()).to.equal("Remove Formatting");
    button.simulate("click");
    expect(spyToggleFormatting.callCount).to.equal(1);
    expect(wrapper.state()["styled"]).to.be.false;
    list = wrapper.find(StatsInnerList);
    expect(list.prop("styled")).to.be.false;
    button = wrapper.find(".list-view").find("button").at(0);
    expect(button.text()).to.equal("Restore Formatting");

    spyToggleFormatting.restore();
  });
  it("has a button to copy the data", () => {
    let copyButton = wrapper.find(CopyButton);
    expect(copyButton.length).to.equal(1);
  });
  it("has a button for toggling the display of geographic information", () => {
    // If all the library names are hidden, the button is not rendered.
    let buttons = wrapper.find("button");
    expect(buttons.length).to.equal(7);
    buttons.forEach(b => expect(b.text()).not.to.contain("Geographic Info"));
    let list = wrapper.find(StatsInnerList);
    expect(list.prop("showGeographicInfo")).to.be.false;
    // Showing any of the library names makes the button appear.
    wrapper.setState({ production: true });
    buttons = wrapper.find("button");
    expect(buttons.length).to.equal(8);
    let geographicInfoButton = wrapper.find("button").at(6);
    expect(geographicInfoButton.text()).to.equal("Show Geographic Info");
    wrapper.setState({ "geographicInfo": true });
    list = wrapper.find(StatsInnerList);
    expect(list.prop("showGeographicInfo")).to.be.true;
    expect(geographicInfoButton.text()).to.equal("Hide Geographic Info");

    wrapper.setState({ "production": false });
    buttons = wrapper.find("button");
    expect(buttons.length).to.equal(7);
    buttons.forEach(b => expect(b.text()).not.to.contain("Geographic Info"));
  });
});
