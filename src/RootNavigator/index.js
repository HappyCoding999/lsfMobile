import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation";
import { color, colorNew } from "../modules/styles/theme";
import Menu from "../screens/Menu";
import CircuitOnlyDetails from "../screens/Workouts/CircuitOnlyDetails";
import WeekAtGlance from "../screens/WeekAtGlance";

import SweatChallengeDetail from "../screens/Menu/Tabs/SweatChallenges/SweatChallengeDetail";
import HeaderBackImage from "./HeaderBackImage";
import HeaderBackImageWhite from "./HeaderBackImageWhite";

import ComboDetail from "../screens/Workouts/ComboDetail";
// import CardioDetail from "../screens/Workouts/CardioDetail";
import CardioDetail from "../screens/Workouts/CardioSweatSesh";
import Circuit from "../screens/Workouts/Circuit";
import VideoLibraryDetail from "../screens/Menu/Tabs/VideoLibrary/VideoLibraryDetail";
import OutsideWorkout from "../screens/OutsideWorkout";

import HydrationTracker from "../screens/HydrationTracker";

import VideoList from "../screens/VideoLibraryNew/VideoLibraryMenu/Tabs/VideoLibrary/VideoList";

import VideoSubCategory from "../screens/Menu/Tabs/VideoLibrary/VideoSubCategory";
import BonusChallenge from "../screens/Menu/Tabs/SweatChallenges/BonusChallenge";
import YoutubeList from "../screens/Menu/Tabs/VideoLibrary/YoutubeList";
import YoutubeCategories from "../screens/Menu/Tabs/VideoLibrary/YoutubeCategories";
import VideoLibraryNew from "../screens/VideoLibraryNew";

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
navOptionsForBackScreenWithNewNavColor = (
  screenAfterWorkout,
  navigation,
  title
) => {
  console.log("navOptionsForBackScreenWithNewNavColor");
  let options = {
    headerBackTitle: null,
    headerTitle: title,
    headerTitleStyle: styles.headerTitleStyleNew,
  };

  if (screenAfterWorkout == "ChallengeDashboard") {
    options.headerLeft = () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("ChallengeDashboard")}
      >
        <HeaderBackImage />
      </TouchableOpacity>
    );
  } else if (screenAfterWorkout == "Today") {
    options.headerLeft = () => (
      <TouchableOpacity onPress={() => navigation.navigate("Today")}>
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
    Menu: {
      screen: Menu,
      navigationOptions: () => ({
        headerStyle: {
          elevation: 0, //remove shadow on Android
          shadowOpacity: 0,
          shadowColor: "transparent",
          backgroundColor: color.navPink,
          borderBottomWidth: 0,
        },
        headerBackImage: <HeaderBackImage />,
        headerBackTitle: null,
        headerTitle: (
          <Image
            style={{ width: "70%" }}
            resizeMode="contain"
            source={require("./images/lsfFullLogo.png")}
          />
        ),
        headerTitleAllowFontScaling: false,
      }),
    },
    OutsideWorkout: {
      screen: OutsideWorkout,
      navigationOptions: ({ navigation }) => {
        return {
          title: null,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerTitle: "",
        };
      },
    },
    WeekAtGlance: {
      screen: WeekAtGlance,
      navigationOptions: ({ navigation }) => {
        return {
          title: null,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerLeft: null,
          headerTitle: "",
        };
      },
    },
    HydrationTracker: {
      screen: HydrationTracker,
      navigationOptions: ({ navigation }) => {
        const { videoListTitle } = navigation.state.params;
        return {
          title: null,
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
      },
    },
    CircuitOnlyDetails: {
      screen: CircuitOnlyDetails,
      navigationOptions: ({ navigation }) => {
        const { screenAfterWorkout } = navigation.state.params;

        return navOptionsForBackScreenWithNewNavColor(
          screenAfterWorkout,
          navigation,
          ""
        );
      },
    },
    Circuit: {
      screen: Circuit,
      navigationOptions: ({ navigation }) => {
        const { workoutTitle } = navigation.state.params;
        return {
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitle: workoutTitle.toUpperCase(),
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
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
    ComboDetail: {
      screen: ComboDetail,
      navigationOptions: ({ navigation }) => {
        const { workoutTitle, screenAfterWorkout } = navigation.state.params;

        return navOptionsForBackScreen(
          screenAfterWorkout,
          navigation,
          "ABS + CARDIO"
        );
      },
    },
    CardioDetail: {
      screen: CardioDetail,
      navigationOptions: ({ navigation }) => {
        const { workoutTitle, screenAfterWorkout } = navigation.state.params;

        return navOptionsForBackScreen(
          screenAfterWorkout,
          navigation,
          "CARDIO SWEAT SESH"
        );
      },
    },
    CardioSweatSesh: {
      screen: CardioDetail,
      navigationOptions: ({ navigation }) => {
        const { workoutTitle, screenAfterWorkout } = navigation.state.params;

        return {
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerTitle: "",
          headerTitleAllowFontScaling: false,
        };
      },
    },
    VideoList: {
      screen: VideoList,
      navigationOptions: ({ navigation }) => {
        const { videoListTitle } = navigation.state.params;
        return {
          title: videoListTitle.toUpperCase(),
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitle: "",
        };
      },
    },
    VideoLibraryDetail: {
      screen: VideoLibraryDetail,
      navigationOptions: ({ navigation }) => {
        const { videoListTitle, backToScreen } = navigation.state.params;
        console.log("navigation.state.params");
        console.log(navigation.state.params);
        return navOptionsForBackScreenWithNewNavColor(
          backToScreen,
          navigation,
          videoListTitle.toUpperCase()
        );
        // return {
        //   title: videoListTitle.toUpperCase(),
        //   headerBackImage: (<HeaderBackImage />),
        //   headerBackTitle: null,
        //   headerTitleStyle: styles.headerTitleStyle,
        //   headerTitleAllowFontScaling: false

        // }
      },
    },
    VideoSubCategory: {
      screen: VideoSubCategory,
      navigationOptions: ({ navigation }) => {
        const { videoListTitle } = navigation.state.params;
        return {
          title: videoListTitle.toUpperCase(),
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
      },
    },
    YoutubeList: {
      screen: YoutubeList,
      navigationOptions: ({ navigation }) => {
        const { videoListTitle } = navigation.state.params;
        return {
          title: videoListTitle.toUpperCase(),
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
      },
    },
    YoutubeCategories: {
      screen: YoutubeCategories,
      navigationOptions: ({ navigation }) => {
        return {
          title: "YOUTUBE",
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
      },
    },
    BonusChallenge: {
      screen: BonusChallenge,
      navigationOptions: () => {
        return {
          title: "BONUS CHALLENGE",
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
      },
    },
  },
  stackConfig
);

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
  headerTitleStyleNew: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "center",
    color: colorNew.darkPink,
  },
};
