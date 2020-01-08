import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import AggregateList from "../AggregateList";
import DropdownButton from "../DropdownButton";
import CopyButton from "../CopyButton";

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
  it("displays information for each category", () => {
    let categories = wrapper.find(".stats-category");
    expect(categories.length).to.equal(3);
    ["Production", "Testing", "Cancelled"].forEach((name, idx) => {
      let infoBar = categories.at(idx).find(".stats-category-name");
      expect(infoBar.find("span").at(0).text()).to.equal(`${name}: ${getNumber(name, data)}`);
      expect(infoBar.find("span").at(1).text()).to.equal(
        ` (${(getNumber(name, data) / 4 * 100)}%)`
      );
    });
  });
  it("rounds percentages to integers", () => {
    let newData = {...data, ...{"cancelled": []}};
    wrapper.setProps({ data: newData });
    let categories = wrapper.find(".stats-category");
    ["Production", "Testing", "Cancelled"].forEach((name, idx) => {
      let infoBar = categories.at(idx).find(".stats-category-name");
      expect(infoBar.find("span").at(0).text()).to.equal(`${name}: ${getNumber(name, newData)}`);
      expect(infoBar.find("span").at(1).text()).to.equal(
        ` (${Math.round((getNumber(name, newData) / 3) * 100)}%)`
      );
    });
  });
  it("optionally shows a list of library names under each category", () => {
    ["production", "testing", "cancelled"].forEach(x => expect(wrapper.state()[x]).to.be.false);
    let nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(0);
    wrapper.setState({ production: true, testing: true, cancelled: true });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(3);
    expect(nameLists.at(0).text()).to.contain("Production Library 1");
    expect(nameLists.at(0).text()).to.contain("Production Library 2");
    expect(nameLists.at(1).text()).to.contain("Test Library 1");
    expect(nameLists.at(2).text()).to.contain("Test Library 2");
  });
  it("has a button to toggle the list of library names", () => {
    let stages = ["Production", "Testing", "Cancelled"];
    let nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(0);
    stages.forEach(x => expect(wrapper.state()[x.toLowerCase()]).to.be.false);
    expect(wrapper.find(".stats-category-list").length).to.equal(0);
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
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(3);
    stages.forEach(x => expect(wrapper.state()[x.toLowerCase()]).to.be.true);
    menuOptions.forEach((x, idx) => expect(x.text()).to.equal(`Hide ${["All"].concat(stages)[idx]}`));

    menuOptions.at(1).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(2);
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(2);
    expect(wrapper.state()["production"]).to.be.false;
    expect(menuOptions.at(1).text()).to.equal("Show Production");
    expect(menuOptions.at(0).text()).to.equal("Show All");

    menuOptions.at(2).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(3);
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(1);
    expect(wrapper.state()["testing"]).to.be.false;
    expect(menuOptions.at(2).text()).to.equal("Show Testing");

    menuOptions.at(3).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(4);
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(0);
    expect(wrapper.state()["production"]).to.be.false;
    expect(menuOptions.at(3).text()).to.equal("Show Cancelled");

    spyToggleExpanded.restore();
  });
  it("has a button to toggle the formatting", () => {
    wrapper.setState({ "production": true, "testing": true, "cancelled": true });
    expect(wrapper.state()["styled"]).to.be.true;
    let spyToggleFormatting = Sinon.spy(wrapper.instance(), "toggleFormatting");
    wrapper.setProps({ toggleFormatting: spyToggleFormatting });
    expect(spyToggleFormatting.callCount).to.equal(0);
    let categoryListItems = wrapper.find(".stats-list").children();
    expect(categoryListItems.length).to.equal(3);
    categoryListItems.forEach((item) => {
      expect(item.hasClass("stats-category")).to.be.true;
      expect(item.find("section").hasClass("stats-category-name")).to.be.true;
      expect(item.find("ul").hasClass("stats-category-list")).to.be.true;
    });
    let button = wrapper.find(".list-view").find("button").at(0);
    expect(button.text()).to.equal("Remove Formatting");
    button.simulate("click");
    expect(spyToggleFormatting.callCount).to.equal(1);
    expect(wrapper.state()["styled"]).to.be.false;
    button = wrapper.find(".list-view").find("button").at(0);
    expect(button.text()).to.equal("Restore Formatting");
    categoryListItems = wrapper.find(".stats-list").children();
    expect(categoryListItems.length).to.equal(3);
    categoryListItems.forEach((item) => {
      expect(item.hasClass("stats-category")).to.be.false;
      expect(item.find("section").hasClass("stats-category-name")).to.be.false;
      expect(item.find("ul").hasClass("stats-category-list")).to.be.false;
    });
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
    // Showing any of the library names makes the button appear.
    wrapper.setState({ production: true });
    buttons = wrapper.find("button");
    expect(buttons.length).to.equal(8);
    let geographicInfoButton = wrapper.find("button").at(6);
    expect(geographicInfoButton.text()).to.equal("Show Geographic Info");
    wrapper.setState({ "geographicInfo": true });
    expect(geographicInfoButton.text()).to.equal("Hide Geographic Info");
    wrapper.setState({ "production": false });
    buttons = wrapper.find("button");
    expect(buttons.length).to.equal(7);
    buttons.forEach(b => expect(b.text()).not.to.contain("Geographic Info"));
  });
  it("optionally shows geographic information", () => {
    wrapper.setState({ "production": true, "testing": true, "cancelled": true });
    let nameLists = wrapper.find(".stats-category-list");
    expect(wrapper.state()["geographicInfo"]).to.be.false;
    expect(nameLists.at(0).text()).not.to.contain("(NY, ON, FL)");
    expect(nameLists.at(1).text()).not.to.contain("(NY, ON, FL)");
    expect(nameLists.at(2).text()).not.to.contain("(state unknown)");
    let geographicInfoButton = wrapper.find("button").at(6);
    expect(geographicInfoButton.text()).to.equal("Show Geographic Info");
    geographicInfoButton.simulate("click");
    expect(wrapper.state()["geographicInfo"]).to.be.true;
    expect(geographicInfoButton.text()).to.equal("Hide Geographic Info");
    expect(nameLists.at(0).text()).to.contain("(NY, ON, FL)");
    expect(nameLists.at(0).text()).to.contain("(NY, ON, FL)");
    expect(nameLists.at(1).text()).to.contain("(NY, ON, FL)");
    expect(nameLists.at(2).text()).to.contain("(state unknown)");
    geographicInfoButton.simulate("click");
    expect(wrapper.state()["geographicInfo"]).to.be.false;
    expect(geographicInfoButton.text()).to.equal("Show Geographic Info");
    expect(nameLists.at(0).text()).not.to.contain("(NY, ON, FL)");
    expect(nameLists.at(1).text()).not.to.contain("(NY, ON, FL)");
    expect(nameLists.at(2).text()).not.to.contain("(state unknown)");
  });
  it("generates a string based on the library's areas", () => {
    let info = (attr: {[index: string]: string[]}) =>
      wrapper.instance().getGeographicInfo(modifyLibrary(testLibrary1, attr));

    wrapper.setState({ geographicInfo: true });
    let empty = { focus: [], service: [] };
    let oneFocusArea = { focus: ["11104 (NY)"], service: [] };
    let multipleFocusAreas = { focus: ["11104 (NY)", "07670 (NJ)", "06750 (CT)"], service: [] };
    let oneServiceArea = { focus: [], service: ["11104 (NY)"] };
    let multipleServiceAreas = { focus: [], service: ["11104 (NY)", "07670 (NJ)", "06750 (CT)"] };
    let oneEach = { focus: ["11104 (NY)"], service: ["07670 (NJ)"] };
    let multiplesEach = { focus: ["11104 (NY)", "07670 (NJ)"], service: ["06750 (CT)", "02445 (MA)"] };
    let withDuplicates = { focus: ["06750 (CT)"], service: ["06039 (CT)"] };
    let oneUnknown = { focus: ["(unknown)"], service: ["11104 (NY)"] };
    let allUnknown = { focus: ["unknown"], service: ["unknown"] };

    expect(info(empty)).to.equal(" (state unknown)");
    expect(info(oneFocusArea)).to.equal(" (NY)");
    expect(info(multipleFocusAreas)).to.equal(" (NY, NJ, CT)");
    expect(info(oneServiceArea)).to.equal(" (NY)");
    expect(info(multipleServiceAreas)).to.equal(" (NY, NJ, CT)");
    expect(info(oneEach)).to.equal(" (NY, NJ)");
    expect(info(multiplesEach)).to.equal(" (NY, NJ, CT, MA)");
    expect(info(withDuplicates)).to.equal(" (CT)");
    expect(info(oneUnknown)).to.equal(" (NY)");
    expect(info(allUnknown)).to.equal(" (state unknown)");

    expect(wrapper.instance().getGeographicInfo(
      modifyLibrary(testLibrary2, { pls_id: "NY0778" }, "basic_info")
    )).to.equal(" (NY)");
  });
});
