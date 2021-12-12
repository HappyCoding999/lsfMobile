import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color, colorNew } from "../../modules/styles/theme";
import {
  bottle_blank,
  bottle_fill,
  goal_workout_status,
  goal_plus_rounded,
  goal_weight_goal,
  goal_water_intake,
  goal_sweat_streak,
  goal_feel_hapier,
  day_check_roundec,
} from "../../images";
import LinearGradient from "react-native-linear-gradient";
import { skipToNextWeek, restartLevel } from "../../actions";
import { connect } from "react-redux";

class WeekDropDownOptionViewClass extends Component {
  constructor(props) {
    super(props);
  }

  _jumpToNextWeekClicked() {
    this.props.skipToNextWeek();
  }
  _restartLevelClicked() {
    this.props.restartLevel();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={[
            {
              width: "100%",
              flex: 1,
              justifyContent: "space-evenly",
              alignItems: "center",
            },
          ]}
        >
          <View
            style={[
              {
                width: "100%",
                height: 110,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              },
            ]}
          >
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                width: "70%",
                height: "40%",
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colorNew.darkPink,
                margin: 10,
                borderRadius: 100,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={this._jumpToNextWeekClicked.bind(this)}
                activeOpacity={0.5}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.headingTextBlackBig,
                      fontSize: 14,
                      paddingLeft: 0,
                      width: "100%",
                      color: colorNew.darkPink,
                      height: 20,
                      marginTop: 0,
                      textAlign: "center",
                    }}
                  >
                    Jump to Next Week
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                width: "70%",
                height: "40%",
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colorNew.darkPink,
                margin: 10,
                borderRadius: 100,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={this._restartLevelClicked.bind(this)}
                activeOpacity={0.5}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.headingTextBlackBig,
                      fontSize: 14,
                      paddingLeft: 0,
                      width: "100%",
                      color: colorNew.darkPink,
                      height: 20,
                      marginTop: 0,
                      textAlign: "center",
                    }}
                  >
                    Restart Level
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[{ width: "100%", height: 4, backgroundColor: "#fff" }]} />
      </View>
    );
  }
}

const styles = {
  textStyle: {
    fontSize: 20,
    color: color.hot_pink,
  },
  navigationButtonBackgroundView: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationButtonBackgroundViewSelected: {
    width: 40,
    height: 40,
    borderTopColor: "#ffffff",
    borderLeftColor: "#ffffff",
    borderRightColor: "#ffffff",
    borderBottomColor: "transparent",
    marginTop: 8,
    borderWidth: 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colorNew.lightPink,
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
    marginTop: 10,
  },
  headingTextBlackBig: {
    width: "90%",
    height: 28,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 20,
    color: "#000",
    marginTop: 20,
  },
  viewStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    paddingTop: 15,
    position: "relative",
  },
};

export const WeekDropDownOptionView = connect(null, {
  skipToNextWeek,
  restartLevel,
})(WeekDropDownOptionViewClass);
