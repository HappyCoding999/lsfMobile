import { combineReducers } from "redux";
import userData from "./userReducer";
import appData from "./appReducer";

const rootReducer = combineReducers({
  userData,
  appData
});

export default rootReducer;