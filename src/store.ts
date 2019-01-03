import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers/index";
const thunk = require("redux-thunk").default;

export default function buildStore(initialState?: any) {
  let store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk)
  );
  return store;
}
