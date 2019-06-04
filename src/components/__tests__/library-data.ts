export const testLibrary1 = {
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

export const testLibrary2 = {
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
