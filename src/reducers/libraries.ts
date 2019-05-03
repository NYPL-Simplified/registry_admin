import { LibrariesData } from "../interfaces";
import ActionCreator from "../actions";
import createFetchEditReducer from "./createFetchEditReducer";

export const libraries = createFetchEditReducer<LibrariesData>(ActionCreator.GET_ALL_LIBRARIES);
export const results = createFetchEditReducer<LibrariesData>(ActionCreator.GET_SOME_LIBRARIES);
