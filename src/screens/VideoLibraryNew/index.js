import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { createStackNavigator, SafeAreaView } from "react-navigation";
import { color, colorNew } from "../../modules/styles/theme";
import VideoLibraryMenu from "./VideoLibraryMenu";
import VideoLibraryHeader from "./VideoLibraryHeader/VideoLibraryHeader";
// import Menu from "../../screens/Menu";
import VideoList from "../../screens/VideoLibraryNew/VideoLibraryMenu/Tabs/VideoLibrary/VideoList";
import VideoLibraryDetail from "../../screens/Menu/Tabs/VideoLibrary/VideoLibraryDetail";
import VideoSubCategory from "../../screens/Menu/Tabs/VideoLibrary/VideoSubCategory";
import BonusChallenge from "../../screens/Menu/Tabs/SweatChallenges/BonusChallenge";
import YoutubeList from "../../screens/Menu/Tabs/VideoLibrary/YoutubeList";
import Profile from "../../screens/Profile";
import YoutubeCategories from "../../screens/Menu/Tabs/VideoLibrary/YoutubeCategories";

import Settings from "../../screens/Settings";
import { navOptionsForTabScreen } from "../Settings/SettingsStack";
import { CastButton } from "react-native-google-cast";

const stackConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: "#fff",
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
  } else if (screenAfterWorkout == "Today") {
    options.headerLeft = () => (
      <TouchableOpacity
        onPress={() => {
          navigation.pop();
          navigation.navigate("Today");
        }}
      >
        <HeaderBackImage />
      </TouchableOpacity>
    );
  } else {
    options.headerBackImage = <HeaderBackImage />;
  }

  return options;
};

// alert("selected_tab_index: " + payload.action.params.selected_tab_index);

export default createStackNavigator(
  {
    Menu: {
      screen: VideoLibraryMenu,
      navigationOptions: ({ screenProps, navigation }) => ({
        header: () => {
          // alert("selected_tab_index: " + JSON.stringify(screenProps));

          return <View></View>;
        },
        // header: () => {
        //   const {
        //     name,
        //     userName,
        //     userLevel,
        //     avatar,
        //     onLogout,
        //     instagram,
        //     membership,
        //   } = screenProps;
        //   const headerProps = {
        //     name,
        //     userName,
        //     userLevel,
        //     avatar,
        //     onLogout,
        //     instagram,
        //     membership,
        //     navigation,
        //     ...screenProps,
        //   };

        //   return (
        //     <SafeAreaView
        //       style={{ backgroundColor: colorNew.bgGrey }}
        //       forceInset={{ top: "always" }}
        //     >
        //       <VideoLibraryHeader {...headerProps} />
        //     </SafeAreaView>
        //   );
        // },
      }),
    },
    Settings: {
      screen: Settings,
      navigationOptions: ({ screenProps, navigation }) => {
        const { routes } = navigation.state;

        const showHeader = routes.length == 1;

        return navOptionsForTabScreen(showHeader, navigation);
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
          headerRight: (
            <View
              style={{
                height: 30,
                width: 30,
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CastButton
                style={{ width: 24, height: 24, tintColor: "#FF4992" }}
              />
            </View>
          ),
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
        return navOptionsForBackScreen(
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
};
