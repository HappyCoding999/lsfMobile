import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { connect } from "react-redux";

import { saveWeightGoal, saveWeight } from "../../../actions";
import NewGoalModal from "../../Profile/tabs/Goals/NewGoalModal";

import HydrationTracker from "../../../screens/HydrationTracker";
import { Card } from "./Card";
import SweatStreak from "./SweatStreak";
const { width, height } = Dimensions.get("window");

const upwardTrend = require("../images/up.png");
const downwardTrend = require("../images/down.png");

class GoalsCard extends Component {
  constructor() {
    super();

    this.state = {
      goalList: ["1", "2", "3", "4"],
      startingWeight: "",
      refreshGoal: false,
      showHydrationTracker: false,
      showWeightGoal: false,
      currentWeightGoal: null,
      currentWeight: null,
      startingWeight: null,
    };
  }

  componentDidMount() {
    const { goals } = this.props;
    if (goals != undefined) {
      this.setGoalInState();
    }
  }

  setGoalInState = () => {
    console.log("setGoalInState");
    const { currentWeight, currentWeightGoal } = this.state;
    const { historicalWeight, goals } = this.props;
    console.log("historicalWeight length" + historicalWeight.length);
    console.log(Object.values(historicalWeight || {}));

    historicalWeight.sort(function (a, b) {
      return a.createdAt > b.createdAt;
    });
    const historicalWeightItems = historicalWeight[historicalWeight.length - 1];
    const startingWeightMessage = historicalWeightItems.weight;

    const currentWeightMessage =
      currentWeight || goals.weight.current || startingWeightMessage;
    const currentWeightGoalMessage =
      currentWeightGoal != "" ? currentWeightGoal : goals.weight.target;
    this.setState({
      currentWeight: currentWeightMessage,
      currentWeightGoal: currentWeightGoalMessage,
      startingWeight: startingWeightMessage,
      refreshGoal: true,
    });
  };

  onShowHydrationTrackerModal = () => {
    console.log("_openHydrationTrackerModal clicked");
    this.setState({ showHydrationTracker: true });
  };

  onDismissHydrationTrackerModal = () => {
    console.log("HydrationTrackerModal");
    this.setState({ showHydrationTracker: false });
  };

  onShowWeightGoalModal = () => this.setState({ showWeightGoal: true });

  onDismissWeightGoalModal = () => this.setState({ showWeightGoal: false });

  _onNewGoalSaved = () => {
    const { currentWeightGoal, currentWeight, startingWeight } = this.state;
    const { goals, saveWeightGoal, saveWeight } = this.props;
    const { weight } = goals;

    // alert(
    //   JSON.stringify(weight) +
    //     "\n\n" +
    //     currentWeightGoal +
    //     ", " +
    //     currentWeight +
    //     ", " +
    //     startingWeight
    // );
    // alert(currentWeightGoal + ", " + currentWeight + ", " + startingWeight);
    // 70, 84, 86

    // if (currentWeightGoal !== null) {
    //   saveWeightGoal({
    //     ...weight,
    //     target: currentWeightGoal,
    //     goalAchieved: false,
    //   });
    // }

    // if (currentWeight !== null) {
    //   saveWeightGoal({
    //     // ...weight,
    //     current: currentWeight,
    //     goalAchieved: false,
    //   });
    // }

    var d = {};

    if (currentWeightGoal !== null && currentWeight !== null) {
      d = {
        ...weight,
        target: currentWeightGoal,
        current: currentWeight,
        goalAchieved: false,
      };
    }
    if (currentWeightGoal == null && currentWeight !== null) {
      d = {
        ...weight,
        current: currentWeight,
        goalAchieved: false,
      };
    }
    if (currentWeightGoal !== null && currentWeight == null) {
      d = {
        ...weight,
        target: currentWeightGoal,
        goalAchieved: false,
      };
    }
    if (currentWeightGoal == null && currentWeight == null) {
      d = {
        ...weight,
        goalAchieved: false,
      };
    }

    saveWeightGoal(d);

    if (startingWeight !== null) {
      saveWeight(startingWeight);
    }

    this.setState({ currentWeightGoal: null, showWeightGoal: false });
  };

