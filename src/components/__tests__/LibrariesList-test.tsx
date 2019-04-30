import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";

import { LibrariesList } from "../LibrariesList";
import LibrariesListItem from "../LibrariesListItem";
import { Panel, Button } from "library-simplified-reusable-components";

describe("LibrariesList", () => {
  let libraries = {
    libraries:
      [{
        uuid: "UUID1",
        basic_info: {
          "name": "Test Library 1",
          "short_name": "lib1",
        },
        urls_and_contact: {
          "authentication_url": "auth1",
          "contact_email": "email1",
          "opds_url": "opds1",
          "web_url": "web1"
        },
        stages: {
          "library_stage": "production",
          "registry_stage": "testing"
        }
      },
      {
        uuid: "UUID2",
        basic_info: {
          "name": "Test Library 2",
          "short_name": "lib2",

        },
        urls_and_contact: {
          "authentication_url": "auth2",
          "contact_email": "email2",
          "opds_url": "opds2",
          "web_url": "web2"        },
        stages: {
          "library_stage": "testing",
          "registry_stage": "cancelled"
        }
      }
    ]
  };
  let fetchData: Sinon.SinonStub;
  let search: Sinon.SinonStub;
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  describe("rendering", () => {
    fetchData = Sinon.stub();
    search = Sinon.stub().returns(libraries.libraries[1]);
    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesList
          fetchData={fetchData}
          store={store}
          search={search}
          libraries={libraries}
        />
      );
    });

    it("should call fetchData on load", () => {
      expect(fetchData.callCount).to.equal(1);
    });

    it("should display a list of libraries", () => {
      let libraryItems = wrapper.find(".panel").not(".panel-info");
      expect(libraryItems.length).to.equal(2);
    });

    it("should render each library's  name and short name", () => {
      let lib1 = wrapper.find(".panel").not(".panel-info").at(0);
      expect(lib1.text()).to.contain("Test Library 1 (lib1)");
      let lib2 = wrapper.find(".panel").not(".panel-info").at(1);
      expect(lib2.text()).to.contain("Test Library 2 (lib2)");
    });

    it("should update if the libraries prop changes", () => {
      let newLib1 = Object.assign({}, libraries.libraries[0], { basic_info: { name: "New Library!", short_name: "new" } });
      let newProps = Object.assign({}, libraries, { libraries: [newLib1, libraries.libraries[1]] });
      wrapper.setProps({ libraries: newProps });

      expect(fetchData.called).to.be.true;
      let libraryPanels = wrapper.find(".panel").not(".panel-info");
      expect(libraryPanels.length).to.equal(2);
      expect(libraryPanels.at(0).find(".panel-title").text()).to.equal("New Library! (new)");
    });

    it("should display a header if there are no libraries", () => {
      wrapper.setProps({ libraries: [] });
      expect(fetchData.called).to.be.true;
      let header = wrapper.find(".page-header");
      expect(header.length).to.equal(1);
      expect(header.text()).to.equal("There are no libraries in this registry yet.");
    });

    it("should display a search form", () => {
      let searchForm = wrapper.find(".panel-info");
      expect(searchForm.length).to.equal(1);
      expect(searchForm.find(".panel-title").text()).to.equal("Search for a library by name");
      expect(searchForm.find(Button).length).to.equal(1);
      wrapper.setState({ showAll: false });
      // The "Clear search" button is showing now.
      expect(searchForm.find(Button).length).to.equal(2);
    });

    it("should search", async() => {
      let spyClear = Sinon.spy(wrapper.instance(), "clear");

      expect(wrapper.state()["showAll"]).to.be.true;
      wrapper.find(".panel-info").find("input").simulate("change", {target: {value: "test_search_term"}});
      wrapper.find(".panel-info").find(Button).simulate("click");
      const pause = (): Promise<void> => {
        return new Promise<void>(resolve => setTimeout(resolve, 0));
      };
      await pause();
      expect(search.callCount).to.equal(1);
      expect(wrapper.state()["showAll"]).to.be.false;
      let clearButton = wrapper.find(".panel-info").find(Button).at(1);
      clearButton.simulate("click");
      await pause();
      expect(spyClear.callCount).to.equal(1);
      expect(wrapper.state()["showAll"]).to.be.true;

      spyClear.restore();
    });

    it("should generate success and error messages", async () => {
      wrapper.setState({ searchTerm: "Test Library 1" });
      expect(wrapper.instance().getFormMessage(0)).to.eql({"error": "No results found for Test Library 1."});
      expect(wrapper.instance().getFormMessage(1)).to.eql({"success": "Displaying 1 result for Test Library 1:"});
      expect(wrapper.instance().getFormMessage(2)).to.eql({"success": "Displaying 2 results for Test Library 1:"});
    });
  });
});
