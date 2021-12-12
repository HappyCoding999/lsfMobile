import React, { Component } from "react";
import { Image, Platform, TouchableOpacity, View } from "react-native";
import { createStackNavigator, NavigationActions } from "react-navigation";
import { color, colorNew } from "../../modules/styles/theme";
import SettingsLevel from "./SettingsLevel";
import SettingsSubscriptions from "./SettingsSubscriptions";
import {
  PlainHeader,
  PlainHeaderWithBack,
  Subscriptions as SubscriptionsModal,
} from "../../components/common";
import Settings from "./Settings";
import SettingsFAQ from "./SettingsFAQ";
import LinearGradient from "react-native-linear-gradient";
import { EventRegister } from "react-native-event-listeners";
import EditSettingsProfile from "../Settings/SettingsProfile";
import HeaderBackImage from "../../RootNavigator/HeaderBackImage";

export class HeaderBackImagePink extends Component {
  render() {
    const source = require("./images/iconBackArrow.png");
    return (
      <Image
        source={source}
        style={{ backgroundColor: "transparent", marginLeft: 13 }}
      />
    );
  }
}
class HeaderBackImageWhite extends Component {
  render() {
    const source = require("./images/iconBackArrow.png");
    return (
      <Image
        source={source}
        style={{
          backgroundColor: "transparent",
          marginLeft: 13,
          tintColor: "#fff",
        }}
      />
    );
  }
}
const styles = {
  challengeBannerText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontStyle: "normal",
    textAlign: "center",
    color: "#ec568f",
    textTransform: "uppercase",
  },
  welcomeHeader: {
    width: "90%",
    resizeMode: "contain",
  },
};
header = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        style={styles.welcomeHeader}
        source={require("./images/logo_white_love_seat_fitness.png")}
      />
    </View>
  );
};
navOptionsForBackToScreen = (screenToGoBack, navigation) => {
  // console.log("navOptionsForBackToScreen check");
  // console.log(screenToGoBack);
  // console.log(navigation);
  let options = {
    headerTransparent: true,
    headerStyle: {
      elevation: 0, //remove shadow on Android
      shadowOpacity: 0,
      height: 65,
      shadowColor: "transparent",
      backgroundColor: "transparent",
      borderBottomWidth: 0,
    },
    headerBackImage: null,
    headerBackTitle: null,
    headerTitle: null,
    headerTitleAllowFontScaling: false,
  };
  return options;
};

