import { ValidationData } from "../interfaces";
import ActionCreator from "../actions";
import createFetchEditReducer from "./createFetchEditReducer";

export default createFetchEditReducer<ValidationData>(
  ActionCreator.VALIDATE_EMAIL
);
