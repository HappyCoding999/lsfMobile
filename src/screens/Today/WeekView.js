import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colorNew } from "../../modules/styles/theme";
import WeekdayCheck, {
  CHECK_STATE,
} from "../../components/common/WeekdayCheck";

const DEFAULT_CHECK_STATE = {
  showBrilliantAnimation: false,
  weekCompleteAnimateCheck: false,
  weekAnimateBurst1: false,
  weekAnimateBurst2: false,
  weekAnimateBurst3: false,
  weekAnimateBurst4: false,
  weekAnimateBurst5: false,
  weekAnimateBurst6: false,
  weekAnimateBurst0: false,
};

const DAYS = [1, 2, 3, 4, 5, 6, 0];

export class WeekView extends Component {
  constructor(props) {
    super(props);

    // alert("xxxxxx== completed :--- " + JSON.stringify(props.completed));

    // var workout = this.getSelfcareWorkoutForCurrentWeek();
    // weekData.push(workout);

    // console.log("xxxxxx== completed :--- " + JSON.stringify(props.completed));

    var dates = [];
    var completed = props.completed;
    var isSelfCareCompleted = props.isSelfCareCompleted;
    var selfcareWorkout = this.getSelfCareWorkout();

    if (isSelfCareCompleted) {
      var day = new Date(selfcareWorkout.createdAt);
      dates.push(day.getDay());
    }

    if (completed) {
      // console.log(props.completed)
      completed.map((obj) => {
        var day = new Date(obj.createdAt);
        if (day != "Invalid Date") {
          // console.log(obj)
          if (
            this.props.currentWeek == obj.week &&
            dates.includes(day.getDay()) == false &&
            this.props.level.toLowerCase() == obj.level.toLowerCase() &&
            obj.flag
          ) {
            dates.push(day.getDay());
          }
        }
      });
    }

    // alert(this.props.level.toLowerCase() + "\n\n" + JSON.stringify(dates));

    console.log("xxxxxx== dates :--- I: " + JSON.stringify(dates));
    this.state = {
      isWeekButtonSelected: false,
      completedDates: dates,
      ...DEFAULT_CHECK_STATE,
    };
  }

  componentWillReceiveProps(props) {
    var dates = [];
    var completed = props.completed;
    var isSelfCareCompleted = props.isSelfCareCompleted;
    var selfcareWorkout = this.getSelfCareWorkout();

    if (isSelfCareCompleted) {
      var day = new Date(selfcareWorkout.createdAt);
      dates.push(day.getDay());
    }

    if (completed) {
      completed.map((obj) => {
        var day = new Date(obj.createdAt);
        if (day != "Invalid Date") {
          if (
            this.props.currentWeek == obj.week &&
            dates.includes(day.getDay()) == false &&
            this.props.level.toLowerCase() == obj.level.toLowerCase() &&
            obj.flag
          ) {
            dates.push(day.getDay());
          }
        }
      });
    }
    console.log("xxxxxx== dates :--- II: " + JSON.stringify(dates));
    this.setState({ completedDates: dates });
  }

  getSelfCareWorkout() {
    const { completedWorkouts, weeklyWorkoutSchedule } = this.props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    var workout = {};

    for (let [tag, item] of Object.entries(completedWorkouts)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == this.props.screenProps.currentWeek &&
        day != "Invalid Date" &&
        item.flag
        // && day.getDay() == item.day
      ) {
        workout = item;
      }
    }
    for (let [tag, item] of Object.entries(completed)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == this.props.screenProps.currentWeek &&
        day != "Invalid Date" &&
        item.flag
        // && day.getDay() == item.day
      ) {
        workout = item;
      }
    }
    return workout;
  }

  onLastDayCompleted = () => {
    const { completedDates } = this.state;
    const dates = [...completedDates, 0];

    let weekCompleteAnimateCheck = true;
    for (const day of DAYS) {
      if (!dates.includes(day)) {
        weekCompleteAnimateCheck = false;
      }
    }

    this.setState({ completedDates: dates, weekCompleteAnimateCheck });
  };

  onStartWeekCompleteAnimation = async () => {
    this.setState({ showBrilliantAnimation: true });
    for (const day of DAYS) {
      await this.sleep(5);
      this.setState({ [`weekAnimateBurst${day}`]: true });
    }
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  renderWeekDayImageAndTextView = (isSelected, day, text) => {
    const { completedDates } = this.state;
    let checkState = isSelected ? CHECK_STATE.CHECKED : CHECK_STATE.UNCHECKED;
    if (this.state.weekCompleteAnimateCheck && day == 0) {
      checkState = CHECK_STATE.CHECKED_ANIMATE;
    }
    if (this.state[`weekAnimateBurst${day}`]) {
      checkState = CHECK_STATE.CHECKED_BURST;
    }

    const {
      weekDayItemContainer,
      weekDayButton,
      weekDayTextContainer,
      weekDayStyle,
    } = styles;
    return (
      <View style={weekDayItemContainer}>
        {/*<TouchableOpacity style={weekDayButton} disabled={day != 0 || completedDates.includes(0)} onPress={this.onLastDayCompleted}>*/}
        <TouchableOpacity
          style={weekDayButton}
          disabled={true}
          onPress={this.onLastDayCompleted}
        >
          <WeekdayCheck
            checkState={checkState}
            onFlipAnimationEnd={this.onStartWeekCompleteAnimation}
          />
        </TouchableOpacity>
        <View style={weekDayTextContainer}>
          <Text allowFontScaling={false} style={weekDayStyle}>
            {text}
          </Text>
        </View>
      </View>
    );
  };

  renderWeekDayCellView = (day, text) => {
    var isSelected =
      this.state.completedDates.length > 0
        ? this.state.completedDates.includes(day)
        : false;

    return this.renderWeekDayImageAndTextView(isSelected, day, text);
  };

  render() {
    const { container, weekDayContainer } = styles;

    return (
      <View style={container}>
        <View
          style={[
            weekDayContainer,
            { height: this.state.isWeekButtonSelected ? 36 : 60 },
          ]}
        >
          {this.renderWeekDayCellView(1, "MON")}
          {this.renderWeekDayCellView(2, "TUE")}
          {this.renderWeekDayCellView(3, "WED")}
          {this.renderWeekDayCellView(4, "THU")}
          {this.renderWeekDayCellView(5, "FRI")}
          {this.renderWeekDayCellView(6, "SAT")}
          {this.renderWeekDayCellView(0, "SUN")}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorNew.darkPink,
  },
  weekDayContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorNew.darkPink,
    flexDirection: "row",
  },

  weekDayItemContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: "14%",
    paddingLeft: 3,
    paddingRight: 3,
  },
  weekDayButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  weekDayTextContainer: {
    height: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  weekDayStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: "#fff",
    height: "100%",
    marginBottom: 18,
    marginTop: 10,
  },
};