navOptionsForSubscriptionScreen = (navigation, screenProps) => {
  let options = {
    title: "",
    headerTransparent: false,
    headerBackground: (
      <LinearGradient
        colors={[colorNew.darkPink, colorNew.mediumPink]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    ),
    headerStyle: {
      height: 64,
    },
    headerBackImage: null,
    headerBackTitle: null,
    headerTitle: (
      <Image
        style={{ width: "100%", top: 0 }}
        resizeMode="contain"
        source={require("./images/logo_white_love_seat_fitness.png")}
      />
    ),
  };
  options.headerLeft = () => (
    <TouchableOpacity
      onPress={() => navigation.dispatch(NavigationActions.back())}
    >
      <HeaderBackImageWhite />
    </TouchableOpacity>
  );
  return options;
};

navOptionsWithBackButtonAndTitle = (navigation, screenProps, title) => {
  console.log("navOptionsWithBackButtonAndTitle");
  let backToScreen = navigation.state.params
    ? navigation.state.params.backToScreen
    : "";
  let options = {
    title: title,
    headerTransparent: false,
    headerBackground: (
      <LinearGradient
        colors={[colorNew.darkPink, colorNew.mediumPink]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    ),
    headerStyle: {
      height: 64,
    },
    headerBackImage: null,
    headerBackTitle: null,
    headerTitleStyle: {
      height: 24,
      fontFamily: "SF Pro Text",
      fontSize: 18,
      fontWeight: "bold",
      fontStyle: "normal",
      lineHeight: 24,
      letterSpacing: 1,
      textAlign: "center",
      headerTitleAllowFontScaling: false,
      color: "#fff",
    },
  };
  options.headerLeft = () => (
    <TouchableOpacity
      onPress={() =>
        backToScreen != ""
          ? navigation.navigate(backToScreen)
          : navigation.dispatch(NavigationActions.back())
      }
    >
      <HeaderBackImageWhite />
    </TouchableOpacity>
  );
  return options;
};

// export default createStackNavigator({

const SettingsStack = createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: ({ screenProps, navigation }) => {
      console.log("SettingsStack");
      if (navigation.state.params) {
        var mainNav = navigation.state.params.mainNav;
        var backToScreen = navigation.state.params.backToScreen;
        console.log("SettingsStack : " + navigation);
        console.log("screenProps : " + screenProps);
        return navOptionsForBackToScreen(backToScreen, navigation);
      }
      return navOptionsWithBackButtonAndTitle(
        navigation,
        screenProps,
        "Settings"
      );
    },
  },
  Subscriptions: {
    screen: ({ screenProps, navigation }) => (
      <SubscriptionsModal onClose={() => navigation.navigate("Settings")} />
    ),
    navigationOptions: {
      header: null,
    },
  },
  // SettingsLevel: {
  //   screen: SettingsLevel,
  //   navigationOptions: () => ({
  //     headerTransparent: true,
  //     headerStyle: {
  //       backgroundColor: color.lightPink
  //     },
  //     headerBackImage: (<HeaderBackImagePink />),
  //     headerTitleStyle: {
  //       width: "100%",
  //       height: 24,
  //       fontFamily: "SF Pro Text",
  //       fontSize: 15,
  //       fontWeight: "bold",
  //       fontStyle: "normal",
  //       lineHeight: 24,
  //       letterSpacing: 1,
  //       textAlign: "center",
  //       color: color.hotPink
  //     },
  //     headerBackTitle: null,
  //     headerTitle: "FITNESS LEVEL",
  //     headerTitleAllowFontScaling: false

  //   })
  // },
  SettingsLevel: {
    screen: SettingsLevel,
    navigationOptions: ({ screenProps, navigation }) => {
      console.log("SettingsLevel in SettingsStack");
      console.log(navigation);
      console.log(screenProps);
      return navOptionsWithBackButtonAndTitle(
        navigation,
        screenProps,
        "FITNESS LEVEL"
      );
    },
  },
  SettingsSubscriptions: {
    screen: SettingsSubscriptions,
    navigationOptions: ({ screenProps, navigation }) => {
      console.log("SettingsSubscriptions in SettingsStack");
      // console.log(screenProps)
      // console.log(navigation)
      /*return {
          title: '',
          headerTransparent: false,
          headerBackground: (
            <LinearGradient
              colors={[colorNew.darkPink, colorNew.mediumPink]}
              style={{ flex: 1 }}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
            />
          ),
          headerStyle: {
            height: 64,
          },
          headerBackImage: (<HeaderBackImageWhite />),
          headerBackTitle: null,
          headerTitle: (
            <Image style={{ width: '100%',top:0}} resizeMode="contain" source={require('./images/logo_white_love_seat_fitness.png')} />
          ),
        }*/
      return navOptionsForSubscriptionScreen(navigation, screenProps);
    },
  },
  SettingsFAQ: {
    screen: SettingsFAQ,
    navigationOptions: ({ screenProps, navigation }) => {
      console.log("SettingsLevel in SettingsStack");
      return navOptionsWithBackButtonAndTitle(navigation, screenProps, "FAQ");
    },
  },
  EditProfile: {
    screen: EditSettingsProfile,
    navigationOptions: ({ navigation }) => {
      return {
        title: "EDIT PROFILE",
        headerBackImage: <HeaderBackImage />,
        headerBackTitle: null,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleAllowFontScaling: false,
      };
    },
  },
});

export const navOptionsForTabScreen = (showHeader, navigation) => {
  let options = {
    title: "",
    headerTransparent: true,
    headerStyle: {
      elevation: 0, //remove shadow on Android
      shadowOpacity: 0,
      height: 0,
      shadowColor: "transparent",
      backgroundColor: "transparent",
      borderBottomWidth: 0,
    },
    headerBackImage: null,
    headerBackTitle: null,
    headerTitle: null,
    headerLeft: null,
    headerTitleAllowFontScaling: false,
  };
  if (showHeader) {
    const headerStyle = {
      backgroundColor: Platform.select({
        ios: "transparent",
        android: colorNew.darkPink,
      }),
    };

    options = {
      ...options,
      header: (
        <PlainHeaderWithBack
          style={headerStyle}
          onLeftPress={navigation.pop}
          greyGear
        />
      ),
      headerBackImage: <HeaderBackImageWhite />,
    };
  }
  return options;
};

export default SettingsStack;
