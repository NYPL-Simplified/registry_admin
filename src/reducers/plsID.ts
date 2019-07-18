import { LibraryData } from "../interfaces";
import ActionCreator from "../actions";
import createFetchEditReducer from "./createFetchEditReducer";

export default createFetchEditReducer<LibraryData>(
  ActionCreator.POST_PLS_ID
);
