import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { connect } from "react-redux";
import { colorNew } from "../../../modules/styles/theme";
import { Card } from "./Card";

const { width, height } = Dimensions.get("window");

class SweatStreak extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("SweatStreak props");
    console.log(this.props);
    var isForToday = false;
    if (this.props.isForToday) {
      isForToday = true;
    }
    const {
      circleContainer,
      currentStreak,
      currentStreakNumber,
      currentStreakDays,
      streakText,
      longestStreak,
      longestStreakDays,
    } = styles;
    const colors = [colorNew.lightPink, colorNew.darkPink];

    const { workoutStreak } = this.props;
    const { current = "-", longest = "-" } = workoutStreak || {};

    const currentDayText = isNaN(current) || current > 1 ? "days" : "day";
    const longestDayText = isNaN(longest) || longest > 1 ? "days" : "day";

    return (
      <Card
        title={"Sweat Streak"}
        isForToday={isForToday}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        <View style={circleContainer}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.5 }}
            colors={colors}
            style={currentStreak}
          >
            <Text style={currentStreakNumber}>{current}</Text>
            <Text style={currentStreakDays}>{currentDayText}</Text>
            <Text style={streakText}>Current Streak</Text>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={colors}
            style={longestStreak}
          >
            <Image
              style={{ marginBottom: 5 }}
              source={require("../images/water-droplets.png")}
            />
            <Text style={longestStreakDays}>
              {longest} {longestDayText}
            </Text>
            <Text style={streakText}>Longest Streak</Text>
          </LinearGradient>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  circleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  currentStreak: {
    height: width * 0.45,
    width: width * 0.45,
    borderRadius: width * 0.45,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  longestStreak: {
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: width * 0.4,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  currentStreakNumber: {
    fontSize: verticalScale(60),
    fontWeight: "bold",
    color: "white",
    fontFamily: "SF Pro Text",
    marginBottom: -5,
  },
  currentStreakDays: {
    fontSize: verticalScale(14),
    color: "white",
    fontWeight: "bold",
    marginTop: -5,
    fontFamily: "SF Pro Text",
  },
  streakText: {
    fontSize: verticalScale(12),
    color: "white",
    fontFamily: "SF Pro Text",
  },
  longestStreakDays: {
    fontSize: verticalScale(25),
    color: "white",
    fontWeight: "bold",
    fontFamily: "SF Pro Text",
  },
});

const mapStateToProps = ({ userData }) => {
  const { goals } = userData;
  const { workoutStreak } = goals || {};

  return {
    workoutStreak,
  };
};

export default connect(mapStateToProps)(SweatStreak);
