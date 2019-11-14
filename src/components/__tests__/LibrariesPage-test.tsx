import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";

import { testLibrary1, testLibrary2, modifyLibrary } from "./TestUtils";
import { LibrariesPage } from "../LibrariesPage";
import LibrariesList from "../LibrariesList";
import Toggle from "../reusables/Toggle";
import SearchForm from "../SearchForm";
import Stats from "../Stats";
import { Form } from "library-simplified-reusable-components";

describe("LibrariesPage", () => {
  let libraries;
  let qaLib = modifyLibrary(testLibrary1, { "name": "QA Library", "uuid": "UUID3"});
  let fetchQA;
  let search;
  let wrapper: Enzyme.CommonWrapper<{}, {}, {}>;
  let store;

  beforeEach(() => {
    libraries = [
      modifyLibrary(testLibrary1, {registry_stage: "production", library_stage: "production"}),
      modifyLibrary(testLibrary2, {registry_stage: "production", library_stage: "production"})
    ];
    fetchQA = Sinon.stub();
    search = Sinon.stub().returns(libraries[1]);
    store = buildStore();
    wrapper = Enzyme.mount(
      <LibrariesPage
        store={store}
        fetchQA={fetchQA}
        search={search}
        libraries={{libraries}}
        isLoaded={true}
      />
    );
  });

  it("should call fetchQA on load", () => {
    expect(fetchQA.callCount).to.equal(1);
  });

  it("should display a toggle", () => {
    expect(wrapper.state()["qa"]).to.be.false;
    let toggle = wrapper.find(Toggle).first();
    expect(toggle.text()).to.equal("Show All: Off");
    expect(toggle.prop("initialOn")).to.be.false;

    wrapper.setState({ "qa": true });

    toggle = wrapper.find(Toggle).first();
    expect(toggle.prop("initialOn")).to.be.true;
    expect(toggle.text()).to.equal("Show All: On");
  });

  it("should toggle", async () => {
    expect(fetchQA.callCount).to.equal(1);
    expect(wrapper.state()["qa"]).to.be.false;
    expect(wrapper.find(Toggle).first().prop("initialOn")).to.be.false;

    await wrapper.instance().toggleQA(true);
    wrapper.update();

    // We already have all the data; no need for another server call.
    expect(fetchQA.callCount).to.equal(1);
    expect(wrapper.state()["qa"]).to.be.true;
    expect(wrapper.find(Toggle).first().prop("initialOn")).to.be.true;

    wrapper.setProps({ libraries: { libraries: libraries.concat(qaLib) }});

    await wrapper.instance().toggleQA(false);
    wrapper.update();

    // Still just filtering the existing data.
    expect(fetchQA.callCount).to.equal(1);
    expect(wrapper.state()["qa"]).to.be.false;
    expect(wrapper.find(Toggle).first().prop("initialOn")).to.be.false;
  });

  it("should display a stats panel", () => {
    let stats = wrapper.find(Stats);
    expect(stats.length).to.equal(1);
    expect(stats.find(".panel-title").text()).to.equal("Aggregate Data");
    expect(stats.prop("libraries")).to.equal(wrapper.prop("libraries").libraries);
  });

  it("should display a search form", () => {
    expect(wrapper.render().hasClass("libraries-page")).to.be.true;
    let searchForm = wrapper.find(SearchForm);
    expect(searchForm.length).to.equal(1);
    expect(searchForm.find(".panel-title").text()).to.equal("Search");
    expect(searchForm.find(".btn").length).to.equal(1);
    wrapper.setState({ showAll: false });

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
  });

  it("shouldn't display QA search results unless in QA mode", async () => {
    wrapper.setProps({ results: { libraries: [qaLib] } });
    wrapper.setState({ searchTerm: "QA Library", showAll: false });
    let results = wrapper.find(".panel-warning");
    expect(results.length).to.equal(0);

    wrapper.setState({...wrapper.state(), ...{qa: true}});

    results = wrapper.find(".panel-warning");
    expect(results.length).to.equal(1);
    expect(results.find(".panel-title").text()).to.equal("QA Library");
  });

  it("should let the user check QA if the production search was unsuccessful", async () => {
    expect(search.callCount).to.equal(0);
    wrapper.setState({ searchTerm: "QA Library"});
    await wrapper.instance().toggleQA(true);

    expect(search.callCount).to.equal(1);
    expect(search.args[0][0].get("name")).to.equal("QA Library");
  });

  it("should display a list", () => {
    let list = wrapper.find(LibrariesList);
    expect(list.length).to.equal(1);
    // All libraries:
    expect(list.prop("libraries")).to.eql(wrapper.prop("libraries").libraries);

    // Successful search:
    wrapper.setState({ showAll: false });
    wrapper.setProps({ results: { libraries: [libraries[1]] } });

    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.eql(wrapper.prop("results").libraries);
    // Clear the search results:
    wrapper.setState({ showAll: true });

    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.eql(wrapper.prop("libraries").libraries);

    // Unsuccessful search:
    wrapper.setState({ showAll: false });
    wrapper.setProps({ results: null });
    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.eql([]);
    // Clear the search results:
    wrapper.setState({ showAll: true });
    list = wrapper.find(LibrariesList);
    expect(list.prop("libraries")).to.eql(wrapper.prop("libraries").libraries);

     // No libraries:
     wrapper.setProps({ libraries: [] });
     list = wrapper.find(LibrariesList);
     expect(list.prop("libraries")).to.be.undefined;
  });

  it("should render changes to a library", () => {
    let updatedLibrary = {...libraries[0], stages: {"library_stage": "testing", "registry_stage": "testing"}};
    let spyUpdateLibraryList = Sinon.spy(wrapper.instance(), "updateLibraryList");
    expect(spyUpdateLibraryList.callCount).to.equal(0);
    // There are two production libraries to display.
    expect(wrapper.find(".list .panel").length).to.equal(2);

    wrapper.setProps({ updatedLibrary });

    expect(spyUpdateLibraryList.callCount).to.equal(1);
    expect(spyUpdateLibraryList.args[0][0]).to.eql(libraries);
    expect(spyUpdateLibraryList.returnValues[0]).to.eql([updatedLibrary, libraries[1]]);
    // The library we edited has been hidden; there is only one production library to display.
    expect(wrapper.find(".list .panel").length).to.equal(1);

    spyUpdateLibraryList.restore();
  });

  it("should render changes to a search result", () => {
    // Use case: admin searched for a library and then edited its stages.  Changes should be reflected immediately.
    let updatedLibrary = modifyLibrary(libraries[0], {"library_stage": "testing", "registry_stage": "testing"});
    wrapper.setState({ showAll: false });

    let spyUpdateLibraryList = Sinon.spy(wrapper.instance(), "updateLibraryList");
    expect(spyUpdateLibraryList.callCount).to.equal(0);

    wrapper.setProps({ updatedLibrary, results: { libraries: [libraries[0]] } });
    expect(spyUpdateLibraryList.callCount).to.equal(2);
    expect(spyUpdateLibraryList.getCall(1).args[0][0]).to.equal(libraries[0]);
    expect(spyUpdateLibraryList.returnValues[1][0]).to.equal(updatedLibrary);

    spyUpdateLibraryList.restore();
  });

  it("should display a filter form", () => {
    expect(wrapper.find(".filters").length).to.equal(1);
  });

  it("should filter", () => {
    let libraryWithPLS = modifyLibrary(libraries[0], {"name": "PLS", "pls_id": "12345"}, "basic_info");
    wrapper.setProps({ libraries: { libraries: [libraries[0], libraryWithPLS] } });
    expect(wrapper.find(".list .panel").length).to.equal(2);
    wrapper.instance().setFilter("pls_id");
    wrapper.update();
    expect(wrapper.find(".list .panel").length).to.equal(1);
    expect(wrapper.find(".list .panel-title").text()).to.equal("PLS");
    wrapper.instance().flipFilter();
    wrapper.update();
    expect(wrapper.find(".list .panel").length).to.equal(1);
    expect(wrapper.find(".list .panel-title").text()).to.equal("Test Library 1");
    wrapper.instance().setFilter("pls_id");
    wrapper.update();
    expect(wrapper.find(".list .panel").length).to.equal(2);
  });

  it("should filter libraries by attribute", () => {
    let libraryWithPLS = modifyLibrary(libraries[0], {"pls_id": "12345"}, "basic_info");
    wrapper.setProps({ libraries: { libraries: [libraryWithPLS, libraries[1]] } });
    wrapper.setState({ filters: { flipped: false, attributes: { "pls_id": true }}});
    let filteredLibraries = wrapper.instance().filterByAttribute(wrapper.prop("libraries").libraries);
    expect(filteredLibraries.length).to.equal(1);
    expect(filteredLibraries[0]).to.equal(libraryWithPLS);
  });

  it("should check whether a library has an attribute", () => {
    let libraryWithPLS = modifyLibrary(libraries[0], {"pls_id": "12345"}, "basic_info");
    expect(wrapper.instance().hasAttr(libraryWithPLS, "pls_id")).to.be.true;
    expect(wrapper.instance().hasAttr(libraries[1], "pls_id")).to.be.false;

    const nested = { level1: { level2: { level3: { level4: "some value" }}}};
    expect(wrapper.instance().hasAttr(nested, "level1")).to.be.true;
    expect(wrapper.instance().hasAttr(nested, "level2")).to.be.true;
    expect(wrapper.instance().hasAttr(nested, "level3")).to.be.true;
    expect(wrapper.instance().hasAttr(nested, "level4")).to.be.true;
    expect(wrapper.instance().hasAttr(nested, "level5")).to.be.false;
  });

  it("should convert between an attribute's display name and key name", () => {
    expect(wrapper.instance().convertToAttrName("PLS ID")).to.equal("pls_id");
    expect(wrapper.instance().convertToAttrName("Description")).to.equal("description");
    expect(wrapper.instance().convertToAttrName("Basic Info")).to.equal("basic_info");
  });

  it("should let the LibrariesList know whether the list of libraries has finished loading", () => {
    let list = wrapper.find(LibrariesList);
    expect(list.prop("isLoaded")).to.be.true;
    wrapper.setProps({ isLoaded: false });
    list = wrapper.find(LibrariesList);
    expect(list.prop("isLoaded")).to.be.false;
  });
});
