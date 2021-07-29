import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import { Panel, Tabs } from "library-simplified-reusable-components";
import Stats from "../Stats";
import AggregateList from "../AggregateList";
import Charts from "../Charts";
import AdobeTab from "../AdobeTab";
import YearlyDataTab from "../YearlyDataTab";
import MonthlyDataTab from "../MonthlyDataTab";

describe("Stats", () => {
  it("renders a panel with a header", () => {
    let wrapper;
    let productionLibrary1 = modifyLibrary(testLibrary1, {
      name: "Production Library 1",
      registry_stage: "production",
    });
    let productionLibrary2 = modifyLibrary(productionLibrary1, {
      name: "Production Library 2",
    });
    wrapper = Enzyme.mount(
      <Stats
        libraries={[
          testLibrary1,
          testLibrary2,
          productionLibrary1,
          productionLibrary2,
        ]}
      />
    );
    let panel = wrapper.find(Panel);
    expect(panel.length).to.equal(1);
    expect(panel.prop("id")).to.equal("stats");
    expect(panel.prop("headerText")).to.equal("Aggregate Data");
  });

  /*
  By default, Panel components are set to closed, and their content does not render until clicked.
  We need to manually trigger a click to open them and test the contents.
   */
  describe("Open", () => {
    let wrapper;
    let productionLibrary1 = modifyLibrary(testLibrary1, {
      name: "Production Library 1",
      registry_stage: "production",
    });
    let productionLibrary2 = modifyLibrary(productionLibrary1, {
      name: "Production Library 2",
    });
    beforeEach(() => {
      wrapper = Enzyme.mount(
        <Stats
          libraries={[
            testLibrary1,
            testLibrary2,
            productionLibrary1,
            productionLibrary2,
          ]}
        />
      );
      let panelToggle = wrapper.find("button.panel-heading");
      panelToggle.simulate("click");
    });

    it("renders tabs", () => {
      let panel = wrapper.find(Panel);
      let tabs = panel.find(Tabs);
      expect(tabs.length).to.equal(1);
      expect(tabs.find(".tab-nav").at(0).text()).to.equal("List");
      expect(tabs.find(".tab-nav").at(1).text()).to.equal("Charts");
      expect(tabs.find(".tab-nav").at(2).text()).to.equal("Adobe Data");
      expect(tabs.find(".tab-nav").at(3).text()).to.equal("Yearly Data");
      expect(tabs.find(".tab-nav").at(4).text()).to.equal("Monthly Data");
    });

    it("sorts a list of libraries by their status", () => {
      let sorted = wrapper.instance().sortLibraries();
      expect(sorted.production).to.eql([
        productionLibrary1,
        productionLibrary2,
      ]);
      expect(sorted.testing).to.eql([testLibrary1]);
      expect(sorted.cancelled).to.eql([testLibrary2]);
    });

    it("renders an AggregateList component", () => {
      let list = wrapper.find(AggregateList);
      expect(list.length).to.equal(1);
      expect(list.prop("data")).to.eql(wrapper.instance().sortLibraries());
    });

    it("renders a Charts component", () => {
      let charts = wrapper.find(Charts);
      expect(charts.length).to.equal(1);
      expect(charts.prop("data")).to.eql(wrapper.instance().sortLibraries());
    });

    it("renders an AdobeTab component", () => {
      let adobeTab = wrapper.find(AdobeTab);
      expect(adobeTab.length).to.equal(1);
    });

    it("renders a YearlyDataTab component", () => {
      let yearlyDataTab = wrapper.find(YearlyDataTab);
      expect(yearlyDataTab.length).to.equal(1);
    });

    it("renders a MonthlyDataTab component", () => {
      let monthlyDataTab = wrapper.find(MonthlyDataTab);
      expect(monthlyDataTab.length).to.equal(1);
    });

    it("removes content on close", () => {
      const panelToggle = wrapper.find("button.panel-heading");
      panelToggle.simulate("click");
      const panel = wrapper.find(Panel);
      const tabs = panel.find(Tabs);
      const list = wrapper.find(AggregateList);
      const charts = wrapper.find(Charts);
      expect(tabs.length).to.equal(0);
      expect(list.length).to.equal(0);
      expect(charts.length).to.equal(0);
    });
  });
});
