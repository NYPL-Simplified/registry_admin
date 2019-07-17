import { LibraryData } from "../interfaces";
import ActionCreator from "../actions";
import createFetchEditReducer from "./createFetchEditReducer";

export default createFetchEditReducer<LibraryData>(
  ActionCreator.PLS_ID
);
