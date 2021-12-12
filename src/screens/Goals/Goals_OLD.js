import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Dimensions, View, TouchableOpacity } from "react-native";
import { PagerTitleIndicator, ViewPager } from "rn-viewpager";
import moment from "moment";

import HomeHeader from "../Header/HomeHeader";
import { Progress } from "./Progress";
import { GoalsWeekView } from "./GoalsWeekView";
import Trophies from "../Profile/tabs/Trophies";
import GoalCards from "./GoalCards";

import SweatLog from "'../../../screens/Workouts/CompletionModalStack/SweatLog";

const { width, height } = Dimensions.get("window");
const headerHeight = 120;

export default class extends Component {
  constructor(props) {
    super(props);
    console.log("Goals class");
    // console.log(props);
    this._openSweatLog = this._openSweatLog.bind(this);
    this._logButtonPressed = this._logButtonPressed.bind(this);
    this._closeSweatLog = this._closeSweatLog.bind(this);
    var showTrophy = props.showTrophy != undefined ? props.showTrophy : false;
    this.state = {
      tabIndex: showTrophy ? 0 : 1,
      newInitialPage: showTrophy ? 0 : 1,
      showSweatLogModal: false,
      selectedDate: "",
    };
  }

  componentDidMount() {
    console.log("componentDidMount");
    console.log(this.state.tabIndex);
    // if (this.state.tabIndex == 0) {
    //   setTimeout(() => {
    //       this.pager.setPage(0);
    // }, 50)

    // }
  }

  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps in Goals");
    console.log(props);
    let showTrophy = props.showTrophy != undefined ? props.showTrophy : false;
    if (this.state.tabIndex != 0 && showTrophy == true) {
      this.setState({ tabIndex: 0 });
      this.pager.setPage(0);
    }
  }

  getWeekData = () => {
    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } =
      this.props.screenProps;
    console.log("getWeekData");
    const { completed } = weeklyWorkoutSchedule;

    var weekData = [];

    var cw = completedWorkouts.filter(
      (e) =>
        e.level.toLowerCase() === this.props.screenProps.level.toLowerCase()
    );

    if (cw != undefined && cw.length > 0) {
      for (let [tag, item] of Object.entries(cw)) {
        if (
          item.primaryType != "Rest" &&
          this.props.screenProps.currentWeek == item.week
        ) {
          var isObjectContains = false;
          for (const item1 of weekData) {
            if (
              item1.week == item.week &&
              this.props.screenProps.currentWeek == item.week
            ) {
              isObjectContains = true;
              break;
            }
          }
          if (isObjectContains == false) {
            var day = new Date(item.createdAt);
            if (
              day != "Invalid Date" &&
              this.props.screenProps.currentWeek == item.week
            ) {
              weekData.push({ ...item, isCompleted: true });
            } else {
              weekData.push({ ...item, isCompleted: false });
            }
          }
        }
      }
    }

    if (completed != undefined && completed.length > 0) {
      for (let [tag, item] of Object.entries(completed)) {
        if (
          item.primaryType != "Rest" &&
          this.props.screenProps.currentWeek == item.week
        ) {
          var isObjectContains = false;
          for (const item1 of weekData) {
            if (
              item1.week == item.week &&
              item1.day == item.day &&
              this.props.screenProps.currentWeek == item.week
            ) {
              isObjectContains = true;
              break;
            }
          }
          if (isObjectContains == false) {
            var day = new Date(item.createdAt);
            if (
              day != "Invalid Date" &&
              this.props.screenProps.currentWeek == item.week
            ) {
              weekData.push({ ...item, isCompleted: true });
            } else {
              weekData.push({ ...item, isCompleted: false });
            }
          }
        }
      }
    }
    if (weeklyWorkoutSchedule.today) {
      const { today } = weeklyWorkoutSchedule;
      var isObjectContains = false;
      for (const item1 of weekData) {
        if (item1.week == today.week && item1.day == today.day) {
          isObjectContains = true;
          break;
        }
      }
      if (today.primaryType != "Rest") {
        if (isObjectContains == false) {
          weekData.push(today);
        }
      }
    }
    if (weeklyWorkoutSchedule.upcomming) {
      for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
        if (item.primaryType != "Rest") {
          var isObjectContains = false;
          for (const item1 of weekData) {
            if (item1.week == item.week && item1.day == item.day) {
              isObjectContains = true;
              break;
            }
          }
          if (isObjectContains == false) {
            weekData.push(item);
          }
        }
      }
    }
    weekData.sort(function (a, b) {
      return a.day > b.day;
    });
    var weekDataLatest = [];
    var weekDataCompleted = [];
    var isPreviousWorkoutCompleted = false;
    for (let [tag, item] of Object.entries(weekData)) {
      var moveToLast =
        moment(Date.now())
          .startOf("day")
          .diff(moment(item.createdAt).startOf("day"), "days") >= 1;
      if (isPreviousWorkoutCompleted) {
        if (item.isCompleted != undefined && item.isCompleted && moveToLast) {
          weekDataCompleted.push({ ...item, isPreviousWorkoutCompleted: true });
        } else {
          weekDataLatest.push({ ...item, isPreviousWorkoutCompleted: true });
        }
      } else {
        if (item.isCompleted != undefined && item.isCompleted && moveToLast) {
          weekDataCompleted.push({
            ...item,
            isPreviousWorkoutCompleted: false,
          });
        } else {
          weekDataLatest.push({ ...item, isPreviousWorkoutCompleted: false });
        }
      }
      if (item.isCompleted) {
        isPreviousWorkoutCompleted = true;
      } else {
        isPreviousWorkoutCompleted = false;
      }
    }
    return weekDataLatest.concat(weekDataCompleted);
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

  _navigationLeftButtonPressed() {
    console.log("_navigationLeftButtonPressed");
    this.props.navigation.navigate("Settings", { backToScreen: "Goals" });
  }

  _levelButtonPressed = () => {
    console.log("_levelButtonPressed");
    this.props.navigation.navigate("SettingsLevel", { backToScreen: "Goals" });
  };

  _navigationRightButtonPressed() {
    console.log("_navigationRightButtonPressed");
  }

  onSetTab = (index) => {
    console.log("onSetTab : - ");
    console.log(index);
    this.setState({ tabIndex: index });
    this.pager.setPage(index);
  };

  _logButtonPressed = (sweatLog) => {
    console.log("_logButtonPressed");
    console.log(sweatLog);
    this.props.screenProps.saveSweatLog(sweatLog);
    setTimeout(() => {
      this._closeSweatLog();
    }, 8000);

    this.setState({
      sweatLog: sweatLog,
    });
  };
  _openSweatLog = (date) => {
    console.log("open sweat log");
    console.log(date);
    var unixTimestamp = moment(date.dateString, "YYYY-MM-DD").unix();
    console.log("unixTimestamp");
    console.log(unixTimestamp);
    this.setState({
      selectedDate: date.timestamp,
      showSweatLogModal: true,
    });
  };
  _closeSweatLog = () => {
    console.log("close sweat log");
    this.setState({
      showSweatLogModal: false,
    });
  };
  renderSweatLog() {
    let newParam = { createdAt: this.state.selectedDate };
    console.log("renderSweatLog");
    console.log(newParam);
    return (
      <SweatLog
        headerText={""}
        logButtonPressed={this._logButtonPressed}
        shift={this._closeSweatLog}
        visible={this.state.showSweatLogModal}
        sweatLog={newParam}
        isForEdit={true}
      />
    );
  }
  render() {
    const { tabTitleContainer, tabTitleButton, tabTitle, tabTitleSelected } =
      styles;
    // const { tabIndex = 0 } = this.state
    const { tabIndex = 0 } = this.state;
    const weekData = this.getWeekData();
    var progressProps = { ...this.props.screenProps, weekData };
    return (
      <View style={{ backgroundColor: "#fff", width: "100%", height: height }}>
        <View
          style={[
            {
              width: "100%",
              height: 100,
              position: "absolute",
              justifyContent: "flex-end",
              zIndex: 5,
            },
          ]}
        >
          <HomeHeader
            onRightPressed={this._navigationLeftButtonPressed.bind(this)}
          />
        </View>
        <View style={{ flex: 1, marginTop: headerHeight, tabTitle }}>
          <GoalsWeekView
            screenProps={this.props.screenProps}
            weekData={weekData}
            levelButtonPressed={this._levelButtonPressed}
          />
          <View style={tabTitleContainer}>
            <TouchableOpacity
              style={tabTitleButton}
              onPress={() => this.onSetTab(0)}
            >
              <Text
                style={[tabTitle, tabIndex == 0 ? tabTitleSelected : undefined]}
              >
                {"TROPHIES"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tabTitleButton}
              onPress={() => this.onSetTab(1)}
            >
              <Text
                style={[tabTitle, tabIndex == 1 ? tabTitleSelected : undefined]}
              >
                {"PROGRESS"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tabTitleButton}
              onPress={() => this.onSetTab(2)}
            >
              <Text
                style={[tabTitle, tabIndex == 2 ? tabTitleSelected : undefined]}
              >
                {"GOALS"}
              </Text>
            </TouchableOpacity>
          </View>
          <ViewPager
            ref={(view) => (this.pager = view)}
            initialPage={this.state.newInitialPage}
            onPageSelected={(e) => this.setState({ tabIndex: e.position })}
            style={{ flex: 1 }}
          >
            <View>
              <Trophies
                navigation={this.props.navigation}
                screenProps={this.props.screenProps}
              />
            </View>
            <View>
              <Progress
                {...progressProps}
                navigation={this.props.navigation}
                screenProps={this.props.screenProps}
                openSweatLog={this._openSweatLog}
              />
            </View>
            <View>
              <GoalCards
                weekData={weekData}
                navigation={this.props.navigation}
                screenProps={this.props.screenProps}
              />
            </View>
          </ViewPager>
        </View>
        {this.renderSweatLog()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabTitleContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#FBF1F3",
  },
  tabTitleButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    color: "#C5C6CA",
  },
  tabTitleSelected: {
    fontSize: 16,
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    color: "#DD6D92",
  },
});
