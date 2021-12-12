import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { color } from '../modules/styles/theme';

const tabBarOptions = {
  activeTintColor: color.hotPink,
  inactiveTintColor: color.black,
  labelStyle: {
    fontSize: 12
  },
  style: {
    backgroundColor: color.navPink,
    elevation: 0
  }
};


export default ({ tabs }) => {
  const { MyWeek, SweatChallenges, VideoLibrary } = tabs;

  const Nav = createMaterialTopTabNavigator({
    "My Week": {
      screen: MyWeek
    },
    "Sweat Challenges": {
      screen: SweatChallenges,
      screenProps: {}
    },
    "Video Library": {
      screen: VideoLibrary,
      screenProps: {}
    }
  }, {
    tabBarOptions
  });
  return <Nav />;
};

