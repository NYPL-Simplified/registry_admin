import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import Form from "../Form";
import { Button } from "library-simplified-reusable-components";

describe("Form", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let content: Array<JSX.Element>;
  let element1: JSX.Element;
  let element2: JSX.Element;
  let hiddenName = "hidden name";
  let hiddenValue = "hidden value";
  let onSubmit = Sinon.stub();

  beforeEach(() => {
    element1 = <input type="text" name="Element1" defaultValue="element1"/>;
    element2 = <select name="Element2">
                  <option value="abc">ABC</option>
                  <option value="xyz">XYZ</option>
                </select>;

    wrapper = Enzyme.mount(
      <Form
        content={[element1, element2]}
        hiddenName={hiddenName}
        hiddenValue={hiddenValue}
        onSubmit={onSubmit}
      />
    );
  });

  it("should optionally set a className", () => {
    expect(wrapper.find("form").prop("className")).to.equal("clearfix");
    wrapper.setProps({ className: "custom-class" });
    expect(wrapper.find("form").prop("className")).to.equal("clearfix custom-class");
  });

  it("should optionally render a hidden input field", () => {
    let hidden = wrapper.find("[type='hidden']");
    expect(hidden.length).to.equal(1);
    expect(hidden.props().name).to.equal("hidden name");
    expect(hidden.props().value).to.equal("hidden value");

    wrapper.setProps({ hiddenName: null });
    hidden = wrapper.find("[type='hidden']");
    expect(hidden.length).to.equal(0);
  });

  it("should render elements", () => {
    let input = wrapper.find("input").at(1);
    expect(input.length).to.equal(1);
    expect(input.props().type).to.equal("text");
    expect(input.props().name).to.equal("Element1");

    let select = wrapper.find("select");
    expect(select.length).to.equal(1);
    expect(select.props().name).to.equal("Element2");
    expect(select.find("option").length).to.equal(2);
  });

  it("should optionally render a title", () => {
    let title = wrapper.find(".form-title");
    expect(title.length).to.equal(0);

    wrapper.setProps({ title: "Test" });
    title = wrapper.find(".form-title");
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal("Test");
  });

  it("should optionally render an error message", () => {
    let spyMessage = Sinon.spy(wrapper.instance(), "message");
    let error = wrapper.find(".alert-danger");
    expect(spyMessage.callCount).to.equal(0);
    expect(error.length).to.equal(0);

    wrapper.setProps({ errorText: "ERROR!" });

    expect(spyMessage.callCount).to.equal(1);
    expect(spyMessage.args[0][0]).to.equal("ERROR!");
    expect(spyMessage.args[0][1]).to.equal("danger");
    error = wrapper.find(".alert-danger");
    expect(error.length).to.equal(1);
    expect(error.text()).to.equal("ERROR!");

    spyMessage.restore();
  });

  it("should optionally render a success message", () => {
    let spyMessage = Sinon.spy(wrapper.instance(), "message");
    let success = wrapper.find(".alert-success");
    expect(spyMessage.callCount).to.equal(0);
    expect(success.length).to.equal(0);

    wrapper.setProps({ successText: "SUCCESS!" });

    expect(spyMessage.callCount).to.equal(1);
    expect(spyMessage.args[0][0]).to.equal("SUCCESS!");
    expect(spyMessage.args[0][1]).to.equal("success");
    success = wrapper.find(".alert-success");
    expect(success.length).to.equal(1);
    expect(success.text()).to.equal("SUCCESS!");

    spyMessage.restore();
  });

  it("should not render a success message if it has an errorText prop", () => {
    let spyMessage = Sinon.spy(wrapper.instance(), "message");
    let success = wrapper.find(".alert-success");
    let error = wrapper.find(".alert-danger");
    expect(spyMessage.callCount).to.equal(0);
    expect(success.length).to.equal(0);
    expect(error.length).to.equal(0);

    wrapper.setProps({ successText: "SUCCESS!", errorText: "blocking the successText!"});

    expect(spyMessage.callCount).to.equal(1);
    expect(spyMessage.args[0][1]).to.equal("danger");
    expect(spyMessage.args[0][1]).not.to.equal("success");
    success = wrapper.find(".alert-success");
    error = wrapper.find(".alert-danger");
    expect(success.length).to.equal(0);
    expect(error.length).to.equal(1);

    spyMessage.restore();
  });

  it("should optionally render an info message", () => {
    let spyMessage = Sinon.spy(wrapper.instance(), "message");
    let info = wrapper.find(".alert-info");
    expect(spyMessage.callCount).to.equal(0);
    expect(info.length).to.equal(0);

    wrapper.setProps({ infoText: "An info string" });

    expect(spyMessage.callCount).to.equal(1);
    expect(spyMessage.args[0][0]).to.equal("An info string");
    expect(spyMessage.args[0][1]).to.equal("info");
    info = wrapper.find(".alert-info");
    expect(info.length).to.equal(1);
    expect(info.text()).to.equal("An info string");

    spyMessage.restore();
  });

  it("should render a Button", () => {
    let button = wrapper.find(Button);
    expect(button.length).to.equal(1);
    expect(button.props()["submit"]).to.equal((wrapper.instance() as any)["save"]);
  });

  it("should optionally send props to the Button", () => {
    wrapper.setProps({ buttonClass: "success", buttonContent: "testing...", disableButton: true });
    let button = wrapper.find(Button);
    expect(button.prop("className")).to.equal("success");
    expect(button.text()).to.equal("testing...");
    expect(button.prop("disabled")).to.be.true;
  });

  it("should call the onSave prop", () => {
    let button = wrapper.find(Button);
    button.simulate("click");
    expect(onSubmit.callCount).to.equal(1);

    let data = onSubmit.args[0][0];
    expect(data.get("Element1")).to.equal("element1");
    expect(data.get("Element2")).to.equal("abc");
  });
});
