import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";
import { testLibrary1, modifyLibrary } from "./TestUtils";
import { EmailValidationForm } from "../EmailValidationForm";

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
        library={library}
        validateEmail={validateEmail}
        fetchLibrary={fetchLibrary}
      />
    );
  });

  it("renders a form with a title, a hidden value, and a button", () => {
    expect(wrapper.find(".validation").length).to.equal(1);

    let title = wrapper.find(".form-title");
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal("Validation");

    let hiddenInput = wrapper.find("[type='hidden']");
    expect(hiddenInput.length).to.equal(1);
    expect(hiddenInput.prop("name")).to.equal("uuid");
    expect(hiddenInput.prop("value")).to.equal("UUID1");

    let button = wrapper.find("button");
    expect(button.length).to.equal(1);
  });

  it("displays the correct button content", () => {
    let button = wrapper.find("button");
    expect(button.text()).to.contain("Validate email address");
    expect(button.prop("disabled")).not.to.be.true;

    let library = wrapper.prop("library");
    wrapper.setProps({ library: modifyLibrary(library, {"validated": "validation time" })});
    button = wrapper.find("button");
    expect(button.text()).to.contain("Validate email address");
    expect(button.prop("disabled")).not.to.be.true;

    wrapper.setProps({ library: modifyLibrary(library, {contact_email: null}) });
    button = wrapper.find("button");
    expect(button.text()).to.equal("No email address configured");
    expect(button.prop("disabled")).to.be.true;
  });

  it("displays the correct button icon", () => {
    let icon = wrapper.find("button").find("svg");
    expect(icon.length).to.equal(0);

    wrapper.setState({ sent: true });

    icon = wrapper.find("button").find("svg");
    expect(icon.length).to.equal(1);
    expect(icon.hasClass("check-solo-icon")).to.be.true;
  });

  it("displays an info message", () => {
    let info = wrapper.find(".alert-info");
    expect(info.length).to.equal(0);

    let library = wrapper.prop("library");
    wrapper.setProps({ library: modifyLibrary(library, {"validated": "validation time" })});

    info = wrapper.find(".alert-info");
    expect(info.length).to.equal(1);
    expect(info.text()).to.equal("Already validated");

    // Hide the info message if there's a success message or an error message to display instead
    wrapper.setState({ sent: true });
    info = wrapper.find(".alert-info");
    expect(info.length).to.equal(0);

    wrapper.setProps({ error: { response: "Failed to validate email address" } });
    info = wrapper.find(".alert-info");
    expect(info.length).to.equal(0);
  });

  it("submits on click", async () => {
    expect(wrapper.state()["sent"]).to.be.false;
    wrapper.find("button").simulate("click");
    expect(validateEmail.callCount).to.equal(1);
    expect(validateEmail.args[0][0].get("uuid")).to.equal("UUID1");

    const pause = (): Promise<void> => {
      return new Promise<void>(resolve => setTimeout(resolve, 0));
    };
    await pause();

    expect(fetchLibrary.callCount).to.equal(1);
    expect(fetchLibrary.args[0][0]).to.equal("UUID1");
    expect(wrapper.state()["sent"]).to.be.true;
  });

  it("does not set 'sent' to true if there is an error", async () => {
    expect(wrapper.state()["sent"]).to.be.false;
    wrapper.find("button").simulate("click");


    const pause = (): Promise<void> => {
      return new Promise<any>((resolve, reject) => {
        reject({ message: "email failure" });
      });
    };

    expect(wrapper.state()["sent"]).to.be.false;
    expect(wrapper.find("button").find("svg").length).to.equal(0);
  });

  it("displays a success message", () => {
    let successMessage = wrapper.find(".alert-success");
    expect(successMessage.length).to.equal(0);

    wrapper.setState({ sent: true });

    successMessage = wrapper.find(".alert-success");
    expect(successMessage.length).to.equal(1);
    expect(successMessage.text()).to.equal("Successfully validated email1");
  });

  it("displays an error message", () => {
    let errorMessage = wrapper.find(".alert-danger");
    expect(errorMessage.length).to.equal(0);

    wrapper.setProps({ error: { response: "Failed to validate email address" } });

    errorMessage = wrapper.find(".alert-danger");
    expect(errorMessage.length).to.equal(1);
    expect(errorMessage.text()).to.equal("Failed to validate email address");
  });

});
