import { expect } from "chai";
import * as Sinon from "sinon";
import buildStore from "../../store";
import * as Enzyme from "enzyme";
import * as React from "react";
import { LogInForm } from "../reusables/LogInForm";
import { Form } from "library-simplified-reusable-components";

describe("LogInForm", () => {
  let wrapper;
  let store;
  let logIn: Sinon.SinonStub;
  beforeEach(() => {
    store = buildStore();
    logIn = Sinon.stub();
    wrapper = Enzyme.mount(
      <LogInForm logIn={logIn} />
    );
  });
  it("should have the right className", () => {
    expect(wrapper.find("form").hasClass("centered")).to.be.true;
  });
  it("should display a default title", () => {
    let title = wrapper.find(".form-title");
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal("Log In");
  });
  it("should optionally display a custom title", () => {
    wrapper.setProps({ title: "Custom Title!" });
    let title = wrapper.find(".form-title");
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal("Custom Title!");
  });
  it("should display a default legend", () => {
    let legend = wrapper.find("legend");
    expect(legend.length).to.equal(1);
    expect(legend.text()).to.equal("Credentials");
  });
  it("should optionally display a custom legend", () => {
    wrapper.setProps({ legend: "Something else..." });
    let legend = wrapper.find("legend");
    expect(legend.length).to.equal(1);
    expect(legend.text()).to.equal("Something else...");
  });
  it("should display a username field with a label", () => {
    let usernameLabel = wrapper.find("fieldset").find("label").at(0);
    expect(usernameLabel.text()).to.equal("Username");
    let username = wrapper.find("[name='username']").hostNodes();
    expect(username.length).to.equal(1);
    expect(username.props().type).to.equal("text");
  });
  it("should display a password field with a label", () => {
    let passwordLabel = wrapper.find("fieldset").find("label").at(1);
    expect(passwordLabel.text()).to.equal("Password");
    let password = wrapper.find("[name='password']").hostNodes();
    expect(password.length).to.equal(1);
    expect(password.props().type).to.equal("password");
  });
  it("should optionally display extra fields", () => {
    let extraText = (
      <input
        type="text"
        key="extraText"
        name="extraText"
        placeholder="some text"
      />);
    let extraText2 = (
      <input
        type="text"
        key="extraText2"
        name="extraText2"
        placeholder="some text"
      />);
    wrapper.setProps({ extraFields: [extraText, extraText2] });
    let inputs = wrapper.find("input");
    expect(inputs.length).to.equal(4);
    expect(inputs.at(2).props().type).to.equal("text");
    expect(inputs.at(2).props().name).to.equal("extraText");
    expect(inputs.at(3).props().type).to.equal("text");
    expect(inputs.at(3).props().name).to.equal("extraText2");
  });
  it("should display a button", () => {
    let button = wrapper.find("button");
    expect(button.text()).to.equal("Submit");
  });
  it("should submit on click", () => {
    let form = wrapper.find(Form);
    let submit = Sinon.stub();
    let formSubmit = Sinon.stub(form.instance(), "submit").callsFake(submit);
    wrapper.setProps({ login: submit });
    wrapper.update();
    wrapper.find("button").simulate("click");
    expect(submit.callCount).to.equal(1);
    formSubmit.restore();
  });
  it("should call logIn when the form is submitted", () => {
    const formData = new (window as any).FormData();
    formData.append("username", "Admin");
    formData.append("password", "12345");

    wrapper.instance().submit(formData);

    expect(logIn.callCount).to.equal(1);
    expect(logIn.args[0][0]).to.equal(formData);
    expect(logIn.args[0][0].get("username")).to.equal("Admin");
    expect(logIn.args[0][0].get("password")).to.equal("12345");
  });
  describe("error handling", () => {
    it("should render a default error message if necessary", () => {
      let form = wrapper.find(Form);
      let error = wrapper.find(".alert-danger");
      expect(form.prop("errorText")).to.be.undefined;
      expect(error.length).to.equal(0);

      wrapper.setProps({ error: { status: 401, url: "url" } });

      form = wrapper.find(Form);
      error = wrapper.find(".alert-danger");
      expect(form.prop("errorText")).to.equal("Invalid credentials");
      expect(error.length).to.equal(1);
      expect(error.text()).to.equal("Invalid credentials");
    });
    it("should render a specific error message", () => {
      let form = wrapper.find(Form);
      let error = wrapper.find(".alert-danger");
      expect(form.prop("errorText")).to.be.undefined;
      expect(error.length).to.equal(0);

      wrapper.setProps({ error: { status: 401, url: "url", response: "Custom error text!" } });

      form = wrapper.find(Form);
      error = wrapper.find(".alert-danger");
      expect(form.prop("errorText")).to.equal("Custom error text!");
      expect(error.length).to.equal(1);
      expect(error.text()).to.equal("Custom error text!");
    });
  });
});
