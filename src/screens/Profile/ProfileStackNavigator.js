import React from "react";
import { Image } from "react-native";
import { createStackNavigator, SafeAreaView } from "react-navigation";
import { color } from "../../modules/styles/theme";
import Tabs from "./tabs";
import ProfileHeader from "./ProfileHeader";
import EntryDetail from "../Profile/tabs/Tracking/EntryDetail";
import Settings from "../Settings";
import EditSettingsProfile from "../Settings/SettingsProfile";
import NewEntry from "./tabs/Tracking/NewEntry";
import Measurements from "./tabs/Tracking/Measurements";
import MeasurementList from "./tabs/Tracking/Measurements/MeasurementList";

HeaderBackImage = () => {
  const source = require("./images/iconBackArrow.png");

  return (
    <Image
      source={source}
      style={{ backgroundColor: "transparent", marginLeft: 13 }}
    />
  );
};

const stackConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: color.navPink,
      elevation: 0,
    },
    title: "Love Sweat Fitness!",
    transparentCard: true,
    headerBackTitle: null,
  },
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

export default createStackNavigator(
  {
    Tabs: {
      screen: Tabs,
      navigationOptions: ({ screenProps, navigation }) => ({
        header: () => {
          const {
            name,
            userName,
            userLevel,
            avatar,
            onLogout,
            onDeleteUser,
            instagram,
            membership,
          } = screenProps;
          const headerProps = {
            name,
            userName,
            userLevel,
            avatar,
            onLogout,
            onDeleteUser,
            instagram,
            membership,
          };
          return (
            <SafeAreaView
              style={{ backgroundColor: color.navPink }}
              forceInset={{ top: "always", bottom: "always" }}
            >
              <ProfileHeader
                {...headerProps}
                onSprocketPress={() => navigation.navigate("ProfileSettings")}
                onLevelPress={() => navigation.navigate("ProfileSettings")}
              />
            </SafeAreaView>
          );
        },
      }),
    },
    EntryDetail: {
      screen: EntryDetail,
      navigationOptions: () => {
        return {
          headerBackImage: <HeaderBackImage />,
          headerBackTitle: null,
          headerTitle: "SWEAT LOG",
          headerTitleStyle: styles.headerTitleStyle,
          headerTitleAllowFontScaling: false,
        };
      },
    },
    ProfileSettings: {
      screen: Settings,
      navigationOptions: {
        header: null,
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
    NewEntry: {
      screen: NewEntry,
      navigationOptions: {
        header: null,
      },
    },
    MeasurementList: {
      screen: MeasurementList,
      navigationOptions: {
        title: "PROGRESS HISTORY",
        headerBackImage: <HeaderBackImage />,
        headerBackTitle: null,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleAllowFontScaling: false,
      },
    },
    Measurements: {
      screen: Measurements,
      navigationOptions: {
        title: "PROGRESS HISTORY",
        headerBackImage: <HeaderBackImage />,
        headerBackTitle: null,
        headerTitleStyle: styles.headerTitleStyle,
        headerTitleAllowFontScaling: false,
      },
    },
  },
  stackConfig
);
