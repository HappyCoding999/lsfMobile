import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";

import { Trophy } from "../../components/common/AnimatedComponents/Trophy";
import { TrophyPerfectMonth } from "../../components/common/AnimatedComponents/TrophyPerfectMonth";
import { color, colorNew } from "../../modules/styles/theme";

import Calendar from "./Calendar";
import Day from "./Calendar/Day";
import { DotLegend } from "./DotLegend";

const { width } = Dimensions.get("window");

export class GoalsCalendar extends Component {
  constructor(props) {
    super(props);
    this._onDayPressed = this._onDayPressed.bind(this);
    this.state = {
      showPerfectMonthAnimation: false,
      monthToAnimation: 1,
    };
  }

  beginPerfectMonthAnimation = (monthToAnimation) => {
    this.setState({ showPerfectMonthAnimation: true, monthToAnimation });
  };

  animateCalendarDays = async () => {
    this.setState({ showPerfectMonthAnimation: false });
    const { monthToAnimation } = this.state;

    setTimeout(async () => {
      const monthDays = this[monthToAnimation] || [];
      const dayViews = Object.keys(monthDays).map((day) => monthDays[day]);

      for (const dayView of dayViews) {
        dayView.animateBubble();
        await this.sleep(10);
      }

      await this.sleep(350);
      this.trophy.animate();
    });
  };

  storeDayView = ({ date }, view) => {
    const { month, day } = date;
    if (!this[month]) {
      this[month] = {};
    }

    this[month][day] = view;
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  shadowBottom = (elevation) => {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  };

  _onDayPressed = (date) => {
    console.log("onDayPressed");
    console.log("date data");
    console.log(date);
    const x = new Date(date.dateString);
    var today = new Date();
    console.log(x);
    console.log(today);

    if (x > today) return;
    // var dd = today.getDate();
    // var mm = monthNames[today.getMonth()]
    // var yyyy = today.getFullYear();

    // this.props.navigation.navigate("JournalReview");
    const { sweatLogs, selfCareLogs, completedWorkouts } =
      this.props.screenProps;
    var isRedirectedToJournalReview = false;
    const { name, avatar, level } = this.props.screenProps;
    for (let log of sweatLogs) {
      // console.log("_onDayPressed see sweatLogs");
      // console.log(log)
      const logDate = new Date(log.createdAt);
      const utcTimeOffset = logDate.getTimezoneOffset() / 60;
      const currentHours = logDate.getHours();
      // Step 4: Add the offset to the date object
      logDate.setHours(currentHours + utcTimeOffset);
      const logDay = logDate.getDate();
      const logMonth = logDate.getMonth() + 1;
      if (logMonth === date.month && logDay === date.day) {
        let newParam = { logData: log, userDetail: { name, avatar, level } };
        isRedirectedToJournalReview = true;
        this.props.navigation.navigate("JournalReview", newParam);
        break;
      }
    }
    if (!isRedirectedToJournalReview) {
      for (let log of selfCareLogs) {
        const logDate = new Date(log.createdAt);
        const utcTimeOffset = logDate.getTimezoneOffset() / 60;
        const currentHours = logDate.getHours();
        // Step 4: Add the offset to the date object
        logDate.setHours(currentHours + utcTimeOffset);
        const logDay = logDate.getDate();
        const logMonth = logDate.getMonth() + 1;
        if (logMonth === date.month && logDay === date.day) {
          let newParam = { logData: log, userDetail: { name, avatar, level } };
          isRedirectedToJournalReview = true;
          this.props.navigation.navigate("JournalReview", newParam);
          break;
        }
      }
    }
    if (!isRedirectedToJournalReview) {
      for (let log of completedWorkouts) {
        // console.log("_onDayPressed see completedWorkouts");
        // console.log(log)
        const logDate = new Date(log.createdAt);
        const utcTimeOffset = logDate.getTimezoneOffset() / 60;
        // console.log("Vishal : getTimezoneOffset")
        // console.log(utcTimeOffset)
        const currentHours = logDate.getHours();
        // Step 4: Add the offset to the date object
        logDate.setHours(currentHours + utcTimeOffset);
        const logDay = logDate.getDate();
        const logMonth = logDate.getMonth() + 1;
        if (logMonth === date.month && logDay === date.day) {
          console.log("_onDayPressed see completedWorkouts");
          console.log(log);
          let newParam = { logData: log, userDetail: { name, avatar, level } };
          isRedirectedToJournalReview = true;
          this.props.navigation.navigate("JournalReview", newParam);
          break;
        }
      }
    }
    if (!isRedirectedToJournalReview) {
      this.props.openSweatLog(date);
    }
  };

  render() {
    const {
      sweatLogs,
      completedBonusChallenges,
      completedWorkouts,
      selfCareLogs,
      filteredChallengeLogs,
    } = this.props.screenProps;
    const { showPerfectMonthAnimation } = this.state;

    return (
      <View style={{ alignItems: "center", width: width, marginTop: 10 }}>
        <TrophyPerfectMonth
          onAnimationFinish={this.animateCalendarDays}
          showAnimated={showPerfectMonthAnimation}
        />
        <View
          style={[
            this.shadowBottom(7),
            {
              alignItems: "center",
              width: width * 0.92,
              borderColor: "#000",
              borderWidth: 1,
              borderRadius: 20,
            },
          ]}
        >
          <View
            style={{
              alignItems: "center",
              width: width * 0.9,
              marginTop: 10,
              marginBottom: 10,
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <Calendar
              sweatLogs={sweatLogs}
              bonusChallenges={[
                ...completedBonusChallenges,
                ...filteredChallengeLogs,
              ]}
              completedWorkouts={completedWorkouts}
              selfCareLogs={selfCareLogs}
              day={(props) => (
                <Day
                  ref={(view) => this.storeDayView(props, view)}
                  onSingleDayPressed={this._onDayPressed}
                  {...props}
                />
              )}
            />
            <View style={{ position: "absolute", top: -42, right: 30 }}>
              <Trophy ref={(view) => (this.trophy = view)} />
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            height: width * 0.2,
            width: width * 0.9,
          }}
        >
          <DotLegend text={"WORKOUT"} dotColor={colorNew.lightPink} />
          <DotLegend
            text={"BONUS CHALLENGES"}
            dotColor={"#fff"}
            containerStyle={{ width: (width * 0.9) / 4 }}
            dotStyle={{ borderColor: colorNew.darkPink }}
          />
          <DotLegend text={"SELF CARE"} dotColor={colorNew.selfLoveLogPink} />
          <DotLegend text={"JOURNAL ENTRY"} dotColor={colorNew.mediumPink} />
        </View>
      </View>
    );
  }
}
