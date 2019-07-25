import { expect } from "chai";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Enzyme from "enzyme";
import * as Sinon from "sinon";

const RegistryAdmin = require("../index");
import { BrowserRouter } from "react-router-dom";
import App from "../components/App";

describe("RegistryAdmin", () => {
  let renderSpy;

  beforeEach(() => {
    renderSpy = Sinon.spy(ReactDOM, "render");
    new RegistryAdmin({ username: "", imgSrc: "" });
  });

  afterEach(() => {
    renderSpy.restore();
  });

  it("renders BrowserRouter", () => {
    expect(renderSpy.callCount).to.equal(1);
    const component = renderSpy.args[0][0];
    const wrapper = Enzyme.shallow(component);
    const browserRouter = wrapper.find(BrowserRouter);
    expect(browserRouter.length).to.equal(1);
  });

  it("renders App", () => {
    expect(renderSpy.callCount).to.equal(1);
    const component = renderSpy.args[0][0];
    const wrapper = Enzyme.shallow(component);
    const app = wrapper.find(App);
    expect(app.length).to.equal(1);
  });
});
