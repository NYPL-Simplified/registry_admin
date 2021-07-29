import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";

import Filter from "../Filter";
import Toggle from "../reusables/Toggle";

describe("Filter", () => {
  it("renders the default panel, without content", () => {
    let wrapper;
    let filterKeys = {
      key_1: false,
    };
    const setFilter = Sinon.stub();
    const flipFilter = Sinon.stub();
    wrapper = Enzyme.mount(
      <Filter
        filterKeys={filterKeys}
        setFilter={setFilter}
        flipFilter={flipFilter}
      />
    );
    const panel = wrapper.find(".panel");
    const heading = wrapper.find(".panel-heading");
    const body = wrapper.find(".panel-body");
    const content = wrapper.find(".filters");
    expect(panel.length).to.equal(1);
    expect(heading.length).to.equal(1);
    expect(body.length).to.equal(1);
    expect(content.length).to.equal(0);
  });

  /*
  By default, Panel components are set to closed, and their content does not render until clicked.
  We need to manually trigger a click to open them and test the contents.
   */
  describe("Open", () => {
    let wrapper;
    let filterKeys = {
      key_1: false,
      key_2: false,
      key_3: true,
    };
    let setFilter: Sinon.SinonStub;
    let flipFilter: Sinon.SinonStub;

    beforeEach(() => {
      setFilter = Sinon.stub();
      flipFilter = Sinon.stub();
      wrapper = Enzyme.mount(
        <Filter
          filterKeys={filterKeys}
          setFilter={setFilter}
          flipFilter={flipFilter}
        />
      );
      const panelToggle = wrapper.find("button.panel-heading");
      panelToggle.simulate("click");
    });

    it("renders a title", () => {
      expect(wrapper.find("p").text()).to.equal("Show items which have");
      wrapper.setProps({ title: "Filtering out things if they" });
      expect(wrapper.find("p").text()).to.equal(
        "Filtering out things if they have"
      );
    });

    it("renders custom button text", () => {
      expect(wrapper.find("button").at(1).text()).to.equal("have");
      wrapper.setState({ flip: true });
      expect(wrapper.find("button").at(1).text()).to.equal("DO NOT have");
      wrapper.setProps({ buttonText: ["don't contain", "contain"] });
      expect(wrapper.find("button").at(1).text()).to.equal("don't contain");
      wrapper.setState({ flip: false });
      expect(wrapper.find("button").at(1).text()).to.equal("contain");
    });

    it("renders toggles", () => {
      let toggles = wrapper.find(".filter-box");
      expect(toggles.length).to.equal(3);
      toggles.forEach((toggle, idx) => {
        let keyName = Object.keys(filterKeys)[idx];
        expect(toggle.find("label").text()).to.equal(keyName);
        expect(toggle.find(Toggle).prop("name")).to.equal(keyName);
        expect(toggle.find(Toggle).prop("initialOn")).to.equal(
          filterKeys[keyName]
        );
      });
    });

    it("optionally starts out flipped", () => {
      expect(wrapper.state()["flip"]).to.be.false;
      wrapper = Enzyme.mount(
        <Filter
          initialFlip={true}
          filterKeys={filterKeys}
          setFilter={setFilter}
          flipFilter={flipFilter}
        />
      );
      expect(wrapper.state()["flip"]).to.be.true;
    });

    it("calls setFilter", () => {
      expect(setFilter.callCount).to.equal(0);
      let toggle1 = wrapper
        .find(".filter-box")
        .first()
        .find(Toggle)
        .find("button");
      toggle1.simulate("click");
      expect(setFilter.callCount).to.equal(1);
      expect(setFilter.args[0][0]).to.equal("key_1");
    });

    it("calls flipFilter", () => {
      expect(flipFilter.callCount).to.equal(0);
      expect(wrapper.state("flip")).to.be.false;
      let flipButton = wrapper.find("button").at(1);
      flipButton.simulate("click");
      expect(flipFilter.callCount).to.equal(1);
      expect(wrapper.state("flip")).to.be.true;
      flipButton.simulate("click");
      expect(flipFilter.callCount).to.equal(2);
      expect(wrapper.state("flip")).to.be.false;
    });

    it("removes content on close", () => {
      const panelToggle = wrapper.find("button.panel-heading");
      panelToggle.simulate("click");
      const content = wrapper.find(".filters");
      const toggles = wrapper.find(".filter-box");
      expect(content.length).to.equal(0);
      expect(toggles.length).to.equal(0);
    });
  });
});
