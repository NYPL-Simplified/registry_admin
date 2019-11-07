import { expect } from "chai";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import Charts from "../Charts";
import { Sector, Rectangle } from "recharts";

describe("Charts", () => {
  let wrapper;
  let data;
  let productionLibrary1 = modifyLibrary(testLibrary1, { "name": "Production Library 1", "registry_stage": "production" });
  let productionLibrary2 = modifyLibrary(productionLibrary1, { "name": "Production Library 2" });
  beforeEach(() => {
    data = {
      "production": [productionLibrary1, productionLibrary2],
      "testing": [testLibrary1],
      "cancelled": [testLibrary2]
    };
    wrapper = Enzyme.mount(<Charts data={data} width={400} />);
  });
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
