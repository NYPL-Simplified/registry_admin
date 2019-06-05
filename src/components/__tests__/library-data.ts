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

export const modify = (baseLibrary: LibraryData, newData: {[key: string]: string | string[]}, category?: string): LibraryData => {
  // A helper function so that tests can easily modify a library's data or create a new library
  // based off of an existing one.  The category variable only needs to be passed if the modification
  // entails adding a new key.
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
