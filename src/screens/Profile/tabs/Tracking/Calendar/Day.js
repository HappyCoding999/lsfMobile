import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { color } from "../../../../../modules/styles/theme";
import calendarIcon from "../../../images/calendarLine.png";
import starIcon from "../../../images/calendarStar.png";
import heartIcon from "../../../images/calendarHeart.png";
import { EventRegister } from "react-native-event-listeners";

export default class extends Component {
  render() {
    const { date, marking } = this.props;
    const { sweatLogs, completedWorkouts, bonusChallenges, selfCareLogs } = marking;
    const backgroundColor = completedWorkouts === true ? '#f3ccd3' : 'transparent';
    const starOpacity = bonusChallenges === true ? 1 : 0;
    const barOpacity = sweatLogs === true ? 1 : 0;
    const heartOpacity = selfCareLogs === true ? 1 : 0;
    const { day } = date;

    const containerStyle = {
      ...styles.container,
      backgroundColor
    };

    const starStyle = {
      ...styles.star,
      opacity: starOpacity
    };

    const barStyle = {
      ...styles.bar,
      opacity: barOpacity
    };

    const heartStyle = {
      ...styles.heart,
      opacity: heartOpacity
    }

    return (
      <View style={containerStyle}>
        <TouchableOpacity
          onPress={() => EventRegister.emit("paywallEvent", () => this.props.onSingleDayPressed(date))}>
          <View style={{ width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ zIndex: 1, color: 'black' }}>{day}</Text>
          </View>
          <Image style={starStyle} source={starIcon} />
          <Image style={barStyle} source={calendarIcon} />
          <Image style={heartStyle} source={heartIcon} />
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = {
  container: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  star: {
    position: "absolute",
    resizeMode: 'contain',
    width: 11,
    height: 11,
    top: -8,
    left: 16
  },
  bar: {
    position: "absolute",
    top: 25,
    backgroundColor: 'grey',
    height: 3,
    width: 22,
    left: -3
  },
  heart: {
    position: "absolute",
    top: 10,
    left: 17,
    width: 9,
    height: 9,
    zIndex: 0
  }
};