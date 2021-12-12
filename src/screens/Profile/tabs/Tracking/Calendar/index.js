import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import { flow } from "lodash/fp";
import { color } from "../../../../../modules/styles/theme";
const { width } = Dimensions.get("window");

export default class extends Component {

  defaultMarks = { sweatLogs: false, completedWorkouts: false, bonusChallenges: false };

  render() {
    const { calendar } = styles;

    return (
      <Calendar
        theme={calendar}
        style={{ width: (0.90 * width), alignSelf: "center"}}
        monthFormat="MMMM, yyyy"
        dayComponent={this.props.day}
        markedDates={this._getDates()}
      />
    );
  }

  _getDates() {
    return flow(
      this._processBonusChallenges,
      this._processCompletedWorkouts,
      this._processSweatLogs,
      this._processSelfCareLogs,
    )({});
  }

  _processSweatLogs = markedDates => {
    const { sweatLogs } = this.props;
    if (sweatLogs) {
      return sweatLogs.reduce((result, log) => {
        const date = this._formatDate(log.createdAt);
        const marksForDate = result[date] || this.defaultMarks;
        const newMarks = { ...marksForDate, sweatLogs: true };
        return Object.assign(result, { [date]: newMarks });
      }, markedDates);
    }

    return markedDates;
  }

  _processCompletedWorkouts = markedDates => {
    const { completedWorkouts } = this.props;
    if (completedWorkouts) {
      return completedWorkouts.reduce((result, log) => {
        const date = this._formatDate(log.createdAt);
        const marksForDate = result[date] || this.defaultMarks;
        const newMarks = { ...marksForDate, completedWorkouts: true };
        return Object.assign(result, { [date]: newMarks });
      }, markedDates);
    }

    return markedDates;
  }

  _processBonusChallenges = markedDates => {
    const { bonusChallenges } = this.props;
    if (bonusChallenges) {
      return bonusChallenges.reduce((result, log) => {
        const date = this._formatDate(log.createdAt);
        const marksForDate = result[date] || this.defaultMarks;
        const newMarks = { ...marksForDate, bonusChallenges: true };
        return Object.assign(result, { [date]: newMarks });
      }, markedDates);
    }

    return markedDates;
  }

  _processSelfCareLogs = markedDates => {
    const { selfCareLogs } = this.props;
    if (selfCareLogs) {
      return selfCareLogs.reduce((result, log) => {
        const date = this._formatDate(log.createdAt);
        const marksForDate = result[date] || this.defaultMarks;
        const newMarks = { ...marksForDate, selfCareLogs: true };
        return Object.assign(result, { [date]: newMarks });
      }, markedDates);
    }

    return markedDates;
  }

  _formatDate(timeSinceEpoch) {
    const date = new Date(timeSinceEpoch);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const mm = m < 10 ? '0' + m : m;
    const dd = d < 10 ? '0' + d : d;
    return `${y}-${mm}-${dd}`;
  }

};

const styles = {
  calendar: {
    backgroundColor: "white",
    calendarBackground: "white",
    "stylesheet.calendar.header": {
      monthText: {
        fontFamily: "SF Pro Text",
        fontSize: 20,
        fontWeight: "900",
        fontStyle: "normal",
        letterSpacing: 2,
        textAlign: "center",
        color: color.mediumPink,

      },
    },
    arrowColor: color.lightGrey,

  },
}