import { combineReducers } from "redux";
import { libraries, results } from "./libraries";
import library from "./library";
import admin from "./admin";
import validation from "./validation";
import plsID from "./plsID";

import { FetchEditState } from "./createFetchEditReducer";

import {
  LibrariesData,
  LibraryData,
  ValidationData,
  AdminData
} from "../interfaces";

export interface State {
  libraries: FetchEditState<LibrariesData>;
  results: FetchEditState<LibrariesData>;
  library: FetchEditState<LibraryData>;
  admin: FetchEditState<AdminData>;
  validation: FetchEditState<ValidationData>;
  plsID: FetchEditState<LibraryData>;
}

export default combineReducers<State>({
  libraries,
  results,
  library,
  admin,
  validation,
  plsID
});
