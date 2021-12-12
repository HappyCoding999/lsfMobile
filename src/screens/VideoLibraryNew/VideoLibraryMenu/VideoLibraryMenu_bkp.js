import { Dimensions, AsyncStorage } from "react-native";
import VideoLibrary from "./Tabs/VideoLibrary";
import { createMaterialTopTabNavigator } from "react-navigation";
import { color, colorNew } from "../../../modules/styles/theme";
import React, { Component } from "react";

import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const tabBarOptions = {
  allowFontScaling: false,
  activeTintColor: colorNew.darkPink,
  inactiveTintColor: color.black,
  labelStyle: {
    width: 160,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 30,
    letterSpacing: 0.1,
    marginBottom: -5,
    top: 5,
    textAlign: "center",
  },
  tabStyle: {
    width: width / 4,
  },
  style: {
    backgroundColor: "#fff",
    elevation: 0,
  },
  indicatorStyle: {
    backgroundColor: colorNew.darkPink,
    width: width * 0.19,
    marginLeft: width * 0.03,
  },
};

// var x = useSelector((state) => state.selected_tab_index);
var irn_w = "WORKOUTS";
// var irn_r = "RECOVERY";
// var irn_h = "HOW TO";
// var irn_y = "YOUTUBE";
// var x = this.props.selected_tab_index;

export default createMaterialTopTabNavigator(
  {
    WORKOUTS: {
      screen: (screenProps) => (
        <VideoLibrary category={"Workouts".toUpperCase()} {...screenProps} />
      ),
    },
    RECOVERY: {
      screen: (screenProps) => (
        <VideoLibrary category={"RECOVERY".toUpperCase()} {...screenProps} />
      ),
    },
    "HOW TO": {
      screen: (screenProps) => (
        <VideoLibrary category={"How To".toUpperCase()} {...screenProps} />
      ),
    },
    YOUTUBE: {
      screen: (screenProps) => (
        <VideoLibrary category={"YOUTUBE"} {...screenProps} />
      ),
    },
  },
  {
    tabBarOptions,
    initialRouteName: irn_w,
  }
);
