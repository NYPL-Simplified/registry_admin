import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import MonthlyDataTab from "../MonthlyDataTab";
import CopyButton from "../CopyButton";
import StatsInnerList from "../StatsInnerList";
import DropdownButton from "../DropdownButton";
import { Button } from "library-simplified-reusable-components";
import { LibraryData } from "../../interfaces";
import { testLibrary1, modifyLibrary, validate } from "./TestUtils";
import { findYear } from "../../utils/sharedFunctions";

describe("MonthlyDataTab", () => {
  let data: {[key: string]: LibraryData[]};
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let today;
  let thisMonth;
  let thisYear;
  let productionLibrary1;
  let productionLibrary2;
  let testLibrary2;
  beforeEach(() => {
    today = new Date() as any;
    thisMonth = today.toLocaleString("default", { month: "long" });
    thisYear = findYear(today.toDateString())[0];
    productionLibrary1 = validate(modifyLibrary(testLibrary1, { "name": "Production Library 1", "registry_stage": "production" }), today.toString());
    productionLibrary2 = validate(modifyLibrary(productionLibrary1, { "name": "Production Library 2", "timestamp": "Fri, 01 Nov 2018 15:05:34 GMT" }));
    testLibrary2 = validate(modifyLibrary(testLibrary1, { "name": "Test Library 2", "timestamp": "Fri, 01 Nov 2017 15:05:34 GMT"}));
    data = {
      "production": [productionLibrary1, productionLibrary2],
      "testing": [validate(testLibrary1), testLibrary2],
      "cancelled": []
    };
    wrapper = Enzyme.mount(<MonthlyDataTab data={data} />);
  });
  it("displays buttons", () => {
    let buttons = wrapper.find(".buttons").children();
    expect(buttons.length).to.equal(4);
    expect(buttons.at(0).instance()).to.be.instanceOf(DropdownButton);
    expect(buttons.at(1).instance()).to.be.instanceOf(DropdownButton);
    expect(buttons.at(2).text()).to.contain("Formatting");
    expect(buttons.at(3).instance()).to.be.instanceOf(CopyButton);
  });
  it("displays the header bar", () => {
    let headerBar = wrapper.find(".header-bar");
    expect(headerBar.text()).to.equal(`${thisMonth}, ${thisYear}`);
    let unvalidated = modifyLibrary(productionLibrary1, {"contact_validated": null});
    wrapper = Enzyme.mount(<MonthlyDataTab data={{"production": [unvalidated]}} />);
    wrapper.setState({ month: thisMonth, year: thisYear, dataToShow: wrapper.instance().filter(thisMonth, thisYear) });
    headerBar = wrapper.find(".header-bar");
    expect(headerBar.text()).to.equal(`No libraries were validated during ${thisMonth} of ${thisYear}.`);
  });
  it("displays the list of libraries", () => {
    let list = wrapper.find(StatsInnerList);
    expect(list.prop("data")).to.eql(wrapper.state().dataToShow);
  });
  it("updates the month and year", () => {
    expect(wrapper.state().month).to.equal(thisMonth);
    expect(wrapper.state().year).to.equal(thisYear);
    let spyUpdateTimeframe = Sinon.spy(wrapper.instance(), "updateTimeframe");
    let spyFilter = Sinon.spy(wrapper.instance(), "filter");
    wrapper.setProps({ updateTimeframe: spyUpdateTimeframe, filter: spyFilter });
    let monthMenu = wrapper.find(DropdownButton).at(0);
    let yearMenu = wrapper.find(DropdownButton).at(1);
    let newMonth = monthMenu.find(Button).at(1).text();
    let newYear = yearMenu.find(Button).at(1).text();

    monthMenu.instance().toggle("true");
    monthMenu.find(Button).at(1).simulate("click");
    expect(spyUpdateTimeframe.callCount).to.equal(1);
    expect(spyUpdateTimeframe.args[0][1]).to.equal("month");
    expect(spyFilter.callCount).to.equal(1);
    expect(spyFilter.args[0]).to.eql([newMonth, thisYear]);
    expect(wrapper.state().month).to.equal(newMonth);
    expect(wrapper.state().year).to.equal(thisYear);

    yearMenu.instance().toggle("true");
    yearMenu.find(Button).at(1).simulate("click");
    expect(spyUpdateTimeframe.callCount).to.equal(2);
    expect(spyUpdateTimeframe.args[1][1]).to.equal("year");
    expect(spyFilter.callCount).to.equal(2);
    expect(spyFilter.args[1]).to.eql([newMonth, newYear]);
    expect(wrapper.state().month).to.equal(newMonth);
    expect(wrapper.state().year).to.equal(newYear);

    spyUpdateTimeframe.restore();
    spyFilter.restore();
  });

  it("filters the list of libraries", () => {
    let filteredLengths = (month: string, year: string) => {
      let prod = wrapper.instance().filter(month, year).production;
      let test = wrapper.instance().filter(month, year).testing;
      prod.concat(test).forEach((l: LibraryData) => {
        expect(l?.urls_and_contact.contact_validated).to.contain(`${month.slice(0, 3)}`);
        expect(l?.urls_and_contact.contact_validated).to.contain(year);
      });
      return [prod.length, test.length];
    };
    expect(filteredLengths("November", "2017")).to.eql([0, 1]);
    expect(filteredLengths("November", "2018")).to.eql([1, 0]);
    expect(filteredLengths("November", "2019")).to.eql([0, 1]);
    expect(filteredLengths("November", "2021")).to.eql([0, 0]);
    expect(filteredLengths(thisMonth, thisYear)).to.eql([1, 0]);
  });
});
