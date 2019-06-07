import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";

import SearchForm from "../SearchForm";
import Form from "../reusables/Form";

describe("SearchForm", () => {
  let wrapper: Enzyme.CommonWrapper<{}, {}, {}>;
  let search = Sinon.stub();

  beforeEach(() => {
    wrapper = Enzyme.mount(
      <SearchForm
        search={search}
        text="Here is a search form!"
        inputName="testing"
      />
    );
  });

  it("should display a panel containing a form with an input box and a button", () => {
    let panel = wrapper.find(".panel-info");
    expect(panel.length).to.equal(1);
    expect(panel.find(".panel-title").text()).to.equal("Here is a search form!");
    let form = panel.find(Form);
    expect(form.length).to.equal(1);
    expect(form.prop("onSubmit")).to.equal(wrapper.prop("search"));
    let input = form.find("input");
    expect(input.length).to.equal(1);
    expect(input.prop("name")).to.equal("testing");
    let button = form.find("button");
    expect(button.length).to.equal(1);
    expect(button.text()).to.contain("Search");
  });

  it("should call updateSearchTerm", () => {
    let spyUpdate = Sinon.spy(wrapper.instance(), "updateSearchTerm");
    wrapper.setProps({ updateSearchTerm: spyUpdate });
    expect(spyUpdate.callCount).to.equal(0);
    expect(wrapper.state()["searchTerm"]).to.equal("");
    let input = wrapper.find("input");
    input.simulate("change", {target: {value: "test_search_term"}});
    expect(spyUpdate.callCount).to.equal(1);
    expect(spyUpdate.args[0][0].target.value).to.equal("test_search_term");
    expect(wrapper.state()["searchTerm"]).to.equal("test_search_term");
    spyUpdate.restore();
  });

  it("should call search", () => {
    let form = wrapper.find(Form);
    let formSubmit = Sinon.stub(form.instance(), "submit").callsFake(search);
    expect(search.callCount).to.equal(0);
    wrapper.setState({ searchTerm: "a string" });
    wrapper.find("button").simulate("click");
    expect(search.callCount).to.equal(1);
    formSubmit.restore();
  });

  it("should optionally disable the button", () => {
    let button = wrapper.find("button");
    expect(button.prop("disabled")).to.be.true;
    wrapper.setState({ searchTerm: "a string" });
    button = wrapper.find("button");
    expect(button.prop("disabled")).not.to.be.true;
  });

  it("should optionally show a clear button", () => {
    let clear = Sinon.stub();
    let clearButton = wrapper.find(".inverted").hostNodes();
    expect(clearButton.length).to.equal(0);
    expect(clear.callCount).to.equal(0);

    wrapper.setProps({ clear });

    clearButton = wrapper.find(".inverted").hostNodes();
    expect(clearButton.length).to.equal(1);
    expect(clearButton.text()).to.equal("Clear search");
    clearButton.simulate("click");
    expect(clear.callCount).to.equal(1);
  });

  it("should optionally show a success message", () => {
    let success = wrapper.find(".alert-success");
    expect(success.length).to.equal(0);
    wrapper.setProps({ term: "Test search term", resultsCount: 1 });
    success = wrapper.find(".alert-success");
    expect(success.length).to.equal(1);
    expect(success.text()).to.equal("Displaying 1 result for Test search term:");
    wrapper.setProps({ resultsCount: 2 });
    success = wrapper.find(".alert-success");
    expect(success.length).to.equal(1);
    expect(success.text()).to.equal("Displaying 2 results for Test search term:");
  });

  it("should optionally show an error message", () => {
    let error = wrapper.find(".alert-danger");
    expect(error.length).to.equal(0);
    wrapper.setProps({ term: "Test search term", resultsCount: 0 });
    error = wrapper.find(".alert-danger");
    expect(error.length).to.equal(1);
    expect(error.text()).to.equal("No results found for Test search term.");
  });

  it("should clear the input field when the clear button is clicked", () => {
    let clear = Sinon.stub();
    let input = wrapper.find("input").getDOMNode();
    input.value = "abc";
    wrapper.setProps({ clear });
    wrapper.find(".inverted").hostNodes().simulate("click");
    expect(input.value).to.equal("");
  });
});
