import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation";
import { color, colorNew } from "../modules/styles/theme";
import ChallengeDashboard from "../screens/ChallengeDashboard";
import Settings from "../screens/Settings";
import SweatChallengeDetail from "../screens/Menu/Tabs/SweatChallenges/SweatChallengeDetail";
import HeaderBackImage from "./HeaderBackImage";
import HeaderBackImageWhite from "./HeaderBackImageWhite";
import { logo_white_love_seat_fitness } from "../images";
import { SweatChallenges } from "../screens/Menu/Tabs";
import BonusChallenge from "../screens/Menu/Tabs/SweatChallenges/BonusChallenge";
import { PlainHeader } from "../components/common";
import { navOptionsForTabScreen } from "../screens/Settings/SettingsStack";

const stackConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: color.navPink,
      elevation: 0,
    },
    transparentCard: true,
  },
  headerLayoutPreset: "center",
};
const styles = {
  headerTitleStyle: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "center",
    color: color.hotPink,
  },
};
navOptionsForBackScreen = (screenAfterWorkout, navigation, title) => {
  let options = {
    headerBackTitle: null,
    headerTitle: title,
    headerTitleStyle: styles.headerTitleStyle,
  };

  if (screenAfterWorkout == "ChallengeDashboard") {
    options.headerLeft = () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("ChallengeDashboard")}
      >
        <HeaderBackImage />
      </TouchableOpacity>
    );
  } else {
    options.headerBackImage = <HeaderBackImage />;
  }

  return options;
};

export default createStackNavigator(
  {
    ChallengeDashboard: {
      screen: ChallengeDashboard,
      navigationOptions: ({ navigation }) => {
        return {
          title: null,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: null,
          headerBackTitle: null,
          headerLeft: null,
          headerTitle: "",
        };
      },
    },
    SweatChallenges: {
      screen: SweatChallenges,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerBackImage: null,
        headerBackTitle: null,
        headerLeft: null,
        headerTitle: "",
      }),
    },
    BonusChallenge: {
      screen: BonusChallenge,
      navigationOptions: () => {
        return {
          title: "",
          headerBackImage: (
            <Image
              source={require("../../src/images/images/back_white.png")}
              style={{ backgroundColor: "transparent", marginLeft: 13 }}
            />
          ),
          headerBackTitle: null,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
          headerStyle: {
            backgroundColor: "#f597a9",
            elevation: 0,
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },
        };
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ screenProps, navigation }) => {
        const { routes } = navigation.state;

        const showHeader = routes.length == 1;

        return navOptionsForTabScreen(showHeader, navigation);
      },
    },
    SweatChallengeDetail: {
      screen: SweatChallengeDetail,
      navigationOptions: () => ({
        headerTransparent: true,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerBackImage: <HeaderBackImage />,
        headerBackTitle: null,
        headerTitle: "",
        headerTitleAllowFontScaling: false,
      }),
    },
  },
  stackConfig
);
