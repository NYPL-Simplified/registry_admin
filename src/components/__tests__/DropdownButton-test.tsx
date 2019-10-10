import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import DropdownButton from "../DropdownButton";
import { Button } from "library-simplified-reusable-components";

describe("DropdownButton", () => {
  let wrapper;
  let mainContent;
  let menuContent;
  let callback;
  beforeEach(() => {
    mainContent = "Button Text";
    menuContent = ["Option 1", "Option 2", "Option 3"];
    callback = Sinon.stub();
    wrapper = Enzyme.mount(
      <DropdownButton
        mainContent={mainContent}
        menuContent={menuContent}
        callback={callback}
      />
    );
  });
  it("opens and closes the menu", () => {
    let spyToggle = Sinon.spy(wrapper.instance(), "toggle");
    wrapper.setProps({ toggle: spyToggle });

    expect(wrapper.state()["isOpen"]).to.be.false;
    expect(wrapper.find(".dropdown-button-menu").hasClass("hidden")).to.be.true;
    let mainButton = wrapper.find(Button).at(0);
    let [text, icon] = mainButton.prop("content");
    expect(text).to.equal(mainContent);
    expect(icon.props.className).to.equal("down-icon");

    mainButton.simulate("click");

    expect(spyToggle.callCount).to.equal(1);
    expect(wrapper.state()["isOpen"]).to.be.true;
    expect(wrapper.find(".dropdown-button-menu").hasClass("hidden")).to.be.false;
    mainButton = wrapper.find(Button).at(0);
    [text, icon] = mainButton.prop("content");
    expect(text).to.equal(mainContent);
    expect(icon.props.className).to.equal("up-icon");

    mainButton.simulate("click");

    expect(spyToggle.callCount).to.equal(2);
    expect(wrapper.state()["isOpen"]).to.be.false;
    expect(wrapper.find(".dropdown-button-menu").hasClass("hidden")).to.be.true;
    mainButton = wrapper.find(Button).at(0);
    [text, icon] = mainButton.prop("content");
    expect(text).to.equal(mainContent);
    expect(icon.props.className).to.equal("down-icon");

    spyToggle.restore();
  });
  it("triggers the callback when the menu items are clicked", () => {
    wrapper.setState({ isOpen: true });
    let menu = wrapper.find(".dropdown-button-menu");
    expect(menu.length).to.equal(1);
    let options = menu.find(Button);
    expect(options.length).to.equal(3);
    options.forEach((x, idx) => {
      expect(x.props().content).to.equal(menuContent[idx]);
      x.simulate("click");
      expect(callback.callCount).to.equal(idx + 1);
    });
  });
  it("accepts an optional className prop", () => {
    expect(wrapper.find(".custom-class").length).to.equal(0);
    wrapper.setProps({ className: "custom-class" });
    expect(wrapper.find(".dropdown-button-container").hasClass("custom-class")).to.be.true;
    wrapper.find(Button).forEach(x => expect(x.hasClass("custom-class")).to.be.true);
  });
});
