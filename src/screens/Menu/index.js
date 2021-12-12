import React, { Component } from "react";
import { connect } from "react-redux";
import MenuNav from "./Menu";

class MenuWrapper extends Component {
  static router = MenuNav.router;

  render() {
    const { navigation, screenProps: passedProps, completedWorkouts, weeklyProgram, challengeActive } = this.props;

    const screenProps = {
      ...passedProps,
      completedWorkouts,
      weeklyProgram,
      challengeActive
    };

    return <MenuNav 
      navigation={navigation}
      screenProps={screenProps}
    />;
  }
};

const mapStateToProps = ({ userData }) => ({
  completedWorkouts: userData.completedWorkouts,
  weeklyProgram: userData.weeklyProgram,
  challengeActive: userData.challengeActive
});

export default connect(mapStateToProps)(MenuWrapper);