import { FetchErrorData } from "opds-web-client/lib/interfaces";

export interface LibraryData {
  uuid: string;
  basic_info: {
    description?: string,
    internal_urn?: string,
    online_registration?: string,
    name: string,
    short_name: string,
    timestamp?: string,
    pls_id?: string,
    number_of_patrons?: string
  };
  urls_and_contact: {
    authentication_url: string,
    contact_email: string,
    opds_url: string,
    web_url: string,
    contact_validated?: string,
    help_email: string,
    help_validated?: string,
    copyright_email?: string,
    copyright_validated?: string
  };
  areas: {
    focus: string[],
    service: string[]
  };
  stages: {
    library_stage: string,
    registry_stage: string
  };
}

export interface LibrariesData {
  libraries: LibraryData[];
}

export interface AdminData {
  username: string;
}

export interface ValidationData {
  error?: FetchErrorData;
}
