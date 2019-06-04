import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";

import { testLibrary1, testLibrary2 } from "./library-data";
import { LibrariesPage } from "../LibrariesPage";
import LibrariesList from "../LibrariesList";
import SearchForm from "../SearchForm";

describe("LibrariesPage", () => {

    const libraries = [testLibrary1, testLibrary2];
    let fetchData = Sinon.stub();
    let search = Sinon.stub().returns(libraries[1]);
    let wrapper: Enzyme.CommonWrapper<{}, {}, {}>;
    let store;

    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesPage
          store={store}
          fetchData={fetchData}
          search={search}
          libraries={{libraries: libraries}}
        />
      );
    });

    it("should call fetchData on load", () => {
      expect(fetchData.callCount).to.equal(1);
    });

    it("should display a search form", () => {
      expect(wrapper.hasClass("libraries-page")).to.be.true;
      let searchForm = wrapper.find(SearchForm);
      expect(searchForm.length).to.equal(1);
      expect(searchForm.find(".panel-title").text()).to.equal("Search for a library by name");
      expect(searchForm.find(".btn").length).to.equal(1);
      wrapper.setState({ showAll: false });
      // The "Clear search" button is showing now.
      expect(searchForm.find(".btn").length).to.equal(2);
    });

    it("should search", async() => {
      let spyClear = Sinon.spy(wrapper.instance(), "clear");
      expect(wrapper.state()["showAll"]).to.be.true;
      wrapper.find(".panel-info").find("input").simulate("change", {target: {value: "test_search_term"}});
      wrapper.find(".panel-info form .btn").simulate("click");

      const pause = (): Promise<void> => {
        return new Promise<void>(resolve => setTimeout(resolve, 0));
      };
      await pause();

      expect(search.callCount).to.equal(1);
      expect(wrapper.state()["showAll"]).to.be.false;

      let clearButton = wrapper.find(".panel-info .btn").at(1);
      clearButton.simulate("click");

      expect(spyClear.callCount).to.equal(1);
      await pause();
      expect(wrapper.state()["showAll"]).to.be.true;

      spyClear.restore();
    });

    it("should display a list", () => {
      let list = wrapper.find(LibrariesList);
      expect(list.length).to.equal(1);

      // All libraries:
      expect(list.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);

      // Successful search:
      wrapper.setState({ showAll: false });
      wrapper.setProps({ results: { libraries: [libraries[1]] } });
      expect(list.prop("libraries")).to.equal(wrapper.prop("results").libraries);
      // Clear the search results:
      wrapper.setState({ showAll: true });
      expect(list.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);

      // Unsuccessful search:
      wrapper.setState({ showAll: false });
      wrapper.setProps({ results: null });
      expect(list.prop("libraries")).to.eql([]);
      // Clear the search results:
      wrapper.setState({ showAll: true });
      expect(list.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);

      // No libraries:
      wrapper.setProps({ libraries: [] });
      expect(list.prop("libraries")).to.be.undefined;
    });

  });
