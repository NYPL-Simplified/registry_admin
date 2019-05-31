import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";

import { LibrariesPage } from "../LibrariesPage";
import LibrariesList from "../LibrariesList";
import SearchForm from "../SearchForm";
import Form from "../reusables/Form";

describe("LibrariesPage", () => {
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
        "web_url": "web2"
      },
      stages: {
        "library_stage": "testing",
        "registry_stage": "cancelled"
      }
    }
  ];
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
    expect(wrapper.render().hasClass("libraries-page")).to.be.true;
    let searchForm = wrapper.find(SearchForm);
    expect(searchForm.length).to.equal(1);
    expect(searchForm.find(".panel-title").text()).to.equal("Search for a library by name");
    expect(searchForm.find(".btn").length).to.equal(1);
    wrapper.setState({ showAll: false });
    wrapper.update();

    searchForm = wrapper.find(SearchForm);
    // The "Clear search" button is showing now.
    expect(searchForm.find(".btn").length).to.equal(2);
  });

  it("should search", async() => {
    let form = wrapper.find(Form).at(0);
    const libraryPageSearch = () => {
      wrapper.setState({ showAll: false });
      search();
    };
    let formSubmit = Sinon.stub(form.instance(), "submit").callsFake(libraryPageSearch);
    let spyClear = Sinon.spy(wrapper.instance(), "clear");

    expect(wrapper.state()["showAll"]).to.be.true;
    wrapper.find(".panel-info").find("input").simulate("change", {target: {value: "test_search_term"}});
    wrapper.find(".panel-info form .btn").simulate("click");

    const pause = (): Promise<void> => {
      return new Promise<void>(resolve => setTimeout(resolve, 0));
    };
    await pause();
    wrapper.update();

    expect(search.callCount).to.equal(1);
    expect(wrapper.state()["showAll"]).to.be.false;

    let clearButton = wrapper.find(".panel-info .btn").at(1);
    clearButton.simulate("click");

    expect(spyClear.callCount).to.equal(1);
    await pause();
    expect(wrapper.state()["showAll"]).to.be.true;

    spyClear.restore();
    formSubmit.restore();
  });

  it("should display a list", () => {
    let list = wrapper.find(LibrariesList);
    expect(list.length).to.equal(1);

    // All libraries:
    expect(list.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);

    // Successful search:
    wrapper.setState({ showAll: false });
    wrapper.setProps({ results: { libraries: [libraries[1]] } });

    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.equal(wrapper.prop("results").libraries);
    // Clear the search results:
    wrapper.setState({ showAll: true });

    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);

    // Unsuccessful search:
    wrapper.setState({ showAll: false });
    wrapper.setProps({ results: null })
    ;
    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.eql([]);
    // Clear the search results:
    wrapper.setState({ showAll: true });
    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);

    // No libraries:
    wrapper.setProps({ libraries: [] });
    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.be.undefined;
  });

});
