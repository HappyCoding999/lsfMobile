import React, { Component } from "react";
import { connect } from "react-redux";
import { InteractionManager } from "react-native";
import { saveWeightGoal, saveWeight } from "../../actions";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { getAchievements } from "../../DataStore";

class ProfileStackNavigatorWrapper extends Component {
  static router = ProfileStackNavigator.router;

  state = {
    achievementTable: null,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._fetchAchievementTable();
    });
  }

  render() {
    const { achievementTable } = this.state || {};

    if (this.props.screenProps) {
      const {
        userName,
        level,
        avatar,
        name,
        renderVideoModal,
        openVideoModal,
        onLogout,
        onDeleteUser,
        goals,
        achievements,
        measurements,
        historicalWeight,
        selfCareLogs,
        sweatLogs,
        completedWorkouts,
        completedBonusChallenges,
        membership,
      } = this.props.screenProps;

      return (
        <ProfileStackNavigator
          navigation={this.props.navigation}
          screenProps={{
            userName,
            userLevel: level,
            avatar,
            name,
            renderVideoModal,
            openVideoModal,
            onLogout,
            onDeleteUser,
            goals,
            achievements,
            measurements,
            historicalWeight,
            achievementTable,
            selfCareLogs,
            sweatLogs,
            completedWorkouts,
            completedBonusChallenges,
            membership,
            saveWeightGoal: this.props.saveWeightGoal,
            saveWeight: this.props.saveWeight,
            filteredChallengeLogs: this.props.filteredChallengeLogs,
          }}
        />
      );
    }

    return null;
  }

  _fetchAchievementTable() {
    getAchievements()
      .then((achievementTable) => this.setState({ achievementTable }))
      .catch((err) => console.log(err.stack));
  }
}

mapStateToProps = ({ userData }) => ({
  filteredChallengeLogs: userData.filteredChallengeLogs,
});

export default connect(mapStateToProps, { saveWeightGoal, saveWeight })(
  ProfileStackNavigatorWrapper
);
