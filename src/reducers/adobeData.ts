import { AdobeData } from "../interfaces";
import ActionCreator from "../actions";
import createFetchEditReducer from "./createFetchEditReducer";
import { RequestError } from "opds-web-client/lib/DataFetcher";


export default createFetchEditReducer<AdobeData>(
  ActionCreator.ADOBE_DATA
);
