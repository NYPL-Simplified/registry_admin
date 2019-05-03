import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";

import LibrariesList from "../LibrariesList";
import LibrariesListItem from "../LibrariesListItem";

describe("LibrariesList", () => {
  let libraries = [
       {
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
    ];

  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  describe("rendering", () => {

    beforeEach(() => {
      store = buildStore();
      wrapper = Enzyme.mount(
        <LibrariesList
          store={store}
          libraries={libraries}
        />
      );
    });

    it("should display a list of libraries", () => {
      let libraryItems = wrapper.find(".list .panel");
      expect(libraryItems.length).to.equal(2);
    });

    it("should render each library's  name and short name", () => {
      let lib1 = wrapper.find(".list .panel").at(0);
      expect(lib1.text()).to.contain("Test Library 1 (lib1)");
      let lib2 = wrapper.find(".list .panel").at(1);
      expect(lib2.text()).to.contain("Test Library 2 (lib2)");
    });

    it("should update if the libraries prop changes", () => {
      let newLib1 = Object.assign({}, libraries[0], { basic_info: { name: "New Library!", short_name: "new" } });
      let newProps = [newLib1, libraries[1]];
      wrapper.setProps({ libraries: newProps });

      let libraryPanels = wrapper.find(".list .panel");
      expect(libraryPanels.length).to.equal(2);
      expect(libraryPanels.at(0).find(".panel-title").text()).to.equal("New Library! (new)");
    });

    it("should display a message if there are no libraries", () => {
      wrapper.setProps({ libraries: null });
      let message = wrapper.find("span");
      expect(message.length).to.equal(1);
      expect(message.text()).to.equal("There are no libraries in this registry yet.");
    });
  });
});
