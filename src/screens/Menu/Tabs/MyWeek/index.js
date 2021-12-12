import React, { Component } from "react";
import { ActivityIndicator } from "react-native"
import { AsyncStorage } from 'react-native';
import PureWeek from "./MyWeek";
import WeekDayHeader from "./WeekDayHeader"
import eq from "deep-equal";
import { EventRegister } from "react-native-event-listeners";

export class MyWeek extends Component {
  completedWorkoutsWeek = [];
  dataFetched = false;
  shouldShowPaywall = true;

  shouldComponentUpdate(params, _nextState) {
    const { 
      level: previousLevel, 
      completedWorkouts: previousCompletedWorkouts, 
      weeklyWorkoutSchedule: previousWeeklyWorkoutSchedule
    } = this.props.screenProps;

    const { 
      level: newLevel, 
      completedWorkouts: newCompletedWorkouts,
      weeklyWorkoutSchedule: newWeeklyWorkoutSchedule
    } = params.screenProps;

    const levelChanged = previousLevel !== newLevel;
    const didCompleteWorkout = previousCompletedWorkouts.length < newCompletedWorkouts.length;
    const weeklyScheduleChanged = !eq(previousWeeklyWorkoutSchedule, newWeeklyWorkoutSchedule);

    if (this.dataFetched || levelChanged || didCompleteWorkout || weeklyScheduleChanged) {
      this.dataFetched = false;
      return true;
    }

    return false;
  }

  render() {
    const { weeklyProgram, completedWorkouts, weeklyWorkoutSchedule } = this.props.screenProps;

    if (!weeklyProgram || weeklyProgram.length === 0 || !completedWorkouts || !weeklyWorkoutSchedule) {
      return <ActivityIndicator size="large" />
    }

    return <PureWeek
      headerComponent={props => <WeekDayHeader completed={completedWorkouts} onDayPressed={this._onDayPressed} {...props} />}
      dataSource={weeklyWorkoutSchedule}
      onWorkoutPressed={this._onWorkoutPressed}
      onCalendarPressed={this._onCalendarPressed}
      onHeartPressed={this._onHeartPressed}
    />;
  }

  _onDayPressed = () => {
    this.props.navigation.navigate("Tracking")
  }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem('TODAY', JSON.stringify(data));
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }

  _onWorkoutPressed = workout => {
    const { primaryType, secondaryType } = workout;
    if (!primaryType && !secondaryType) {
      return;
    }

    let screen;

    // reinitialize paywall variable to continuiously check for paywall when switching between days
    this.shouldShowPaywall = true;

    if (isComboDetailWorkout(primaryType, secondaryType)) {
      screen = "ComboDetail";
      EventRegister.emit('paywallEvent', this._navigateToComboDetail);
    } else if (isCircuitOnlyWorkout(primaryType, secondaryType)) {
      screen = "CircuitOnlyDetails";
      this.shouldShowPaywall = false;
    } else {
      // screen = "CardioDetail";
      screen = "CardioSweatSesh";
      this.shouldShowPaywall = false;
    }
    console.log("\n\n\n")
    console.log("========== screen redriect ==========")
    console.log(screen)
    console.log("===========\n\n\n")

    const passedProps = {
      workout,
      navigationFunctions: {
        navigateToMenuTab: this._navigateToMenuTab
      },
      screenAfterWorkout: 'My Week'
    };

    if (!this.shouldShowPaywall) {
      this.props.navigation.navigate(screen, passedProps);
    }
  };

  _navigateToComboDetail = () => {
    this.shouldShowPaywall = false;
  }

  _navigateToMenuTab = (tabName) => {
    this.props.navigation.navigate(tabName);
  }

  _validateTabName = candidate => {
    const validNames = [
      "My Week",
      "Sweat Challenges",
      "Video Library",
    ];

    for (let name of validNames) {
      if (name === candidate) { return candidate; }
    }

    throw new Error(`${candidate} is not a valid Tab Name. Please use 'My Week', 'Sweat Challenges', or 'Video Library'.`)
  }

}

function isCircuitOnlyWorkout(primaryType, secondaryType) {
  return (
    primaryType === "Circuit"
    &&
    secondaryType === "Circuit"
  );
}

function isComboDetailWorkout(primaryType, secondaryType) {
  return (
    primaryType === "Circuit"
    &&
    secondaryType === "MISS Cardio" || secondaryType === "LISS Cardio" || secondaryType === "HIIT Cardio"
  );
}
