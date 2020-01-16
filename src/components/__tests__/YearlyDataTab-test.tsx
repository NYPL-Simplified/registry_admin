import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import YearlyDataTab from "../YearlyDataTab";
import CopyButton from "../CopyButton";
import StatsInnerList from "../StatsInnerList";
import DropdownButton from "../DropdownButton";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";

describe("YearlyDataTab", () => {
  let data;
  let wrapper;
  beforeEach(() => {
    let productionLibrary1 = modifyLibrary(testLibrary1, { "name": "Production Library 1", "registry_stage": "production" });
    let productionLibrary2 = modifyLibrary(productionLibrary1, { "name": "Production Library 2", "timestamp": "Fri, 01 Nov 2018 15:05:34 GMT" });
    let testLibrary2 = modifyLibrary(testLibrary1, { "name": "Test Library 2", "timestamp": "Fri, 01 Nov 2017 15:05:34 GMT"});
    data = {
      "production": [productionLibrary1, productionLibrary2],
      "testing": [testLibrary1, testLibrary2],
      "cancelled": []
    };
    wrapper = Enzyme.mount(<YearlyDataTab data={data} />);
  });
  it("renders a list of years", () => {
    let years = wrapper.find(".year-li");
    expect(years.length).to.equal(3);

    let y2017 = years.at(0);
    expect(y2017.find(".header-bar").find("span").at(0).text()).to.equal("2017: 1 library added");
    expect(y2017.find(".header-bar").find("span").at(1).text()).to.equal("(25%)");

    let y2018 = years.at(1);
    expect(y2018.find(".header-bar").find("span").at(0).text()).to.equal("2018: 1 library added");
    expect(y2018.find(".header-bar").find("span").at(1).text()).to.equal("(25%)");

    let y2019 = years.at(2);
    expect(y2019.find(".header-bar").find("span").at(0).text()).to.equal("2019: 2 libraries added");
    expect(y2019.find(".header-bar").find("span").at(1).text()).to.equal("(50%)");
  });
  it("optionally renders a StatsInnerList for each year", async () => {
    let yearNames = ["2017", "2018", "2019"];

    let years = wrapper.find(".year-li");
    expect(years.length).to.equal(3);

    let innerLists = wrapper.find(StatsInnerList);
    expect(innerLists.length).to.equal(0);

    await wrapper.setProps({ data });
    expect(wrapper.state().yearsToShow).to.eql({ "2017": false, "2018": false, "2019": false });

    let spyToggleExpanded = Sinon.spy(wrapper.instance(), "toggleExpanded");
    wrapper.setProps({ toggleExpanded: spyToggleExpanded });
    expect(spyToggleExpanded.callCount).to.equal(0);

    let dropdown = wrapper.find(DropdownButton);
    expect(dropdown.length).to.equal(1);
    let mainButton = dropdown.find("button").at(0);
    expect(mainButton.text()).to.contain("Year Display");
    let menuOptions = dropdown.find(".dropdown-button-menu").find("li");
    expect(menuOptions.length).to.equal(4);
    menuOptions.forEach((x, idx) => expect(x.text()).to.equal(`Show ${["All"].concat(yearNames)[idx]}`));

    menuOptions.at(0).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(1);
    expect(wrapper.state().yearsToShow).to.eql({ "2017": true, "2018": true, "2019": true });

    innerLists = wrapper.find(StatsInnerList);
    expect(innerLists.length).to.equal(3);
    menuOptions.forEach((x, idx) => expect(x.text()).to.equal(`Hide ${["All"].concat(yearNames)[idx]}`));

    let hasCategories = (year) => {
      let stages = ["Production", "Testing", "Cancelled"];
      year.find(".stats-category-name").forEach((name, idx) => {
        expect(name.text()).to.contain(stages[idx]);
      });
    };

    years = wrapper.find(".year-li");
    let y2017 = years.at(0);
    let categories = y2017.find(StatsInnerList).find("ul").at(0).children("li");
    hasCategories(y2017);
    let production = categories.at(0);
    expect(production.find(".stats-category-list").find("li").length).to.equal(0);
    let testing = categories.at(1);
    expect(testing.find(".stats-category-list").find("li").length).to.equal(1);
    expect(testing.find(".stats-category-list").find("li").text()).to.equal("Test Library 2");
    let cancelled = categories.at(2);
    expect(production.find(".stats-category-list").find("li").length).to.equal(0);

    let y2018 = years.at(1);
    categories = y2018.find(StatsInnerList).find("ul").at(0).children("li");
    hasCategories(y2018);
    production = categories.at(0);
    expect(production.find(".stats-category-list").find("li").length).to.equal(1);
    expect(production.find(".stats-category-list").find("li").text()).to.equal("Production Library 2");
    testing = categories.at(1);
    expect(testing.find(".stats-category-list").find("li").length).to.equal(0);
    cancelled = categories.at(2);
    expect(cancelled.find(".stats-category-list").find("li").length).to.equal(0);

    let y2019 = years.at(2);
    categories = y2019.find(StatsInnerList).find("ul").at(0).children("li");
    hasCategories(y2019);
    production = categories.at(0);
    expect(production.find(".stats-category-list").find("li").length).to.equal(1);
    expect(production.find(".stats-category-list").find("li").text()).to.equal("Production Library 1");
    testing = categories.at(1);
    expect(testing.find(".stats-category-list").find("li").length).to.equal(1);
    expect(testing.find(".stats-category-list").find("li").text()).to.equal("Test Library 1");
    cancelled = categories.at(2);
    expect(cancelled.find(".stats-category-list").find("li").length).to.equal(0);

    menuOptions.at(1).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(2);
    innerLists = wrapper.find(StatsInnerList);
    expect(innerLists.length).to.equal(2);
    expect(wrapper.state()["yearsToShow"]).to.eql({ "2017": false, "2018": true, "2019": true });
    expect(menuOptions.at(1).text()).to.equal("Show 2017");
    expect(menuOptions.at(0).text()).to.equal("Show All");

    menuOptions.at(2).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(3);
    innerLists = wrapper.find(StatsInnerList);
    expect(innerLists.length).to.equal(1);
    expect(wrapper.state()["yearsToShow"]).to.eql({ "2017": false, "2018": false, "2019": true });
    expect(menuOptions.at(2).text()).to.equal("Show 2018");
    expect(menuOptions.at(0).text()).to.equal("Show All");

    menuOptions.at(3).find("button").simulate("click");
    expect(spyToggleExpanded.callCount).to.equal(4);
    innerLists = wrapper.find(StatsInnerList);
    expect(innerLists.length).to.equal(0);
    expect(wrapper.state()["yearsToShow"]).to.eql({ "2017": false, "2018": false, "2019": false });
    expect(menuOptions.at(3).text()).to.equal("Show 2019");
    expect(menuOptions.at(0).text()).to.equal("Show All");

    spyToggleExpanded.restore();
  });

  it("renders a CopyButton", () => {
    let copyButton = wrapper.find(CopyButton);
    expect(copyButton.length).to.equal(1);
  });

  it("removes and restores the formatting", () => {
    wrapper.setState({ yearsToShow: { "2017": true, "2018": true, "2019": true }});
    let years = wrapper.find(".year-li");
    expect(years.length).to.equal(3);
    years.forEach((year) => {
      expect(year.find("section").at(0).hasClass("header-bar")).to.be.true;
      expect(year.find("section").at(1).hasClass("list-holder")).to.be.true;
      expect(year.find(StatsInnerList).prop("styled")).to.be.true;
      year.find(StatsInnerList).find("ul").at(0).children("li").map((l) => {
        expect(l.hasClass("stats-category")).to.be.true;
        expect(l.find("section").hasClass("stats-category-name")).to.be.true;
        expect(l.find("ul").hasClass("stats-category-list")).to.be.true;
      });
    });
    expect(wrapper.state()["styled"]).to.be.true;
    let formattingButton = wrapper.find("button").at(0);
    expect(formattingButton.text()).to.equal("Remove Formatting");
    expect(formattingButton.text()).to.equal("Remove Formatting");
    formattingButton.simulate("click");
    years = wrapper.find(".year-li");
    expect(years.length).to.equal(3);
    years.forEach((year) => {
      expect(year.find("section").at(0).hasClass("header-bar")).to.be.false;
      expect(year.find("section").at(1).hasClass("list-holder")).to.be.false;
      expect(year.find(StatsInnerList).prop("styled")).to.be.false;
      year.find(StatsInnerList).find("ul").at(0).children("li").map((l) => {
        expect(l.hasClass("stats-category")).to.be.false;
        expect(l.find("section").hasClass("stats-category-name")).to.be.false;
        expect(l.find("ul").hasClass("stats-category-list")).to.be.false;
      });
    });
    expect(wrapper.state()["styled"]).to.be.false;
    expect(formattingButton.text()).to.equal("Restore Formatting");
  });
});
