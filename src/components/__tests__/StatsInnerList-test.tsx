import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import { testLibrary1, testLibrary2, modifyLibrary, validate } from "./TestUtils";
import StatsInnerList from "../StatsInnerList";

describe("StatsInnerList", () => {
  let wrapper;
  let data;
  let productionLibrary1 = validate(modifyLibrary(testLibrary1, { "name": "Production Library 1", "registry_stage": "production" }));
  let productionLibrary2 = validate(modifyLibrary(productionLibrary1, { "uuid": "UUID2", "name": "Production Library 2" }));

  beforeEach(() => {
    data = {
      "production": [productionLibrary1, productionLibrary2],
      "testing": [validate(testLibrary1, testLibrary1.basic_info.timestamp)],
      "cancelled": [validate(testLibrary2, testLibrary2.basic_info.timestamp)]
    };
    wrapper = Enzyme.mount(<StatsInnerList data={data} styled={true} hasYear={true} />);
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
    ["Production", "Testing"].forEach((name, idx) => {
      let infoBar = categories.at(idx).find(".stats-category-name");
      expect(infoBar.find("span").at(0).text()).to.equal(`${name}: ${getNumber(name, newData)}`);
      expect(infoBar.find("span").at(1).text()).to.equal(
        ` (${Math.round((getNumber(name, newData) / 3) * 100)}%)`
      );
    });
  });
  it("optionally shows a list of library names under each category", () => {
    wrapper.setProps({ stagesToShow: {} });
    let nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(0);
    wrapper.setProps({ stagesToShow: { production: true } });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(1);
    expect(nameLists.at(0).text()).to.contain("Production Library 1");
    expect(nameLists.at(0).text()).to.contain("Production Library 2");
    wrapper.setProps({ stagesToShow: { production: true, testing: true } });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(2);
    expect(nameLists.at(1).text()).to.contain("Test Library 1");
    wrapper.setProps({ stagesToShow: { production: true, testing: true, cancelled: true } });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(3);
    expect(nameLists.at(2).text()).to.contain("Test Library 2");
    wrapper.setProps({ stagesToShow: { production: true, testing: true, cancelled: false } });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(2);
    expect(nameLists.at(1).text()).to.contain("Test Library 1");
    wrapper.setProps({ stagesToShow: { production: true, testing: false, cancelled: false } });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(1);
    expect(nameLists.at(0).text()).to.contain("Production Library 1");
    expect(nameLists.at(0).text()).to.contain("Production Library 2");
    wrapper.setProps({ stagesToShow: { production: false, testing: false, cancelled: false } });
    nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.length).to.equal(0);
  });
  it("removes and restores the formatting", () => {
    let categories = wrapper.find("ul").at(0).children().filter("li");
    expect(categories.length).to.equal(3);
    categories.forEach((c) => {
      expect(c.hasClass("stats-category")).to.be.true;
      expect(c.find("section").hasClass("stats-category-name")).to.be.true;
      expect(c.find("ul").hasClass("stats-category-list")).to.be.true;
    });
    wrapper.setProps({ styled: false });
    categories = wrapper.find("ul").at(0).children().filter("li");
    expect(categories.length).to.equal(3);
    categories.forEach((c) => {
      expect(c.hasClass("stats-category")).to.be.false;
      expect(c.find("section").hasClass("stats-category-name")).to.be.false;
      expect(c.find("ul").hasClass("stats-category-list")).to.be.false;
    });
  });
  it("optionally shows what month each library was added", () => {
    wrapper.setProps({ stagesToShow: {"production": true, "testing": true, "cancelled": true }});
    wrapper.setProps({ showMonths: true });
    wrapper.find(".inner-stats-item").forEach(l => {
      expect(new RegExp(/(November)/).test(l.text())).to.be.true;
    });
    wrapper.setProps({ showMonths: false });
    wrapper.find(".inner-stats-item").forEach(l => {
      expect(new RegExp(/(November)/).test(l.text())).to.be.false;
    });
  });
  it("estimates the year based on the timestamp, if the contact email has not been validated", () => {
    wrapper.setProps({ hasYear: false });
    let estYears = wrapper.find(".inner-stats-item");
    expect(new RegExp(/(No later than 2019)/).test(estYears.at(0).text())).to.be.true;
    expect(new RegExp(/(No later than 2019)/).test(estYears.at(1).text())).to.be.true;
    expect(new RegExp(/(No later than 2019)/).test(estYears.at(2).text())).to.be.true;
    expect(new RegExp(/(No later than 2018)/).test(estYears.at(3).text())).to.be.true;
  });
  it("optionally shows geographic information", () => {
    let nameLists = wrapper.find(".stats-category-list");
    expect(nameLists.at(0).text()).not.to.contain("(NY, ON, FL)");
    expect(nameLists.at(1).text()).not.to.contain("(NY, ON, FL)");
    expect(nameLists.at(2).text()).not.to.contain("(state unknown)");
    wrapper.setProps({ showGeographicInfo: true });
    expect(nameLists.at(0).text()).to.contain("(NY, ON, FL)");
    expect(nameLists.at(0).text()).to.contain("(NY, ON, FL)");
    expect(nameLists.at(1).text()).to.contain("(NY, ON, FL)");
    expect(nameLists.at(2).text()).to.contain("(state unknown)");
  });
  it("generates a string based on the library's areas", () => {
    let info = (attr: {[index: string]: string[]}) =>
      wrapper.instance().getGeographicInfo(modifyLibrary(testLibrary1, attr));

    wrapper.setProps({ showGeographicInfo: true });
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
