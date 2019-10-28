import { combineReducers } from "redux";
import { libraries, results } from "./libraries";
import library from "./library";
import admin from "./admin";
import validation from "./validation";
import plsID from "./plsID";
import adobeData from "./adobeData";

import { FetchEditState } from "./createFetchEditReducer";

import {
  LibrariesData,
  LibraryData,
  ValidationData,
  AdminData,
  AdobeData
} from "../interfaces";

export interface State {
  libraries: FetchEditState<LibrariesData>;
  results: FetchEditState<LibrariesData>;
  library: FetchEditState<LibraryData>;
  admin: FetchEditState<AdminData>;
  validation: FetchEditState<ValidationData>;
  plsID: FetchEditState<LibraryData>;
  adobeData: FetchEditState<AdobeData>;
}

export default combineReducers<State>({
  libraries,
  results,
  library,
  admin,
  validation,
  plsID,
  adobeData
});
