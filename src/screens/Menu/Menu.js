import {Dimensions} from "react-native"
import { MyWeek, SweatChallenges, VideoLibrary } from "./Tabs";
import { createMaterialTopTabNavigator } from "react-navigation";
import { color } from "../../modules/styles/theme";

const { width } = Dimensions.get("window");

const tabBarOptions = {
  allowFontScaling: false,
  activeTintColor: color.hotPink,
  inactiveTintColor: color.darkGrey,
  labelStyle: {
    width: 160,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tabStyle: {
    width: width / 3
  },
  style: {
    backgroundColor: color.navPink,
    elevation: 0
  },
  indicatorStyle:{
      backgroundColor: color.hotPink,
      width: width * .07,
      marginLeft: width * .13
  },
};

export default createMaterialTopTabNavigator({
  "My Week": {
    screen: MyWeek
  },
  "Sweat Challenges": {
    screen: SweatChallenges
  },
  "Video Library": {
    screen: VideoLibrary
  }
}, { tabBarOptions });