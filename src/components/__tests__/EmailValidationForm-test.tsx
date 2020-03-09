import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";
import { testLibrary1, modifyLibrary } from "./TestUtils";
import { EmailValidationForm } from "../EmailValidationForm";
import { Form } from "library-simplified-reusable-components";

describe("EmailValidationForm", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  let validateEmail: Sinon.SinonStub;
  let fetchLibrary: Sinon.SinonStub;

  beforeEach(() => {
    const library = modifyLibrary(testLibrary1, {"validated": "Not validated"}, "urls_and_contact");
    store = buildStore();
    validateEmail = Sinon.stub();
    fetchLibrary = Sinon.stub();
    wrapper = Enzyme.mount(
      <EmailValidationForm
        store={store}
        validateEmail={validateEmail}
        uuid={library.uuid}
        email="contact_email"
        libraryInfo={library.urls_and_contact}
      />
    );
  });

  it("renders a form with a title, a hidden input, and a button", () => {
    let form = wrapper.find(Form);

    let title = form.find(".form-title");
    expect(title.find("span").text()).to.equal("contact email: contact_email1");
    expect(title.find("svg.x-icon").length).to.equal(1);

    let hiddenInput = form.find("[type='hidden']");
    expect(hiddenInput.length).to.equal(1);
    expect(hiddenInput.prop("name")).to.equal("uuid");
    expect(hiddenInput.prop("value")).to.equal("UUID1");

    let button = form.find("button");
    expect(button.length).to.equal(1);
    expect(button.text()).to.equal("Validate contact email");
  });

  it("displays the correct button content", () => {
    let button = wrapper.find("button").at(0);
    expect(button.text()).to.contain("Validate contact email");
    expect(button.prop("disabled")).not.to.be.true;

    let libraryInfo = wrapper.prop("libraryInfo");
    wrapper.setProps({ libraryInfo: {...libraryInfo, ...{"contact_validated": "validation time" }}});
    button = wrapper.find("button");
    expect(button.text()).to.contain("Validate contact email again");
    expect(button.prop("disabled")).not.to.be.true;

    wrapper.setProps({ libraryInfo: {...libraryInfo, ...{"contact_email": null, "contact_validated": null }}});
    button = wrapper.find("button");
    expect(button.text()).to.equal("Validate contact email");
    expect(button.prop("disabled")).to.be.true;
  });

  it("displays the correct icon", () => {
    let icon = wrapper.find("svg");
    expect(icon.length).to.equal(1);
    expect(icon.hasClass("x-icon")).to.be.true;

    wrapper.setState({ validated: true });

    icon = wrapper.find("svg");
    expect(icon.length).to.equal(1);
    expect(icon.hasClass("check-solo-icon")).to.be.true;
  });

  it("displays an info message", () => {
    let info = wrapper.find(".alert-info");
    expect(info.length).to.equal(1);
    expect(info.text()).to.equal("Not validated");

    let libraryInfo = wrapper.prop("libraryInfo");
    wrapper.setProps({ libraryInfo: {...libraryInfo, ...{"contact_validated": "validation time" }}});
    info = wrapper.find(".alert-info");
    expect(info.text()).to.equal("Validated: validation time");

    // Hide the info message if there's a success message or an error message to display instead
    wrapper.setState({ validated: true });
    info = wrapper.find(".alert-info");
    expect(info.length).to.equal(0);

    wrapper.setProps({ error: { response: "Failed to validate email address" } });
    info = wrapper.find(".alert-info");
    expect(info.length).to.equal(0);
  });

  it("submits on click", async () => {
    expect(wrapper.state()["validated"]).to.be.false;
    wrapper.find("button").simulate("click");
    expect(validateEmail.callCount).to.equal(1);
    expect(validateEmail.args[0][0].get("uuid")).to.equal("UUID1");

    const pause = (): Promise<void> => {
      return new Promise<void>(resolve => setTimeout(resolve, 0));
    };
    await pause();

    expect(wrapper.state()["validated"]).to.be.true;
  });

  it("does not set 'validated' to true if there is an error", async () => {
    expect(wrapper.state()["validated"]).to.be.false;
    wrapper.find("button").at(0).simulate("click");


    const pause = (): Promise<void> => {
      return new Promise<any>((resolve, reject) => {
        reject({ message: "email failure" });
      });
    };

    expect(wrapper.state()["validated"]).to.be.false;
    expect(wrapper.find("button").at(0).find("svg").length).to.equal(0);
  });

  it("displays a success message", () => {
    let successMessage = wrapper.find(".alert-success");
    expect(successMessage.length).to.equal(0);

    wrapper.setState({ validated: true });

    successMessage = wrapper.find(".alert-success").at(0);
    expect(successMessage.length).to.equal(1);
    expect(successMessage.text()).to.equal("Successfully validated contact_email1");
  });

  it("displays an error message", () => {
    let errorMessage = wrapper.find(".alert-danger");
    expect(errorMessage.length).to.equal(0);

    wrapper.setProps({ error: { response: "Failed to validate email address" } });

    errorMessage = wrapper.find(".alert-danger").at(0);
    expect(errorMessage.length).to.equal(1);
    expect(errorMessage.text()).to.equal("Failed to validate email address");
  });

});
