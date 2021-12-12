import React from 'react';
import { Image, TouchableOpacity } from "react-native";
import { createStackNavigator } from "react-navigation";
import { color, colorNew } from "../modules/styles/theme";
import Goals from "../screens/Goals";
import NewEntry from "../screens/Profile/tabs/Tracking/NewEntry"
import Measurements from "../screens/Profile/tabs/Tracking/Measurements";
import ProgressPhotoBuilder from "../screens/ProgressPhotoBuilder";
import JournalReview from "../screens/Journal/Review";
import SweatLog from "../screens/Journal/SweatLog";
import Trophies from "../screens/Profile/tabs/Trophies";
import MeasurementList from "../screens/Profile/tabs/Tracking/Measurements/MeasurementList";
import Journal from "../screens/Journal";
import Settings from "../screens/Settings";
import { navOptionsForTabScreen } from "../screens/Settings/SettingsStack";

import HeaderBackImage from "./HeaderBackImage";
import HeaderBackImageWhite from "./HeaderBackImageWhite";
import { logo_white_love_seat_fitness } from "../images";

const stackConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: color.navPink,
      elevation: 0
    },
    transparentCard: true
  },
  headerLayoutPreset: "center"
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
    color: color.hotPink
  }
};
navOptionsForBackScreen = (screenAfterWorkout, navigation, title) => {

  let options = {
    headerBackTitle: null,
    headerTitle: title,
    headerTitleStyle: styles.headerTitleStyle,
  }

  if (screenAfterWorkout == 'ChallengeDashboard') {
    options.headerLeft = () => (
      <TouchableOpacity onPress={() => navigation.navigate('ChallengeDashboard')}>
        <HeaderBackImage />
      </TouchableOpacity>
    )
  } else {
    options.headerBackImage = (<HeaderBackImage />)
  }

  return options;
}


export default createStackNavigator({
  Goals: {
    screen: Goals,
     navigationOptions: ({ screenProps }) => ({
      headerStyle: {
        backgroundColor: 'transparent',
      },
      header: null,
      headerTitleAllowFontScaling: false
    })
  },
  Trophies: {
    screen: Trophies,
    navigationOptions: () => ({
      headerStyle: {
        elevation: 0,       //remove shadow on Android
        shadowOpacity: 0,
        height: 80,
        shadowColor: 'transparent',
        backgroundColor: colorNew.darkPink,
        borderBottomWidth: 0
      },
      headerBackImage: (<HeaderBackImageWhite />),
      headerBackTitle: null,
      headerTitle: (
        <Image style={{ width: '85%',top:0}} resizeMode="contain" source={logo_white_love_seat_fitness} />
      ),
      headerTitleAllowFontScaling: false
    })
  },
  SweatLog: {
    screen: SweatLog,
    navigationOptions: {
      header: null
    }
  },
  Journal: {
    screen: Journal,
    navigationOptions: {
      header: null
    }
  },
  JournalReview: {
    screen: JournalReview,
    navigationOptions: () => ({
      headerStyle: {
        elevation: 0,       //remove shadow on Android
        shadowOpacity: 0,
        height: 80,
        shadowColor: 'transparent',
        backgroundColor: colorNew.darkPink,
        borderBottomWidth: 0
      },
      headerBackImage: (<HeaderBackImageWhite />),
      headerBackTitle: null,
      headerTitle: (
        <Image style={{ width: '85%',top:0}} resizeMode="contain" source={logo_white_love_seat_fitness} />
      ),
      headerTitleAllowFontScaling: false
    })
  },
  Measurements: {
    screen: Measurements,
    navigationOptions: () => ({
      headerStyle: {
        elevation: 0,       //remove shadow on Android
        shadowOpacity: 0,
        height: 80,
        shadowColor: 'transparent',
        backgroundColor: colorNew.darkPink,
        borderBottomWidth: 0
      },
      headerBackImage: (<HeaderBackImageWhite />),
      headerBackTitle: null,
      headerTitle: (
        <Image style={{ width: '85%',top:0}} resizeMode="contain" source={require('./images/logo_white_love_seat_fitness.png')} />
      ),
      headerTitleAllowFontScaling: false
    })
  },
  MeasurementList: {
    screen: MeasurementList,
    navigationOptions: () => ({
      headerStyle: {
        elevation: 0,       //remove shadow on Android
        shadowOpacity: 0,
        height: 80,
        shadowColor: 'transparent',
        backgroundColor: colorNew.darkPink,
        borderBottomWidth: 0
      },
      headerBackImage: (<HeaderBackImageWhite />),
      headerBackTitle: null,
      headerTitle: (
        <Image style={{ width: '85%',top:0}} resizeMode="contain" source={require('./images/logo_white_love_seat_fitness.png')} />
      ),
      headerTitleAllowFontScaling: false
    })
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({screenProps, navigation }) => {
      const { routes } = navigation.state;

      const showHeader = routes.length == 1
      
      return navOptionsForTabScreen(showHeader, navigation)
    },
  },
  ProgressPhotoBuilder: {
    screen: ProgressPhotoBuilder,
    navigationOptions: {
      header: null
    }
  },
  NewEntry: {
    screen: NewEntry,
    navigationOptions: {
      header: null
    }
  }
}, stackConfig);

