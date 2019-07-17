import { expect } from "chai";

import * as React from "react";
import * as Enzyme from "enzyme";
import buildStore from "../../store";
import { testLibrary1, modifyLibrary } from "./TestUtils";

import LibrariesListItem from "../LibrariesListItem";
import { Panel } from "library-simplified-reusable-components";

describe("LibrariesListItem", () => {
  const library = testLibrary1;
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  describe("rendering", () => {
    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesListItem
          library={library}
          store={store}
        />
      );
    });
    it("should display a panel", () => {
      expect(wrapper.find(".panel").length).to.equal(1);
    });
    it("should render a header with a title", () => {
      let header = wrapper.find(".panel-heading");
      expect(header.length).to.equal(1);
      let title = header.find(".panel-title");
      expect(title.length).to.equal(1);
      expect(title.text()).to.equal("Test Library 1 (lib1)");
    });
    it("should display the PLS ID, if there is one", () => {
      const libraryWithPLS = modifyLibrary(testLibrary1, {"pls_id": "12345"}, "basic_info");
      wrapper.setProps({ library: libraryWithPLS });
      let title = wrapper.find(".panel-heading .panel-title");
      expect(title.length).to.equal(1);
      expect(title.text()).to.equal("Test Library 1 (lib1): 12345");
    });
    it("should display an icon in the header", () => {
      let header = wrapper.find(".panel-heading");
      let icon = header.find("svg");
      expect(icon.hasClass("down-icon")).to.be.true;
    });
  });
  describe("behavior", () => {
    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesListItem
          library={library}
          store={store}
        />
      );
    });
    it("should determine background color based on registry_stage and library_stage", () => {
      expect(wrapper.state().color).to.equal("warning");
      expect(wrapper.find(".panel-warning").length).to.equal(1);

      (wrapper.instance() as any).updateColor(["cancelled", "production"]);
      wrapper.update();
      expect(wrapper.state().color).to.equal("danger");
      expect(wrapper.find(".panel-danger").length).to.equal(1);

      (wrapper.instance() as any).updateColor(["production", "production"]);
      wrapper.update();
      expect(wrapper.state().color).to.equal("success");
      expect(wrapper.find(".panel-success").length).to.equal(1);
    });
  });
});
