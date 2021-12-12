import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import Goals from "./Goals";
import { saveSweatLog, saveWeightGoal, saveWeight, saveMeasurement,updateMeasurement,saveBottleCount } from "../../actions";



class GoalsWrapper extends Component {
  
  render() {
    // var showTrophy = this.props.navigation.state.params.showTrophy != undefined ? this.props.navigation.state.params.showTrophy : false;
    var showTrophy = false;
    if (this.props.navigation.state.params != undefined) 
    {
      showTrophy = this.props.navigation.state.params.showTrophy != undefined ? this.props.navigation.state.params.showTrophy : false;  
    }
    const { navigation, screenProps: passedProps, completedWorkouts, weeklyProgram, challengeActive } = this.props;
    const { name, userName, level, avatar, sweatLogs, completedBonusChallenges, selfCareLogs, filteredChallengeLogs,historicalWeight } = this.props.screenProps;
    const screenProps = {
      ...passedProps,
      completedWorkouts,
      weeklyProgram,
      challengeActive,
      name, 
      historicalWeight,
      userName, 
      level, 
      avatar, 
      sweatLogs, 
      saveSweatLog: this.props.saveSweatLog,
      saveBottleCount: this.props.saveBottleCount,
      saveWeightGoal: this.props.saveWeightGoal,
      saveWeight: this.props.saveWeight,
      onSubmit: data => this.props.saveMeasurement(data),
      updateMeasurement: data => this.props.updateMeasurement(data),
      completedBonusChallenges, 
      completedWorkouts, 
      selfCareLogs,
      filteredChallengeLogs 
    };
    return (
        <View>
          <Goals 
            navigation={this.props.navigation}
            screenProps={screenProps}
            showTrophy={showTrophy}
          />
        </View>
      );
  }
};

const mapStateToProps = ({ userData }) => ({
  completedWorkouts: userData.completedWorkouts,
  weeklyProgram: userData.weeklyProgram,
  challengeActive: userData.challengeActive
});

export default connect(mapStateToProps, { saveSweatLog, saveWeightGoal, saveWeight, saveMeasurement,updateMeasurement,saveBottleCount})(GoalsWrapper);