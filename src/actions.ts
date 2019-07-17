import {
  LibraryData,
  LibrariesData
} from "./interfaces";
import DataFetcher from "opds-web-client/lib/DataFetcher";
import { RequestError, RequestRejector } from "opds-web-client/lib/DataFetcher";
import BaseActionCreator from "opds-web-client/lib/actions";

/** Create redux actions to be dispatched by connected components, mostly
    to make requests to the server. */
export default class ActionCreator extends BaseActionCreator {

  static readonly GET_ALL_LIBRARIES = "GET_ALL_LIBRARIES";
  static readonly GET_SOME_LIBRARIES = "GET_SOME_LIBRARIES";
  static readonly GET_ONE_LIBRARY = "GET_ONE_LIBRARY";

  static readonly VALIDATE_EMAIL = "VALIDATE_EMAIL";
  static readonly EDIT_STAGES = "EDIT_STAGES";
  static readonly PLS_ID = "PLS_ID";

  static readonly LOG_IN = "LOG_IN";

  constructor(fetcher?: DataFetcher) {
    fetcher = fetcher || new DataFetcher();
    super(fetcher);
  }

  postForm(
    type: string,
    url: string,
    data: FormData | null,
    method?: string,
    defaultErrorMessage?: string,
    returnType?: string,
  ) {
    let err: RequestError;
    return (dispatch => {
      return new Promise((resolve, reject: RequestRejector) => {
        dispatch(this.request(type));
        let headers = new Headers();
        fetch(url, {
          method: method || "POST",
          headers: headers,
          body: data,
          credentials: "same-origin"
        }).then(response => {
          if (response.status === 200 || response.status === 201) {
            dispatch(this.success(type));
            if (response.json && returnType === "JSON") {
              response.json().then(data => {
                dispatch(this.load<any>(type, data));
                resolve(response);
              });
            } else if (response.text) {
              response.text().then(text => {
                dispatch(this.load<string>(type, text));
                resolve(response);
              });
            } else {
              resolve(response);
            }
          } else {
            response.json().then(data => {
              err = {
                status: response.status,
                response: data.detail || data.title,
                url: url
              };
              dispatch(this.failure(type, err));
              reject(err);
            }).catch(parseError => {
              err = {
                status: response.status,
                response: defaultErrorMessage || "Failed to save changes",
                url: url
              };
              dispatch(this.failure(type, err));
              reject(err);
            });
          }
        }).catch(err => {
          err = {
            status: null,
            response: err.message,
            url: url
          };
          dispatch(this.failure(type, err));
          reject(err);
        });
      });
    }).bind(this);
  }

  postJSON<T>(type: string, url: string, data: T) {
    let err: RequestError;
    return (dispatch => {
      return new Promise((resolve, reject: RequestRejector) => {
        dispatch(this.request(type, url));
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data),
          credentials: "same-origin"
        }).then(response => {
          if (response.status === 200 || response.status === 201) {
            dispatch(this.success(type));
            resolve(response);
          } else {
            response.json().then(data => {
              err = {
                status: response.status,
                response: data.detail,
                url: url
              };
              dispatch(this.failure(type, err));
              reject(err);
            }).catch(parseError => {
              err = {
                status: response.status,
                response: "Request failed",
                url: url
              };
              dispatch(this.failure(type, err));
              reject(err);
            });
          }
        }).catch(err => {
          err = {
            status: null,
            response: err.message,
            url: url
          };
          dispatch(this.failure(type, err));
          reject(err);
        });
      });
    });
  }

  fetchLibraries(qa?: string) {
    let url = "/admin/libraries" + (qa || "");
    return this.fetchJSON<LibrariesData>(ActionCreator.GET_ALL_LIBRARIES, url).bind(this);
  }

  fetchLibrary(uuid: string) {
    let url = "/admin/libraries/" + uuid;
    return this.fetchJSON<LibraryData>(ActionCreator.GET_ONE_LIBRARY, url).bind(this);
  }

  search(data: FormData) {
    let url = "/admin/libraries/search_details";
    return this.postForm(ActionCreator.GET_SOME_LIBRARIES, url, data, "POST", "", "JSON").bind(this);
  }

  validateEmail(data: FormData) {
    let url = "/admin/libraries/email";
    return this.postForm(ActionCreator.VALIDATE_EMAIL, url, data).bind(this);
  }

  editStages(data: FormData) {
    let url = "/admin/libraries/registration";
    return this.postForm(ActionCreator.EDIT_STAGES, url, data).bind(this);
  }

  plsID(data: FormData) {
    let url = "/admin/libraries/pls_id";
    return this.postForm(ActionCreator.PLS_ID, url, data).bind(this);
  }

  logIn(data: FormData) {
    let url = "/admin/log_in";
    return this.postForm(ActionCreator.LOG_IN, url, data).bind(this);
  }

}
