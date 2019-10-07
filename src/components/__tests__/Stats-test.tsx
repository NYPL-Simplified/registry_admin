import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import { Panel, Tabs } from "library-simplified-reusable-components";
import Stats from "../Stats";
import AggregateList from "../AggregateList";
import Charts from "../Charts";

describe("Stats", () => {
  let wrapper;
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
});
