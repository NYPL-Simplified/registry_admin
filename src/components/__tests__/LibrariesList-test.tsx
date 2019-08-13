import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";
import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";

import LibrariesList from "../LibrariesList";
import LibrariesListItem from "../LibrariesListItem";
import LoadingIndicator from "opds-web-client/lib/components/LoadingIndicator";

describe("LibrariesList", () => {
  const libraries = [testLibrary1, testLibrary2];
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  describe("rendering", () => {

    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesList
          store={store}
          libraries={libraries}
          isLoaded={true}
        />
      );
    });

    it("should display a list of libraries", () => {
      let libraryItems = wrapper.find(".list .panel");
      expect(libraryItems.length).to.equal(2);
    });

    it("should render each library's  name", () => {
      let lib1 = wrapper.find(".list .panel").at(0);
      expect(lib1.text()).to.contain("Test Library 1");
      let lib2 = wrapper.find(".list .panel").at(1);
      expect(lib2.text()).to.contain("Test Library 2");
    });

    it("should update if the libraries prop changes", () => {
      let newLib1 = modifyLibrary(testLibrary1, { name: "New Library!" });
      wrapper.setProps({ libraries: [newLib1, libraries[1]] });

      let libraryPanels = wrapper.find(".list .panel");
      expect(libraryPanels.length).to.equal(2);
      expect(libraryPanels.at(0).find(".panel-title").text()).to.equal("New Library!");
    });

    it("should display a message if there are no libraries", () => {
      wrapper.setProps({ libraries: null });
      let message = wrapper.find("span");
      expect(message.length).to.equal(1);
      expect(message.text()).to.equal("There are no libraries in this registry yet.");
    });

    it("should display a loading indicator while the list of libraries is loading", () => {
      let loader = wrapper.find(LoadingIndicator);
      expect(loader.length).to.equal(0);
      wrapper.setProps({ isLoaded: false });
      loader = wrapper.find(LoadingIndicator);
      expect(loader.length).to.equal(1);
      // Don't show the "There are no libraries" message.
      expect(wrapper.find("span").length).to.equal(0);
    });
  });
});
