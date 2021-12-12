import React, { Component } from "react";
import { connect } from "react-redux";
import { View, SafeAreaView } from "react-native";
import VideoLibraryMenuNav from "./VideoLibraryMenu";
import VideoLibraryHeader from "../VideoLibraryHeader/VideoLibraryHeader";
import { color, colorNew } from "../../../modules/styles/theme";

class VideoLibraryMenuWrapper extends Component {
  static router = VideoLibraryMenuNav.router;

  render() {
    const {
      navigation,
      screenProps: passedProps,
      completedWorkouts,
      weeklyProgram,
      challengeActive,
    } = this.props;

    const screenProps = {
      ...passedProps,
      completedWorkouts,
      weeklyProgram,
      challengeActive,
    };

    const {
      name,
      userName,
      userLevel,
      avatar,
      onLogout,
      instagram,
      membership,
    } = this.props.screenProps;
    const headerProps = {
      name,
      userName,
      userLevel,
      avatar,
      onLogout,
      instagram,
      membership,
      ...this.props.screenProps,
    };

    return (
      <VideoLibraryMenuNav navigation={navigation} screenProps={screenProps} />
    );
  }
}
const mapStateToProps = ({ userData }) => ({
  completedWorkouts: userData.completedWorkouts,
  weeklyProgram: userData.weeklyProgram,
  challengeActive: userData.challengeActive,
});

export default connect(mapStateToProps)(VideoLibraryMenuWrapper);
