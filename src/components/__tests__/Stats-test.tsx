import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import { Panel, Button, Tabs } from "library-simplified-reusable-components";
import Stats from "../Stats";
import { Sector, Rectangle } from "recharts";

describe("Stats", () => {
  let wrapper;
  let libraries;
  let productionLibrary1 = modifyLibrary(testLibrary1, { "name": "Production Library 1", "registry_stage": "production" });
  let productionLibrary2 = modifyLibrary(productionLibrary1, { "name": "Production Library 2" });
  beforeEach(() => {
    wrapper = Enzyme.mount(<Stats libraries={[testLibrary1, testLibrary2, productionLibrary1, productionLibrary2]}/>);
  });

  it("renders a panel with a header and tabs", () => {
    let panel = wrapper.find(Panel);
    expect(panel.length).to.equal(1);
    expect(panel.prop("id")).to.equal("stats");
    expect(panel.prop("headerText")).to.equal("Aggregate Data");
    let tabs = panel.find(Tabs);
    expect(tabs.length).to.equal(1);
    expect(tabs.find(".tab-nav").at(0).text()).to.equal("List");
    expect(tabs.find(".tab-nav").at(1).text()).to.equal("Charts");
  });

  it("sorts a list of libraries by their status", () => {
    let sorted = wrapper.instance().sortLibraries();
    expect(sorted.production).to.eql([productionLibrary1, productionLibrary2]);
    expect(sorted.testing).to.eql([testLibrary1]);
    expect(sorted.cancelled).to.eql([testLibrary2]);
  });

  describe("List", () => {
    it("displays information for each category", () => {
      let categories = wrapper.find(".stats-category");
      expect(categories.length).to.equal(3);
      let getNumber = (name) => {
        return wrapper.instance().sortLibraries()[name.toLowerCase()].length;
      };
      ["Production", "Testing", "Cancelled"].forEach((name, idx) => {
        let infoBar = categories.at(idx).find(".stats-category-name");
        expect(infoBar.find("span").at(0).text()).to.equal(`${name}: ${getNumber(name)}`);
        expect(infoBar.find("span").at(1).text()).to.equal(
          ` (${(getNumber(name) / wrapper.prop("libraries").length * 100)}%)`
        );
      });
    });
    it("optionally shows a list of library names under each category", () => {
      expect(wrapper.state()["expanded"]).to.be.false;
      let nameLists = wrapper.find(".inner-stats-list");
      expect(nameLists.length).to.equal(3);
      nameLists.forEach(l => { expect(l.hasClass("hidden")).to.be.true; });
      wrapper.setState({ expanded: true });
      nameLists = wrapper.find(".inner-stats-list");
      expect(nameLists.length).to.equal(3);
      nameLists.forEach(l => { expect(l.hasClass("hidden")).to.be.false; });
      expect(nameLists.at(0).text()).to.contain("Production Library 1");
      expect(nameLists.at(0).text()).to.contain("Production Library 2");
      expect(nameLists.at(1).text()).to.contain("Test Library 1");
      expect(nameLists.at(2).text()).to.contain("Test Library 2");
    });
    it("has a button to toggle the list of library names", () => {
      expect(wrapper.state()["expanded"]).to.be.false;
      let spyToggleExpanded = Sinon.spy(wrapper.instance(), "toggleExpanded");
      wrapper.setProps({ toggleExpanded: spyToggleExpanded });
      expect(spyToggleExpanded.callCount).to.equal(0);
      let button = wrapper.find(".list-view").find("button").at(2);
      expect(button.text()).to.equal("Show Library Names");
      button.simulate("click");
      expect(wrapper.state()["expanded"]).to.be.true;
      expect(spyToggleExpanded.callCount).to.equal(1);
      expect(button.text()).to.equal("Hide Library Names");
      spyToggleExpanded.restore();
    });
    it("has a button to toggle the formatting", () => {
      expect(wrapper.state()["styled"]).to.be.true;
      let spyToggleFormatting = Sinon.spy(wrapper.instance(), "toggleFormatting");
      wrapper.setProps({ toggleFormatting: spyToggleFormatting });
      expect(spyToggleFormatting.callCount).to.equal(0);
      let categoryListItems = wrapper.find(".stats-list").children();
      expect(categoryListItems.length).to.equal(3);
      categoryListItems.forEach((item) => {
        expect(item.hasClass("stats-category")).to.be.true;
        expect(item.find("section").hasClass("stats-category-name")).to.be.true;
        expect(item.find("ul").hasClass("inner-stats-list")).to.be.true;
      });
      let button = wrapper.find(".list-view").find("button").at(1);
      expect(button.text()).to.equal("Remove Formatting");
      button.simulate("click");
      expect(spyToggleFormatting.callCount).to.equal(1);
      expect(wrapper.state()["styled"]).to.be.false;
      button = wrapper.find(".list-view").find("button").at(1);
      expect(button.text()).to.equal("Restore Formatting");
      categoryListItems = wrapper.find(".stats-list").children();
      expect(categoryListItems.length).to.equal(3);
      categoryListItems.forEach((item) => {
        expect(item.hasClass("stats-category")).to.be.false;
        expect(item.find("section").hasClass("stats-category-name")).to.be.false;
        expect(item.find("ul").hasClass("inner-stats-list")).to.be.false;
      });
      spyToggleFormatting.restore();
    });
    it("has a button to copy the data to the clipboard", () => {
      let copy = Sinon.stub(wrapper.instance(), "copy");
      wrapper.setProps({ copy });
      expect(wrapper.state()["copied"]).to.be.false;
      expect(copy.callCount).to.equal(0);
      let button = wrapper.find(".list-view").find("button").at(0);
      expect(button.text()).to.equal("Copy");
      button.simulate("click");
      expect(copy.callCount).to.equal(1);
      wrapper.setState({ copied: true });
      button = wrapper.find(".list-view").find("button").at(0);
      expect(button.text()).to.equal("Copy Again");
      copy.restore();
    });
  });

  describe("Charts", () => {
    it("renders a pie chart", () => {
      let pieChart = wrapper.find(".chart-view").children().at(0).find(".recharts-wrapper");
      let legend = pieChart.find(".recharts-legend-wrapper");
      let chartBody = pieChart.find(".recharts-pie");
      let legendItem = (x) => {
        return legend.find(".recharts-legend-item").at(x).find(".recharts-legend-item-text").text();
      };
      let sector = (x) => {
        let name = chartBody.find(Sector).at(x).prop("name");
        let value = chartBody.find(Sector).at(x).prop("value");
        return [name, value];
      };
      expect(legendItem(0)).to.equal("production");
      expect(legendItem(1)).to.equal("testing");
      expect(legendItem(2)).to.equal("cancelled");
      expect(sector(0)).to.eql(["production", 2]);
      expect(sector(1)).to.eql(["testing", 1]);
      expect(sector(2)).to.eql(["cancelled", 1]);
    });
    it("renders a bar chart", () => {
      let barChart = wrapper.find(".chart-view").children().at(1).find(".recharts-wrapper");
      let axisLabel = (x) => {
        return barChart.find(".recharts-cartesian-axis-tick-value").find("tspan").at(x).text();
      };
      let bar = (x) => {
        let name = barChart.find(Rectangle).at(x).prop("name");
        let value = barChart.find(Rectangle).at(x).prop("value");
        return [name, value];
      };
      expect(axisLabel(0)).to.equal("production");
      expect(axisLabel(1)).to.equal("testing");
      expect(axisLabel(2)).to.equal("cancelled");
      expect(bar(0)).to.eql(["production", 2]);
      expect(bar(1)).to.eql(["testing", 1]);
      expect(bar(2)).to.eql(["cancelled", 1]);
    });
  });
});
