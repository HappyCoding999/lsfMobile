/**
 * @format
 */

import React, { useEffect } from "react";
import { AppRegistry, Dimensions, Animated } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

import { Provider } from "react-redux";
import store from "./configureStore";
import { SKIP_PAYWALL, VIDEO_HEADER_HEIGHT } from "./src/actions/types";

const { height, width } = Dimensions.get("window");

const ReduxApp = ({ skipPaywall }) => {
  useEffect(() => {
    console.log("skipPaywall", skipPaywall);
    store.dispatch({ type: SKIP_PAYWALL, payload: skipPaywall == 1 });
    store.dispatch({
      type: VIDEO_HEADER_HEIGHT,
      payload: new Animated.Value(0),
    });
    // store.dispatch({
    //   type: VIDEO_HEADER_HEIGHT,
    //   payload: (width * 300) / 414,
    // });
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => ReduxApp);
