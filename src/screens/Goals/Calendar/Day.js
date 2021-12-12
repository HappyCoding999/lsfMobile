import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import { EventRegister } from "react-native-event-listeners";
import { CalendarBubble } from "../../../components/common/AnimatedComponents/CalendarBubble";

const DAY_CONTAINER_HEIGHT_WIDTH = 30;

export default class extends Component {

  animateBubble = () => {
    this.calendarBubble.animate()
  }

  render() {
    const { date, marking } = this.props; 
    console.log("Day.js");
    console.log(this.props)
    console.log(marking)
    const { sweatLogs, completedWorkouts, bonusChallenges, selfCareLogs } = marking;
    const showFilled = completedWorkouts === true;
    const borderColor = completedWorkouts === true ? colorNew.darkPink : 'transparent';
    const starOpacity = bonusChallenges === true ? 1 : 0;
    const barOpacity = sweatLogs === true ? 1 : 0;
    const heartOpacity = selfCareLogs === true ? 1 : 0;
    const { month, day } = date;

    const containerStyle = {
      ...styles.container,
      backgroundColor: 'transparent',
      borderColor,
      borderWidth:1
    };
     const bottomContainerStyle = {
      ...styles.bottomContainer,
      paddingTop: 2,
      paddingLeft: 5
    };

    const starStyle = {
      ...styles.star,
    };

    const barStyle = {
      ...styles.journal,
    };

    const heartStyle = {
      ...styles.selfCare,
    }

    return (
        <CalendarBubble key={`${month}-${day}`} ref={view => this.calendarBubble = view} style={containerStyle} completedWorkouts={showFilled}>
          <TouchableOpacity
            onPress={() => EventRegister.emit("paywallEvent", () => this.props.onSingleDayPressed(date))}>          
            <View style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ zIndex: 1, color: 'black',fontSize: 12,fontWeight: "500"}}>{day}</Text>
            </View>
            <View style={bottomContainerStyle}>
              {/*<View style={starStyle}/>*/}
              {selfCareLogs === true ? <View style={heartStyle}/> : null}
              {sweatLogs === true ? <View style={barStyle}/> : null}
            </View>
          </TouchableOpacity>
        </CalendarBubble>
    );
  }
}

const styles = {
  container: {
    height: DAY_CONTAINER_HEIGHT_WIDTH,
    width: DAY_CONTAINER_HEIGHT_WIDTH,
    borderRadius: (DAY_CONTAINER_HEIGHT_WIDTH/2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#b2b2b2"
  },
  bottomContainer: {
    position: "absolute",
    top: 22,
    height:7,
    flexDirection: "row",
    left: (DAY_CONTAINER_HEIGHT_WIDTH/4),
    width: (DAY_CONTAINER_HEIGHT_WIDTH/2),
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  star: {
    position: "absolute",
    resizeMode: 'contain',
    width: 11,
    height: 11,
    top: -8,
    left: 16
  },
  journal: {
    backgroundColor: colorNew.mediumPink,
    height: 5,
    borderRadius: (5/2),
    width: 5
  },
  selfCare: {
    backgroundColor: colorNew.selfLoveLogPink,
    height: 5,
    borderRadius: (5/2),
    width: 5
  }
};