import {Dimensions} from "react-native"
import { createMaterialTopTabNavigator } from "react-navigation";
import { color } from "../../../modules/styles/theme";
import Goals from "./Goals"
import Trophies from "./Trophies"
import Tracking from "./Tracking"
const {  width } = Dimensions.get("window");

const tabBarOptions = {
  allowFontScaling:false,
  activeTintColor: color.hotPink,
  inactiveTintColor: color.darkGrey,
  labelStyle: {
    fontSize: 12,
    width: 150,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center"
  },
  style: {
    backgroundColor: color.navPink,
    elevation: 0
  },
  indicatorStyle:{
      backgroundColor: color.hotPink,
      width: width * .07,
      marginLeft: width * .13
  }
}

export default createMaterialTopTabNavigator({
  "#Goals": {
    screen: Goals
  },
  Trophies: {
    screen: Trophies
  },
  "Tracking": {
    screen: Tracking
  }
  }, {
    tabBarOptions
});