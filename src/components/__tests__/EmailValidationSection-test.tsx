import { expect } from "chai";
import * as Sinon from "sinon";
import * as Enzyme from "enzyme";
import * as React from "react";
import buildStore from "../../store";
import { testLibrary1, modifyLibrary } from "./TestUtils";
import EmailValidationSection from "../EmailValidationSection";
import { EmailValidationForm } from "../EmailValidationForm";
import { Form } from "library-simplified-reusable-components";

describe("EmailValidationSection", () => {
  let store;
  let wrapper;
  beforeEach(() => {
    store = buildStore();
    wrapper = Enzyme.mount(
      <EmailValidationSection
        library={testLibrary1}
        store={store}
      />
    );
  });
  it("renders a section with three forms", () => {
    let section = wrapper.find("section");
    expect(section.length).to.equal(1);
    expect(section.hasClass("validations")).to.be.true;
    expect(section.find(EmailValidationForm).length).to.equal(3);
  });
  it("passes the correct props to each form", () => {
    let [contactForm, helpForm, copyrightForm] = wrapper.find(EmailValidationForm).map(x => x);

    expect(contactForm.prop("uuid")).to.equal(testLibrary1.uuid);
    expect(contactForm.prop("email")).to.equal("contact_email");
    expect(contactForm.prop("libraryInfo")).to.eql(testLibrary1.urls_and_contact);

    expect(helpForm.prop("uuid")).to.equal(testLibrary1.uuid);
    expect(helpForm.prop("email")).to.equal("help_email");
    expect(helpForm.prop("libraryInfo")).to.eql(testLibrary1.urls_and_contact);

    expect(copyrightForm.prop("uuid")).to.equal(testLibrary1.uuid);
    expect(copyrightForm.prop("email")).to.equal("copyright_email");
    expect(copyrightForm.prop("libraryInfo")).to.eql(testLibrary1.urls_and_contact);
  });
});
