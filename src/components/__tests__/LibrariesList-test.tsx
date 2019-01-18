import { expect } from "chai";
import { stub } from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";

import { LibrariesList } from "../LibrariesList";

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
  let fetchData;
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  describe("rendering", () => {
    fetchData = stub();
    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesList
          fetchData={fetchData}
          store={store}
          libraries={libraries}
        />
      );
    });

    it("should call fetchData on load", () => {
      expect(fetchData.callCount).to.equal(1);
    });

    it("should display a list of libraries", () => {
      let libraryItems = wrapper.find(".panel");
      expect(libraryItems.length).to.equal(2);
    });

    it("should render each library's  name and short name", () => {
      let lib1 = wrapper.find(".panel").at(0);
      expect(lib1.text()).to.contain("Test Library 1 (lib1)");
      let lib2 = wrapper.find(".panel").at(1);
      expect(lib2.text()).to.contain("Test Library 2 (lib2)");
    });

    it("should update if the libraries prop changes", () => {
      let newLib1 = Object.assign({}, libraries.libraries[0], { basic_info: { name: "New Library!", short_name: "new" } });
      let newProps = Object.assign({}, libraries, { libraries: [newLib1, libraries.libraries[1]] });
      wrapper.setProps({ libraries: newProps });

      expect(fetchData.called).to.be.true;
      expect(wrapper.find(".panel").length).to.equal(2);
      expect(wrapper.find(".panel-title").at(0).text()).to.equal("New Library! (new)");
    });

    it("should display a header if there are no libraries", () => {
      wrapper.setProps({ libraries: [] });
      expect(fetchData.called).to.be.true;
      let header = wrapper.find(".page-header");
      expect(header.length).to.equal(1);
      expect(header.text()).to.equal("There are no libraries in this registry yet.");
    });
  });
});
