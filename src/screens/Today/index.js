import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity, Dimensions } from "react-native";
import Today from "./Today";
import { createStackNavigator } from "react-navigation";
import { color, colorNew } from "./../../modules/styles/theme";
import { connect } from "react-redux";
import SettingsLevel from "../Settings/SettingsLevel";
import { HeaderBackImagePink } from "../Settings/SettingsStack";

import {
  saveBottleCount,
  saveWeeklyWorkout,
  saveCompletedWorkout,
  saveWeightGoal,
  saveWeight,
  fetchPlaylistData,
  clearPlaylistData,
  authorizeSpotify,
  resetSpotifyAuthFlow,
  setCurrentPlaylistTracks,
  flagChallenge,
  saveWorkoutForChallenge,
  saveChallengeWorkout,
  setHasSeenHowItWorks,
  saveLevel,
} from "../../actions";

import NotificationModal from "../NotificationModal";
import { User } from "../../DataStore";
import moment from "moment";
import ChallengeDashboard from "../ChallengeDashboard";
import OutsideWorkout from "../OutsideWorkout";
import WeekAtGlance from "../WeekAtGlance";
import CircuitOnlyDetails from "../Workouts/CircuitOnlyDetails";
import ComboDetail from "../Workouts/ComboDetail";
import CardioDetail from "../Workouts/CardioSweatSesh";
import Profile from "../Profile";
import Settings from "../Settings";
import HeaderBackImage from "../../RootNavigator/HeaderBackImage";
import HeaderBackImageWhite from "../../RootNavigator/HeaderBackImageWhite";
import LinearGradient from "react-native-linear-gradient";
import Trophies from "../../screens/Profile/tabs/Trophies";
import { logo_white_love_seat_fitness, icon_close_x_white } from "../../images";
import HowItWorksScreen from "../Onboarding/Welcome/HowItWorksScreen";
import { PlainHeader } from "../../components/common";
import { navOptionsForTabScreen } from "../Settings/SettingsStack";
import EditSettingsProfile from "../Settings/SettingsProfile";
const { width, height } = Dimensions.get("window");

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
  challengeBannerText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontStyle: "normal",
    textAlign: "center",
    color: "#ec568f",
    textTransform: "uppercase",
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
    color: color.black,
  },
  linearGradient: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeHeader: {
    width: "90%",
    resizeMode: "contain",
  },
};

