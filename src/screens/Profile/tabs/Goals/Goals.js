import React, { Component } from "react";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { last, sortBy } from "lodash";
import GoalCard from "./GoalCard";
import NewGoal from "./NewGoal";
import NewGoalModal from "./NewGoalModal";
import StreakInfoModal from "./StreakInfoModal";
import { Fraction, PlainCircleMeter } from "../../../../components/common";
import { LoadingComponent } from "../../../../components/common";

export default class Goals extends Component {
  state = {
    showNewGoalModal: false,
    showStreakInfoModal: false,
    currentWeightGoal: null,
    currentWeight: null,
    startingWeight: null,
  };

  render() {
    const { horizontal } = this.props;

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={horizontal}
      >
        {this._renderGoalCards()}
        {this._renderNewGoalModal()}
        {this._renderStreakInfoModal()}
      </ScrollView>
    );
  }

  _renderGoalCards() {
    const { horizontal, goals, achievements } = this.props;

    if (!goals || !achievements) {
      return <LoadingComponent />;
    }

    const { container, horizontalcontainer } = styles;
    const { weight, workoutStreak, weeklyWorkout, dailyWaterIntake } = goals;
    const bottlesDrank = dailyWaterIntake.current;
    const dailyBottleGoal = 4;
    const workoutsForWeek = weeklyWorkout.current;
    let newGoals;

    if (achievements.didSetGoal === false) {
      newGoals = [
        {
          title: "Sweat Streak",
          subtitle: `Longest Streak: ${
            workoutStreak.longest
          } days\nCurrent Streak: ${
            workoutStreak.current
          } days\nTotal Weeks: ${Math.floor(workoutStreak.current / 7)}`,
          imgURI: require("../../images/threeDroplets.png"),
          progressType: "none",
        },
        {
          title: "Weekly Workout Status",
          subtitle: `${workoutsForWeek} of ${weeklyWorkout.target} days completed`,
          imgURI: require("../../images/dumbbell.png"),
          progressType: "discrete",
          completed: workoutsForWeek,
          not_completed: weeklyWorkout.target,
        },
        {
          title: "Water Intake",
          subtitle: `${bottlesDrank} of 4 LSF Water Bottles`,
          imgURI: require("../../images/waterBottle.png"),
          progressType: "discrete",
          completed: bottlesDrank,
          not_completed: dailyBottleGoal,
        },
      ];

      return (
        <View style={horizontal ? horizontalcontainer : container}>
          <View style={{ marginTop: 25 }}>
            <NewGoal text="ADD GOAL WEIGHT" onPress={this._openNewGoalModal} />
          </View>
          {newGoals.map(this._renderGoalCard)}
        </View>
      );
    } else if (weight.goalAchieved === true) {
      const weightMessage = this._getWeightMessage();

      newGoals = [
        {
          title: "Sweat Streak",
          subtitle: `Longest Streak: ${
            workoutStreak.longest
          } days\nCurrent Streak: ${
            workoutStreak.current
          } days\nTotal Weeks: ${Math.floor(workoutStreak.current / 7)}`,
          imgURI: require("../../images/threeDroplets.png"),
          progressType: "none",
        },
        {
          isWeightGoalCard: true,
          title: "Weight Goal",
          subtitle: weightMessage,
          imgURI: require("../../images/bikini.png"),
          progressType: "continuous",
          completed: 1,
          not_completed: 1,
        },
        {
          title: "Weekly Workout Status",
          subtitle: `${workoutsForWeek} of ${weeklyWorkout.target} days completed`,
          imgURI: require("../../images/dumbbell.png"),
          progressType: "discrete",
          completed: workoutsForWeek,
          not_completed: weeklyWorkout.target,
        },
        {
          title: "Water Intake",
          subtitle: `${bottlesDrank} of 4 LSF Water Bottles`,
          imgURI: require("../../images/waterBottle.png"),
          progressType: "discrete",
          completed: bottlesDrank,
          not_completed: dailyBottleGoal,
        },
      ];
    } else {
      const { completed, not_completed } = this._getWeightGoalProgressRatio();
      const weightMessage = this._getWeightMessage();

      newGoals = [
        {
          isStreakCard: true,
          title: "Sweat Streak",
          subtitle: `Longest Streak: ${
            workoutStreak.longest
          } days\nCurrent Streak: ${
            workoutStreak.current
          } days\nTotal Weeks: ${Math.floor(workoutStreak.current / 7)}`,
          imgURI: require("../../images/threeDroplets.png"),
          progressType: "none",
        },
        {
          isWeightGoalCard: true,
          title: "Weight Goal",
          subtitle: weightMessage,
          imgURI: require("../../images/bikini.png"),
          progressType: "continuous",
          completed,
          not_completed,
        },
        {
          title: "Weekly Workout Status",
          subtitle: `${workoutsForWeek} of ${weeklyWorkout.target} days completed`,
          imgURI: require("../../images/dumbbell.png"),
          progressType: "discrete",
          completed: workoutsForWeek,
          not_completed: weeklyWorkout.target,
        },
        {
          title: "Water Intake",
          subtitle: `${bottlesDrank} of 4 LSF Water Bottles`,
          imgURI: require("../../images/waterBottle.png"),
          progressType: "discrete",
          completed: bottlesDrank,
          not_completed: dailyBottleGoal,
        },
      ];
    }

    return (
      <View style={horizontal ? horizontalcontainer : container}>
        {newGoals.map(this._renderGoalCard)}
      </View>
    );
  }

  _renderGoalCard = (goal, idx) => {
    const {
      title,
      subtitle,
      imgURI,
      progressType,
      completed,
      not_completed,
      isWeightGoalCard,
      isStreakCard,
    } = goal;

    let onPress;
    let cardProps;

    if (progressType === "continuous") {
      const fill = completed / not_completed;
      cardProps = {
        title,
        subtitle,
        progressComponent: () => (
          <PlainCircleMeter fill={fill > 1 ? 1 : fill} />
        ),
        stickerComponent: () => (
          <Image
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            source={imgURI}
          />
        ),
      };
    } else if (progressType === "discrete") {
      cardProps = {
        title,
        subtitle,
        progressComponent: () => (
          <Fraction numerator={completed} denominator={not_completed} />
        ),
        stickerComponent: () => (
          <Image
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            source={imgURI}
          />
        ),
      };
    } else {
      cardProps = {
        title,
        subtitle,
        stickerComponent: () => (
          <Image
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            source={imgURI}
          />
        ),
      };
    }

    if (isWeightGoalCard) {
      onPress = this._openNewGoalModal;
    }

    if (isStreakCard) {
      onPress = this._openStreakInfoModal;
    }

    return (
      <View key={idx} style={{ marginTop: 25 }}>
        {isWeightGoalCard || isStreakCard ? (
          <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
            <GoalCard {...cardProps} />
          </TouchableOpacity>
        ) : (
          <GoalCard {...cardProps} />
        )}
      </View>
    );
  };

  _renderStreakInfoModal() {
    const { showStreakInfoModal } = this.state;
    return (
      <StreakInfoModal
        visible={showStreakInfoModal}
        onClose={this._closeStreakInfoModal}
      />
    );
  }

  _renderNewGoalModal() {
    const { showNewGoalModal } = this.state;
    const { goals, historicalWeight } = this.props;
    if (!historicalWeight || historicalWeight.length === 0) {
      return null;
    }
    const startingWeight = last(
      sortBy(historicalWeight, (w) => w.createdAt)
    ).weight;

    return (
      <NewGoalModal
        visible={showNewGoalModal}
        onClose={this._closeNewGoalModal}
        onSave={this._onNewGoalSaved}
        onGoalWeightChange={this._onWeightGoalChanged}
        onCurrentWeightChange={this._onCurrentWeightChanged}
        onStartingWeightChange={this._onStartingWeightChanged}
        currentWeight={goals.weight.current || 0}
        goalWeight={goals.weight.target || 0}
        startingWeight={startingWeight || 0}
      />
    );
  }

  _onWeightGoalChanged = (weight) =>
    this.setState({ currentWeightGoal: parseFloat(weight) });

  _onCurrentWeightChanged = (weight) =>
    this.setState({ currentWeight: parseFloat(weight) });

  _onStartingWeightChanged = (weight) =>
    this.setState({ startingWeight: parseFloat(weight) });

  _onNewGoalSaved = () => {
    const { currentWeightGoal, currentWeight, startingWeight } = this.state;
    const { goals, saveWeightGoal, saveWeight } = this.props;
    const { weight } = goals;

    if (currentWeightGoal !== null) {
      saveWeightGoal({
        ...weight,
        target: currentWeightGoal,
        goalAchieved: false,
      });
    }

    if (startingWeight !== null) {
      saveWeight(startingWeight);
    }

    if (currentWeight !== null) {
      saveWeightGoal({
        ...weight,
        current: currentWeight,
        goalAchieved: false,
      });
    }

    this.setState({ currentWeightGoal: null, showNewGoalModal: false });
  };

  _getWeightMessage() {
    const { currentWeight, currentWeightGoal } = this.state;
    const { historicalWeight, goals } = this.props;
    const startingWeightMessage = last(
      sortBy(historicalWeight, (w) => w.createdAt)
    ).weight;
    const currentWeightMessage =
      currentWeight || goals.weight.current || startingWeightMessage;
    const currentWeightGoalMessage = currentWeightGoal
      ? currentWeightGoal
      : goals.weight.target;

    return `Starting weight: ${startingWeightMessage}\nCurrent weight: ${currentWeightMessage}\nGoal weight: ${currentWeightGoalMessage}`;
  }

  _getWeightGoalProgressRatio() {
    const { historicalWeight, goals } = this.props;
    const startingWeight = last(
      sortBy(historicalWeight, (w) => w.createdAt)
    ).weight;
    const targetWeight = goals.weight.target;
    const userWantsToLoseWeight = startingWeight > targetWeight;
    const currentWeight = goals.weight.current;

    if (userWantsToLoseWeight && currentWeight < startingWeight) {
      return {
        not_completed: startingWeight - targetWeight,
        completed: startingWeight - currentWeight,
      };
    } else if (userWantsToLoseWeight) {
      return {
        not_completed: 1,
        completed: 0,
      };
    } else if (currentWeight > startingWeight) {
      return {
        not_completed: targetWeight - startingWeight,
        completed: currentWeight - startingWeight,
      };
    } else {
      return {
        not_completed: 1,
        completed: 0,
      };
    }
  }

  _openStreakInfoModal = () => this.setState({ showStreakInfoModal: true });

  _openNewGoalModal = () => this.setState({ showNewGoalModal: true });

  _closeNewGoalModal = () => this.setState({ showNewGoalModal: false });

  _closeStreakInfoModal = () => this.setState({ showStreakInfoModal: false });
}

const styles = {
  container: {
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
  },
  horizontalcontainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
    flex: 1,
    paddingRight: 10,
  },
};
