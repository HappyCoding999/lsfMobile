import React from "react";
import { Image, View } from "react-native";
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import RootNavigator from '../../RootNavigator'
import Today from '../../screens/Today'
import RootNavigator1 from '../../RootNavigator1'
import ChallangeNavigator from '../../ChallangeNavigator'
// import { VideoLibrary } from "../../screens/Menu/Tabs";
import VideoLibraryNew from '../../screens/VideoLibraryNew'
import { color,colorNew} from "../../modules/styles/theme"
import HowItWorksScreen from "../Onboarding/Welcome/HowItWorksScreen";

const iconHeight = 15

const Tab = createBottomTabNavigator({
  Today: {
    screen: Today,
    navigationOptions: {
      tabBarLabel: "Home",
      tabBarIcon: ({ focused }) => (
        focused ?
          <Image style={{ width: iconHeight, height: iconHeight, resizeMode: 'contain',tintColor:colorNew.darkPink}} source={require('./images/home_sel.png')} /> :
          <Image style={{ width: iconHeight, height: iconHeight, resizeMode: 'contain' }} source={require('./images/home.png')} />
      )
    }
  },
  ChallangeNavigator: {
    screen: ChallangeNavigator,
    navigationOptions: {
      tabBarLabel: "Challenges",
      tabBarIcon: ({ focused }) => (
        focused ?
          <Image style={{ width: iconHeight, height: iconHeight ,tintColor:colorNew.darkPink}} source={require('./images/challanges_sel.png')} /> :
          <Image style={{ width: iconHeight, height: iconHeight }} source={require('./images/challanges.png')} />
      )
    }
  },
  VideoLibraryNew: {
    screen: VideoLibraryNew,
    navigationOptions: {
      tabBarLabel: "Videos",
      tabBarIcon: ({ focused }) => (
        focused ?
          <Image style={{ width: iconHeight, height: iconHeight, resizeMode: 'contain',tintColor:colorNew.darkPink }} source={require('./images/videos_sel.png')} /> :
          <Image style={{ width: iconHeight, height: iconHeight, resizeMode: 'contain' }} source={require('./images/videos.png')} />
      )
    }
  },
  RootNavigator1: {
    screen: RootNavigator1,
    navigationOptions: {
      tabBarLabel: "Goals",
      tabBarIcon: ({ focused }) => (
        focused ?
          <Image style={{ width: iconHeight, height: iconHeight, resizeMode: 'contain' ,tintColor:colorNew.darkPink}} source={require('./images/goals_sel.png')} /> :
          <Image style={{ width: iconHeight, height: iconHeight, resizeMode: 'contain' }} source={require('./images/goals.png')} />
      )
    }
  }
},
  {
    initialRouteName: "Today",
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      iconStyle: {
        paddingTop: 0,
        paddingBottom: 50,
      },
      showIcon: true,
      showLabel: true,
      activeBackgroundColor: "#fff",
      activeTintColor:colorNew.darkPink,
      inactiveBackgroundColor: "#fff"
    }
  }
);
export default createStackNavigator({
  Tab: {
    screen: Tab,
    navigationOptions: ({ screenProps }) => ({
      headerStyle: {
        backgroundColor: 'transparent',
      },
      header: null,
      headerTitleAllowFontScaling: false

    })
  },
  HowItWorks: {
    screen: screenProps => <HowItWorksScreen visible={true} {...screenProps} />,
    navigationOptions: () => ({
      headerTransparent: true,
      headerStyle: {
        backgroundColor: "transparent"
      },
      headerBackImage: (<View />),
      headerBackTitle: null,
      headerTitle: "",
      headerTitleAllowFontScaling: false
    })
  },
})