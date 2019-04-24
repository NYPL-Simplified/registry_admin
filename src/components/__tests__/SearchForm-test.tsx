import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";

import SearchForm from "../SearchForm";
import Form from "../reusables/Form";

describe("SearchForm", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let search = Sinon.stub();
  let updateSearchTerm = Sinon.stub();

  beforeEach(() => {
    wrapper = Enzyme.mount(
      <SearchForm
        search={search}
        updateSearchTerm={updateSearchTerm}
        disableButton={false}
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
    expect(input.prop("onChange")).to.equal(wrapper.prop("updateSearchTerm"));
    let button = form.find("button");
    expect(button.length).to.equal(1);
    expect(button.text()).to.contain("Search");
  });

  it("should call updateSearchTerm", () => {
    expect(updateSearchTerm.callCount).to.equal(0);
    let input = wrapper.find("input");
    input.simulate("change", {target: {value: "test_search_term"}});
    expect(updateSearchTerm.callCount).to.equal(1);
    expect(updateSearchTerm.args[0][0].target.value).to.equal("test_search_term");
  });

  it("should call search", () => {
    expect(search.callCount).to.equal(0);
    wrapper.find("button").simulate("click");
    expect(search.callCount).to.equal(1);
  });

  it("should optionally disable the button", () => {
    let button = wrapper.find("button");
    expect(button.prop("disabled")).not.to.be.true;
    wrapper.setProps({ disableButton: true });
    button = wrapper.find("button");
    expect(button.prop("disabled")).to.be.true;
  });
});