header = () => {
  const colors = [colorNew.darkPink, colorNew.mediumPink];
  return (
    <View
      style={{
        flex: 1,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={colors}
        style={[StyleSheet.absoluteFill, styles.linearGradient]}
      >
        <Image
          style={styles.welcomeHeader}
          source={require("./images/welcomeHeader.png")}
        />
      </LinearGradient>
    </View>
  );
};

headerTitle = () => {
  return (
    <View style={{ width: "100%", textAlign: "center" }}>
      <Text style={[styles.challengeBannerText, { fontWeight: "bold" }]}>
        Today's goal:
      </Text>
      <Text style={styles.challengeBannerText}>
        {" "}
        Sweat sesh + daily 10 + bonus
      </Text>
    </View>
  );
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
  let options = {
    headerTransparent: true,
    headerStyle: {
      backgroundColor: "transparent",
    },
    headerBackTitle: null,
    headerTitle: title,
    headerTitleStyle: styles.headerTitleStyleNew,
  };

  if (screenAfterWorkout == "ChallengeDashboard") {
    options.headerLeft = () => (
      <TouchableOpacity
        onPress={() => navigation.navigate("ChallengeDashboard")}
      >
        <HeaderBackImageWhite />
      </TouchableOpacity>
    );
  } else {
    options.headerBackImage = <HeaderBackImageWhite />;
  }

  return options;
};
navOptionsForBackToMainScreen = (screenAfterWorkout, navigation, title) => {
  let options = {
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      height: 80,
      shadowColor: "transparent",
      backgroundColor: colorNew.darkPink,
      borderBottomWidth: 0,
    },
    headerBackTitle: null,
    headerTitle: (
      <Image
        style={{ width: "85%", top: 0 }}
        resizeMode="contain"
        source={logo_white_love_seat_fitness}
      />
    ),
    headerTitleAllowFontScaling: false,
  };
  options.headerLeft = () => (
    <TouchableOpacity onPress={() => navigation.navigate("Today")}>
      <HeaderBackImageWhite />
    </TouchableOpacity>
  );
  return options;
};
const TodayPage = createStackNavigator(
  {
    Today: {
      screen: Today,
      navigationOptions: ({ screenProps }) => ({
        headerStyle: {
          backgroundColor: "transparent",
        },
        header: null,
        headerTitleAllowFontScaling: false,
      }),
    },
    Trophies: {
      screen: Trophies,
      navigationOptions: ({ screenProps, navigation }) => {
        const { backToScreen } = navigation.state.params;
        console.log(backToScreen);
        return navOptionsForBackToMainScreen(backToScreen, navigation, "");
      },
    },
    CardioDetail: {
      screen: CardioDetail,
      navigationOptions: ({ screenProps, navigation }) => {
        const { workoutTitle, screenAfterWorkout } = navigation.state.params;

        return navOptionsForBackScreenWithNewNavColor(
          screenAfterWorkout,
          navigation,
          ""
        );
      },
    },
    CircuitOnlyDetails: {
      screen: CircuitOnlyDetails,
      navigationOptions: ({ screenProps, navigation }) => {
        const { screenAfterWorkout } = navigation.state.params;

        return navOptionsForBackScreenWithNewNavColor(
          screenAfterWorkout,
          navigation,
          ""
        );
      },
    },
    ComboDetail: {
      screen: ComboDetail,
      navigationOptions: ({ screenProps, navigation }) => {
        const { workoutTitle, screenAfterWorkout } = navigation.state.params;
        return navOptionsForBackScreenWithNewNavColor(
          screenAfterWorkout,
          navigation,
          ""
        );
        // return navOptionsForBackScreen(screenAfterWorkout, navigation, 'ABS + CARDIO');
      },
    },
    OutsideWorkout: {
      screen: OutsideWorkout,
      navigationOptions: ({ screenProps, navigation }) => {
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
      navigationOptions: ({ screenProps, navigation }) => {
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
    Settings: {
      screen: Settings,
      navigationOptions: ({ screenProps, navigation }) => {
        const { routes } = navigation.state;

        const showHeader = routes.length == 1;

        return navOptionsForTabScreen(showHeader, navigation);
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
    SettingsLevel: {
      screen: SettingsLevel,
      navigationOptions: () => ({
        title: "FITNESS LEVEL",
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
        headerBackImage: <HeaderBackImageWhite />,
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
      }),
      // navigationOptions: () => ({
      //   headerTransparent: true,
      //   headerStyle: {
      //     backgroundColor: color.lightPink,
      //     height: 64,
      //   },
      //   headerBackImage: <HeaderBackImagePink />,
      //   headerTitleStyle: {
      //     width: "100%",
      //     height: 24,
      //     fontFamily: "SF Pro Text",
      //     fontSize: 15,
      //     fontWeight: "bold",
      //     fontStyle: "normal",
      //     lineHeight: 24,
      //     letterSpacing: 1,
      //     textAlign: "center",
      //     color: color.hotPink,
      //   },
      //   headerBackTitle: null,
      //   headerTitle: "FITNESS LEVEL",
      //   headerTitleAllowFontScaling: false,
      // }),
    },
  },
  stackConfig
);

class TodayWrapper extends Component {
  static router = TodayPage.router;

  state = {
    showNotificationModal: true,
  };

  render() {
    const screenProps = {
      ...this.props.screenProps,
      goals: this.props.goals,
      saveWeeklyWorkout: this.props.saveWeeklyWorkout,
      saveBottleCount: this.props.saveBottleCount,
      saveCompletedWorkout: this.props.saveCompletedWorkout,
      saveWeightGoal: this.props.saveWeightGoal,
      saveWeight: this.props.saveWeight,
      fetchPlaylistData: this.props.fetchPlaylistData,
      clearPlaylistData: this.props.clearPlaylistData,
      spotifyLoggedIn: this.props.spotifyLoggedIn,
      authorizeSpotify: this.props.authorizeSpotify,
      currentPlaylist: this.props.currentPlaylist,
      trackList: this.props.trackList,
      spotifyAuthCancelled: this.props.spotifyAuthCancelled,
      resetSpotifyAuthFlow: this.props.resetSpotifyAuthFlow,
      ssuChallenge: this.props.ssuChallenge,
      bootyChallenge: this.props.bootyChallenge,
      flagChallenge: this.props.flagChallenge,
      saveChallengeWorkout: this.props.saveChallengeWorkout,
      saveWorkoutForChallenge: this.props.saveWorkoutForChallenge,
      sleighChallenge: this.props.sleighChallenge,
      refreshIn21Challenge: this.props.refreshIn21Challenge,
      lotsOfLoveChallenge: this.props.lotsOfLoveChallenge,
      springSlimDownChallenge: this.props.springSlimDownChallenge,
      user: this.props.user,
      joinedChallenge: this.props.screenProps.joinedChallenge,
      saveLevel: this.props.saveLevel,
    };

    return (
      <View style={{ flex: 1 }}>
        <TodayPage
          navigation={this.props.navigation}
          screenProps={screenProps}
        />
        {this._renderNotificationModal()}
      </View>
    );
  }

  _renderNotificationModal() {
    const { showNotificationModal } = this.state;
    const { notificationQueue } = this.props.screenProps;
    const notificationsPresent = notificationQueue.length > 0;

    if (notificationsPresent) {
      const { message, renderImage } = this._getNotificationData();
      return (
        <NotificationModal
          message={message}
          buttonText="VISIT TROPHY CASE"
          onButtonPress={this._onButtonPress}
          onClose={this._onClose}
          renderImage={renderImage}
          visible={showNotificationModal && notificationsPresent}
        />
      );
    }

    return null;
  }

  _getNotificationData() {
    const { notificationQueue } = this.props.screenProps;

    if (notificationQueue.length > 1) {
      return {
        message:
          "You have new achievements!  Visit the Trophy Case to view your new trophies!",
        renderImage: () => null,
      };
    }

    const [notification] = notificationQueue;
    const { notificationCopy, trophyImageUrl } = notification;

    return {
      message: notificationCopy,
      renderImage: () => (
        <Image
          source={{ uri: trophyImageUrl }}
          style={{ height: width * 0.5, width: width * 0.5 }}
          resizeMode={"contain"}
        />
      ),
    };
  }

  _onButtonPress = () => {
    User.flushNotificationQueue().catch((err) => console.log(err.stack));
    const passedProps = {
      showTrophy: true,
    };
    this.props.navigation.navigate("Goals", passedProps);
    this.setState({
      showNotificationModal: false,
    });
  };

  _onClose = () => {
    console.log("close notification!");
    User.flushNotificationQueue().catch((err) => console.log(err.stack));
    this.setState({ showNotificationModal: false });
  };
}

mapStateToProps = ({ userData, appData }) => ({
  goals: userData.goals,
  spotifyLoggedIn: appData.spotifyAuthorized,
  currentPlaylist: appData.currentPlaylist,
  trackList: appData.trackList,
  spotifyAuthCancelled: appData.spotifyAuthCancelled,
  ssuChallenge: userData.ssuChallenge,
  nutritionPlan: userData.nutritionPlan,
  bootyChallenge: userData.bootyChallenge,
  sleighChallenge: userData.sleighChallenge,
  refreshIn21Challenge: userData.refreshIn21Challenge,
  lotsOfLoveChallenge: userData.lotsOfLoveChallenge,
  springSlimDownChallenge: userData.springSlimDownChallenge,
  currentWeek: userData.currentWeek,
  user: userData,
});

const actions = {
  saveBottleCount,
  saveWeeklyWorkout,
  saveCompletedWorkout,
  saveWeightGoal,
  saveWeight,
  fetchPlaylistData,
  clearPlaylistData,
  authorizeSpotify,
  resetSpotifyAuthFlow,
  setCurrentPlaylistTracks,
  flagChallenge,
  saveWorkoutForChallenge,
  saveChallengeWorkout,
  setHasSeenHowItWorks,
  saveLevel,
};

export default connect(mapStateToProps, actions)(TodayWrapper);