  _onWeightGoalChanged = (weight) =>
    this.setState({ currentWeightGoal: parseFloat(weight) });

  _onCurrentWeightChanged = (weight) =>
    this.setState({ currentWeight: parseFloat(weight) });

  _onStartingWeightChanged = (weight) =>
    this.setState({ startingWeight: parseFloat(weight) });

  render() {
    const {
      container,
      equalWidthContainer,
      bottomContainerStyle,
      cardImageStyle,
      contentTitle,
      contentSubTitle,
      goalProgressOuterContainer,
      goalProgressContainer,
      weightGoalContainer,
      weightLossContainer,
      weightLossImageStyle,
      equalHeightContainer,
      weightGoalSummaryContainer,
      orangeDivider,
      weightGoalSummary,
      weightText,
      weightLabel,
      waterIntakeBottle,
    } = styles;
    const { weekData, goals } = this.props;
    const {
      showHydrationTracker,
      showWeightGoal,
      startingWeight = "---",
    } = this.state;

    const { dailyWaterIntake, weight } = goals;
    const { current: currentDailyWaterIntake, target: targetDailyWaterIntake } =
      dailyWaterIntake;
    const completedWorkoutLength = weekData.filter(
      ({ isCompleted }) => isCompleted
    ).length;
    const workoutLength = weekData.length;

    const { current: currentWeight = "---", target: goalWeight = "---" } =
      weight;

    // alert(JSON.stringify(weight));

    let weightLoss = "---";
    let weightProgressPercentage = "---";
    let trendArrow = downwardTrend;
    if (!isNaN(startingWeight) && !isNaN(currentWeight)) {
      weightLoss = startingWeight - currentWeight;
      if (weightLoss < 0) {
        trendArrow = upwardTrend;
      }
    }

    if (!isNaN(startingWeight) && !isNaN(weightLoss) && !isNaN(goalWeight)) {
      const weightLossRequired = startingWeight - goalWeight;
      weightProgressPercentage = (
        (weightLoss / weightLossRequired) *
        100
      ).toFixed();
    }
    weightLoss = Math.abs(weightLoss);

    // console.log(new Array(5).map((value, index) => 1));
    return (
      <ScrollView contentContainerStyle={container}>
        <HydrationTracker
          visible={showHydrationTracker}
          screenProps={this.props.screenProps}
          onClose={this.onDismissHydrationTrackerModal}
          animType="none"
        />
        {/* --- start --- */}
        <NewGoalModal
          visible={showWeightGoal}
          onClose={this.onDismissWeightGoalModal}
          onSave={this._onNewGoalSaved}
          onGoalWeightChange={this._onWeightGoalChanged}
          onCurrentWeightChange={this._onCurrentWeightChanged}
          onStartingWeightChange={this._onStartingWeightChanged}
          currentWeight={goals.weight.current || 0}
          goalWeight={goals.weight.target || 0}
          startingWeight={startingWeight || 0}
        />
        {/* --- end --- */}
        <SweatStreak />
        <View style={bottomContainerStyle}>
          <View style={equalWidthContainer}>
            <Card title={"Weekly Status"}>
              <Image
                style={cardImageStyle}
                source={require("../images/dumbbells.png")}
              />
              <Text style={contentTitle}>
                {completedWorkoutLength} out of {workoutLength}
              </Text>
              <Text style={contentSubTitle}>Workouts Completed</Text>
            </Card>
            <TouchableOpacity onPress={this.onShowHydrationTrackerModal}>
              <Card
                title={"Water Intake"}
                titleActionView={() => {
                  return (
                    <TouchableOpacity
                      onPress={this.onShowHydrationTrackerModal}
                    >
                      <Image
                        style={{
                          height: verticalScale(25),
                          width: verticalScale(25),
                        }}
                        source={require("../images/plus.png")}
                      />
                    </TouchableOpacity>
                  );
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {Array.from({ length: currentDailyWaterIntake }, () => (
                    <Image
                      style={waterIntakeBottle}
                      source={require("../images/full.png")}
                    />
                  ))}
                  {Array.from(
                    {
                      length: targetDailyWaterIntake - currentDailyWaterIntake,
                    },
                    () => (
                      <Image
                        style={waterIntakeBottle}
                        source={require("../images/empty.png")}
                      />
                    )
                  )}
                </View>
                <Text style={contentTitle}>
                  {currentDailyWaterIntake} out of {targetDailyWaterIntake}
                </Text>
                <Text style={contentSubTitle}>Bottles Logged</Text>
              </Card>
            </TouchableOpacity>
          </View>
          <View style={equalWidthContainer}>
            <TouchableOpacity
              onPress={this.onShowWeightGoalModal}
              style={{ flex: 1 }}
            >
              <Card
                title={"Weight Goal"}
                contentContainerStyle={weightGoalContainer}
              >
                <View style={equalHeightContainer}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["#FCD8CA", "#F5CCD2"]}
                    style={goalProgressOuterContainer}
                  >
                    <View style={goalProgressContainer}>
                      <Text style={contentTitle}>{currentWeight} lbs</Text>
                      <Text style={contentSubTitle}>Current</Text>
                      <View style={weightLossContainer}>
                        <Image
                          style={weightLossImageStyle}
                          source={trendArrow}
                        />
                        <Text style={weightText}>{weightLoss} lbs</Text>
                      </View>
                      <Text style={weightLabel}>
                        Progress ({weightProgressPercentage}%)
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
                <View style={weightGoalSummaryContainer}>
                  <View style={weightGoalSummary}>
                    <Text style={weightText}>{startingWeight} lbs</Text>
                    <Text style={weightLabel}>Start</Text>
                  </View>
                  <View style={orangeDivider} />
                  <View style={weightGoalSummary}>
                    <Text style={weightText}>{goalWeight} lbs</Text>
                    <Text style={weightLabel}>Goal</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ userData }) => {
  const { historicalWeight, goals } = userData;
  const { dailyWaterIntake } = goals || {};

  return {
    dailyWaterIntake,
    historicalWeight,
    goals,
  };
};

export default connect(mapStateToProps, { saveWeightGoal, saveWeight })(
  GoalsCard
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    paddingBottom: 100,
  },
  equalWidthContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  bottomContainerStyle: {
    flexDirection: "row",
  },
  cardImageStyle: {
    tintColor: "#78B8CB",
    marginBottom: 5,
    height: 25,
    width: 30,
  },
  contentTitle: {
    fontSize: verticalScale(18),
    color: "#F595A9",
    fontWeight: "bold",
  },
  contentSubTitle: {
    fontSize: verticalScale(12),
    color: "#808284",
    textAlign: "center",
  },
  weightGoalContainer: {
    height: "100%",
  },
  equalHeightContainer: {
    height: "50%",
  },
  weightGoalSummaryContainer: {
    marginBottom: 20,
    height: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weightGoalSummary: {
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  orangeDivider: {
    height: "50%",
    width: 2,
    backgroundColor: "#FAB99F",
  },
  weightText: {
    fontSize: verticalScale(16),
    color: "#F595A9",
    fontWeight: "bold",
  },
  weightLabel: {
    fontSize: verticalScale(10),
    color: "#808284",
  },
  goalProgressOuterContainer: {
    height: width * 0.42,
    width: width * 0.42,
    borderRadius: width * 0.42,
  },
  goalProgressContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 170,
    alignItems: "center",
    justifyContent: "center",
  },
  weightLossContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  weightLossImageStyle: {
    width: 40,
    height: 20,
    transform: [
      {
        scale: 0.8,
      },
    ],
    marginHorizontal: 5,
  },
  waterIntakeBottle: {
    width: 20,
    height: 40,
    tintColor: "#C2DDDC",
    marginHorizontal: 2,
  },
});
