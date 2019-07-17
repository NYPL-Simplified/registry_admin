import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";
import { testLibrary1, modifyLibrary } from "./TestUtils";
import { PlsIDForm } from "../PlsIDForm";

describe("PlsIDForm", () => {
  let wrapper: Enzyme.CommonWrapper<any, any, {}>;
  let store;
  let fetchLibrary: Sinon.SinonStub;
  let postPlsID: Sinon.SinonStub;

  beforeEach(() => {
    store = buildStore();
    fetchLibrary = Sinon.stub();
    postPlsID = Sinon.stub();
    wrapper = Enzyme.mount(<PlsIDForm store={store} fetchLibrary={fetchLibrary} postPlsID={postPlsID} uuid={testLibrary1.uuid} />);
  });

  it("renders a form with a title, hidden input field, text input field, and button", () => {
    let title = wrapper.find(".form-title");
    expect(title.length).to.equal(1);
    expect(title.text()).to.equal("PLS ID");

    let hiddenInput = wrapper.find("input").at(0);
    expect(hiddenInput.prop("type")).to.equal("hidden");
    expect(hiddenInput.prop("name")).to.equal("uuid");
    expect(hiddenInput.prop("value")).to.equal(testLibrary1.uuid);

    let textInput = wrapper.find("input").at(1);
    expect(textInput.prop("type")).to.equal("text");
    expect(textInput.prop("name")).to.equal("pls_id");

    let button = wrapper.find("button");
    expect(button.text()).to.equal("Save");
  });

  it("displays a check mark if the input has been saved", () => {
    let button = wrapper.find("button");
    expect(button.hasClass("success")).to.be.false;
    let icon = button.find("svg");
    expect(icon.length).to.equal(0);
    expect(wrapper.state()["saved"]).to.be.false;
    wrapper.setState({ saved: true });
    button = wrapper.find("button");
    expect(button.hasClass("success")).to.be.true;
    icon = button.find("svg");
    expect(icon.length).to.equal(1);
    expect(icon.hasClass("check-solo-icon")).to.be.true;
  });

  it("submits the form", async () => {
    expect(postPlsID.callCount).to.equal(0);
    expect(fetchLibrary.callCount).to.equal(0);
    expect(wrapper.state()["saved"]).to.be.false;

    let input = wrapper.find("input[type='text']");
    let inputElement = input.getDOMNode();
    inputElement.value = "12345";
    input.simulate("change");
    wrapper.find("button").simulate("click");

    expect(postPlsID.callCount).to.equal(1);
    expect(postPlsID.args[0][0].get("pls_id")).to.equal("12345");
    const pause = (): Promise<void> => {
      return new Promise<void>(resolve => setTimeout(resolve, 0));
    };
    await pause();
    expect(fetchLibrary.callCount).to.equal(1);
    expect(fetchLibrary.args[0][0]).to.equal(testLibrary1.uuid);
    expect(wrapper.state()["saved"]).to.be.true;
  });

  it("prepopulates the input field with the current PLS ID, if there is one", () => {
    expect(wrapper.find("input").at(1).prop("defaultValue")).to.be.undefined;
    wrapper.setProps({ currentID: "abcde" });
    expect(wrapper.find("input").at(1).prop("defaultValue")).to.equal("abcde");
  });

});
