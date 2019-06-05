import { LibraryData } from "../../interfaces";

export const testLibrary1: LibraryData = {
  uuid: "UUID1",
  basic_info: {
    "name": "Test Library 1",
    "short_name": "lib1",
    "description": undefined
  },
  urls_and_contact: {
    "authentication_url": "auth1",
    "contact_email": "email1",
    "opds_url": "opds1",
    "web_url": "web1"
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
  },
  urls_and_contact: {
    "authentication_url": "auth2",
    "contact_email": "email2",
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

export const modifyLibrary = (baseLibrary: LibraryData, newData: {[key: string]: string | string[]}, category?: string): LibraryData => {
  /**
   * modifyLibrary()
   * @param {LibraryData} baseLibrary - the library to be modified
   * @param {{[key: string]: string | string[]}} newData - key-value pairs with which to update the library
   * @param {string} [category] - the category that the new values should go into.  This isn't necessary if we're
     modifying the value of a key that already exists in the library; modifyLibrary will figure it out.
     It's only necessary if we're adding a new key.
  */

  let categories = Object.keys(baseLibrary);
  let newValue = {};
  let updatedLibrary = {...baseLibrary};

  Object.entries(newData).forEach((pair) => {
    let [key, value] = pair;
    if (!category) {
      let allCategories = Object.keys(baseLibrary);
      category = allCategories.find((cat) => Object.keys(baseLibrary[cat]).includes(key));
    }
    newValue[key] = value;
    let updatedCategory = { ...baseLibrary[category], ...newValue };
    updatedLibrary[category] = updatedCategory;
  });
  return updatedLibrary;
};
