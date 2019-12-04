import { expect } from "chai";

import * as React from "react";
import * as Enzyme from "enzyme";
import App from "../App";
import { Header } from "library-simplified-reusable-components";
import LogInFrom from "../reusables/LogInForm";
import LibrariesPage from "../LibrariesPage";
import { MemoryRouter } from "react-router-dom";
import buildStore from "../../store";
import ContextProvider from "../ContextProvider";

describe("App", () => {
  let wrapper: Enzyme.ShallowWrapper<{}, {}>;
  let context;
  let store;

  beforeEach(() => {
    store = buildStore();
    context = { store, username: "" };
    wrapper = Enzyme.mount(
      <ContextProvider {...context}>
        <MemoryRouter initialEntries={["/admin"]}>
          <App imgSrc="" />
        </MemoryRouter>
      </ContextProvider>,
    );
  });
  it("should render the header and pass it the correct props", () => {
    let header = wrapper.find(Header);
    expect(header.length).to.equal(1);
    expect(header.prop("text")).to.equal("Library Registry Interface");
    expect(header.prop("imgSrc")).to.equal("");
    expect(header.prop("logOut")).to.equal("/admin/log_out");
  });

  it("should render the login form", () => {
    let librariesPage = wrapper.find(LibrariesPage);
    let logInForm = wrapper.find(LogInFrom);
    expect(logInForm.length).to.equal(1);
    expect(librariesPage.length).to.equal(0);
  });

  it("should render the libraries page component", () => {
    context = { store, username: "Admin" };
    wrapper = Enzyme.mount(
      <ContextProvider {...context}>
        <MemoryRouter initialEntries={["/admin"]}>
          <App imgSrc="" />
        </MemoryRouter>
      </ContextProvider>,
    );
    let librariesPage = wrapper.find(LibrariesPage);
    let logInForm = wrapper.find(LogInFrom);
    expect(logInForm.length).to.equal(0);
    expect(librariesPage.length).to.equal(1);
  });
});
