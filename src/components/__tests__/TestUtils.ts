import { expect } from "chai";
import * as Enzyme from "enzyme";

import { LibraryData } from "../../interfaces";

export const testLibrary1: LibraryData = {
  uuid: "UUID1",
  basic_info: {
    "name": "Test Library 1",
    "short_name": "lib1",
    "description": undefined,
    "number_of_patrons": "3",
    "timestamp": "Fri, 01 Nov 2019 15:05:34 GMT"
  },
  urls_and_contact: {
    "authentication_url": "auth1",
    "contact_email": "contact_email1",
    "help_email": "help_email1",
    "copyright_email": "copyright_email1",
    "opds_url": "opds1",
    "web_url": "web1",
  },
  stages: {
    "library_stage": "production",
    "registry_stage": "testing"
  },
  areas: {
    "focus": ["10025 (NY)", "Stratford (ON)", "33154 (FL)"],
    "service": []
  }
};

export const testLibrary2: LibraryData = {
  uuid: "UUID2",
  basic_info: {
    "name": "Test Library 2",
    "short_name": "lib2",
    "number_of_patrons": "1",
    "timestamp": "Fri, 01 Nov 2018 15:05:34 GMT"
  },
  urls_and_contact: {
    "authentication_url": "auth2",
    "contact_email": "contact_email2",
    "help_email": "help_email2",
    "copyright_email": "copyright_email2",
    "opds_url": "opds2",
    "web_url": "web2"
  },
  stages: {
    "library_stage": "testing",
    "registry_stage": "cancelled"
  },
  areas: {
    "focus": [],
    "service": []
  }
};

/**
* modifyLibrary()
* @param {LibraryData} baseLibrary - the library to be modified
* @param {{[key: string]: string | string[]}} newData - key-value pairs with which to update the library
* @param {string} [category] - the category that the new values should go into.  This isn't necessary if we're
modifying the value of a key that already exists in the library; modifyLibrary will figure it out.
It's only necessary if we're adding a new key.
*/
export const modifyLibrary = (baseLibrary: LibraryData, newData: {[key: string]: string | string[]}, category?: string): LibraryData => {
  let updatedLibrary = {...baseLibrary};
  let allCategories = Object.keys(baseLibrary);

  Object.entries(newData).forEach((pair) => {
    let categoryToUpdate = category || null;
    let newValue = {};
    let [key, value] = pair;
    if (Object.keys(baseLibrary).includes(key)) {
      updatedLibrary[key] = value;
    } else {
      if (!categoryToUpdate) {
        categoryToUpdate = allCategories.find((cat) => Object.keys(baseLibrary[cat]).includes(key));
      }
      newValue[key] = value;
      let updatedCategory = { ...updatedLibrary[categoryToUpdate], ...newValue };
      updatedLibrary[categoryToUpdate] = updatedCategory;
    }
  });
  return updatedLibrary;
};

export const validate = (baseLibrary: LibraryData, validatedAt?: string): LibraryData => {
  let updatedLibrary = {...baseLibrary};
  if (!validatedAt) {
    validatedAt = baseLibrary.basic_info.timestamp || "Not validated";
  }
  let updatedContact = {...baseLibrary.urls_and_contact, ...{contact_validated: validatedAt}};
  updatedLibrary.urls_and_contact = updatedContact;
  return updatedLibrary;
};

describe("TestUtils", () => {
  it("updates a library with one new value", () => {
    let baseLibrary = testLibrary1;
    expect(baseLibrary.stages.registry_stage).to.equal("testing");
    let updatedLibrary = modifyLibrary(baseLibrary, {registry_stage: "production"});
    expect(updatedLibrary.stages.registry_stage).to.equal("production");
  });

  it("updates a library with multiple new values from different categories", () => {
    let baseLibrary = testLibrary1;
    expect(baseLibrary.basic_info.name).to.equal("Test Library 1");
    expect(baseLibrary.urls_and_contact.web_url).to.equal("web1");
    expect(baseLibrary.areas.service).to.eql([]);
    let updatedLibrary = modifyLibrary(baseLibrary, {
      name: "New Name",
      web_url: "new_url",
      service: ["10069 (NY)"]
    });
    expect(updatedLibrary.basic_info.name).to.equal("New Name");
    expect(updatedLibrary.urls_and_contact.web_url).to.equal("new_url");
    expect(updatedLibrary.areas.service).to.eql(["10069 (NY)"]);
  });

  it("updates a library with multiple new values within the same category", () => {
    let baseLibrary = testLibrary1;
    expect(baseLibrary.basic_info.name).to.equal("Test Library 1");
    expect(baseLibrary.basic_info.short_name).to.equal("lib1");
    let updatedLibrary = modifyLibrary(baseLibrary, {
      name: "New Name",
      short_name: "New Short Name"
    });
    expect(updatedLibrary.basic_info.name).to.equal("New Name");
    expect(updatedLibrary.basic_info.short_name).to.equal("New Short Name");
  });

  it("takes an optional category argument", () => {
    let baseLibrary = testLibrary1;
    expect(baseLibrary.urls_and_contact.contact_validated).to.be.undefined;
    let updatedLibrary = modifyLibrary(baseLibrary, {contact_validated: "VALIDATED!"}, "urls_and_contact");
    expect(updatedLibrary.urls_and_contact.contact_validated).to.equal("VALIDATED!");
  });

  it("modifies the UUID", () => {
    let baseLibrary = testLibrary1;
    expect(baseLibrary.uuid).to.equal("UUID1");
    let updatedLibrary = modifyLibrary(baseLibrary, {uuid: "UUID2"});
    expect(updatedLibrary.uuid).to.equal("UUID2");
  });

  it("validates the contact email", () => {
    let baseLibrary = testLibrary1;
    expect(baseLibrary.urls_and_contact.contact_validated).to.be.undefined;
    baseLibrary = validate(baseLibrary);
    expect(baseLibrary.urls_and_contact.contact_validated).to.equal(baseLibrary.basic_info.timestamp);
    baseLibrary = validate(baseLibrary, "Fri, 12 May 2018 15:05:34 GMT");
    expect(baseLibrary.urls_and_contact.contact_validated).to.equal("Fri, 12 May 2018 15:05:34 GMT");
    let noTimestamp = {...baseLibrary.basic_info, ...{timestamp: undefined}};
    baseLibrary = {...baseLibrary, ...{basic_info: noTimestamp}};
    expect(validate(baseLibrary).urls_and_contact.contact_validated).to.equal("Not validated");
  });
});
