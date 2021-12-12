import React, { Component } from "react";
import {
  InteractionManager,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import SweatLog from "'../../../screens/Workouts/CompletionModalStack/SweatLog";
import { User } from "../../../DataStore";

import firebase from "react-native-firebase";
const { width, height } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";
import close from "../images/cancel_round_cross.png";
import {
  ic_angry_sweat_log,
  ic_calm_sweat_log,
  ic_energized_sweat_log,
  ic_exercise_sweat_log,
  ic_exhausted_sweat_log,
  ic_friend_time_sweat_log,
  ic_happy_sweat_log,
  ic_inspired_sweat_log,
  ic_moody_sweat_log,
  ic_outdoors_sweat_log,
  ic_PMSing_sweat_log,
  ic_relaxed_sweat_log,
  ic_shopping_sweat_log,
  ic_sore_sweat_log,
  ic_strong_sweat_log,
  ic_tired_sweat_log,
  ic_treat_sweat_log,
} from "../../../images";

const ITEM_WIDTH = Math.round(width * 0.72);
const ITEM_HEIGHT = 70;

export default class extends Component {
  constructor(props) {
    super(props);
    this._closeSweatLog = this._closeSweatLog.bind(this);
    const sweatLog = props.navigation.state.params.logData;
    this.state = {
      entryList: [1, 2, 3, 4, 5, 6, 7, 8],
      emojiList: {
        Relaxed: ic_relaxed_sweat_log,
        Strong: ic_strong_sweat_log,
        Energized: ic_energized_sweat_log,
        Happy: ic_happy_sweat_log,
        calm: ic_calm_sweat_log,
        inspired: ic_inspired_sweat_log,
        Tired: ic_tired_sweat_log,
        sore: ic_sore_sweat_log,
        Exhausted: ic_exhausted_sweat_log,
        Moody: ic_moody_sweat_log,
        ANGRY: ic_angry_sweat_log,
        PMSing: ic_PMSing_sweat_log,
        Excercise: ic_exercise_sweat_log,
        treat: ic_treat_sweat_log,
        "Friend Time": ic_friend_time_sweat_log,
        shopping: ic_shopping_sweat_log,
        outdoors: ic_outdoors_sweat_log,
      },
      showSweatLogModal: false,
      sweatLog: sweatLog ? sweatLog : [],
      categories: null,
    };
  }
  _backToCalendar = () => {
    console.log("_backToCalendar");
    this.props.navigation.goBack();
  };
  _onEditJournal = () => {
    console.log("onEditJournal");
    const sweatLog = this.state.sweatLog;
    const passedProps = {
      sweatLog,
      isForEdit: true,
    };
    this.props.navigation.navigate("SweatLog", passedProps);
  };
  componentDidMount() {
    console.log("JournalReview props");
  }
  renderButton1(text) {
    return (
      <View style={styles.button1}>
        <Text allowFontScaling={false} style={styles.button1Text}>
          {text}
        </Text>
      </View>
    );
  }

  _renderItem = ({ item, index }) => {
    console.log(item);
    console.log(index);
    const { titleText, subTitle1, editText } = styles;
    if (index == 1) {
      return (
        <View style={styles.cellContainer}>
          <View style={styles.cellInnerContainer}>
            <View
              style={{
                width: (ITEM_WIDTH - 20) * 0.75,
                height: ITEM_HEIGHT - 30,
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.titleText}>MONDAY123 - 5/4/2020</Text>
              <Text style={styles.subTitle1}>Legs + Booty</Text>
            </View>
            <View
              style={{
                width: (ITEM_WIDTH - 20) * 0.25,
                height: ITEM_HEIGHT - 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.editText}>EDIT</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.cellContainer}>
        <View style={styles.cellInnerContainer}>
          <View
            style={{
              width: (ITEM_WIDTH - 20) * 0.75,
              height: ITEM_HEIGHT - 30,
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.titleText}>MONDAY - 5/4/2020</Text>
            <Text style={styles.subTitle1}>Legs + Booty</Text>
          </View>
          <View
            style={{
              width: (ITEM_WIDTH - 20) * 0.25,
              height: ITEM_HEIGHT - 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.editText}>EDIT</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  _renderData(title, detail, key) {
    console.log(title);
    console.log(detail);
    const { titleText, subTitle1, editText, headerTitleText } = styles;
    if (key == "header") {
      return (
        <View style={[{ marginTop: 30, marginBottom: 10, width: ITEM_WIDTH }]}>
          <View style={{ flexDirection: "row", width: ITEM_WIDTH }}>
            <View
              style={{
                width: (ITEM_WIDTH - 20) * 0.75,
                height: ITEM_HEIGHT - 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.headerTitleText}>{title}</Text>
            </View>
            <View
              style={{
                width: (ITEM_WIDTH - 20) * 0.25 + 20,
                height: ITEM_HEIGHT - 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    styles.editText,
                    {
                      textAlign: "right",
                      color: colorNew.textPink,
                      fontSize: 15,
                    },
                  ]}
                >
                  {detail}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: 0.5, backgroundColor: "#b2b2b2" }} />
        </View>
      );
    }
    if (title == "How My Body Felt" || title == "How I Felt") {
      console.log("Render : How My Body Felt ==> ");

      return (
        <View
          style={[
            {
              marginTop: 8,
              marginBottom: title == "My Notes" ? 20 : 10,
              width: ITEM_WIDTH,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              width: ITEM_WIDTH,
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                flex: title == "How My Body Felt" ? 0.7 : 0.3,
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text
                style={[
                  styles.titleText,
                  { color: "#000", fontSize: 12, fontWeight: "500" },
                ]}
              >
                {title}
                {": "}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 20,
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginBottom: 5,
              }}
            >
              {this.renderEmojis(detail)}
            </View>
          </View>
          {title == "My Notes" ? null : (
            <View style={{ height: 0.5, backgroundColor: "#b2b2b2" }} />
          )}
        </View>
      );
    }
    return (
      <View
        style={[
          {
            marginTop: 8,
            marginBottom: title == "My Notes" ? 20 : 10,
            width: ITEM_WIDTH,
          },
        ]}
      >
        <View style={{ flexDirection: "row", width: ITEM_WIDTH }}>
          <View
            style={{
              width: ITEM_WIDTH - 20,
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text
              style={[
                styles.titleText,
                { color: "#000", fontSize: 12, fontWeight: "500" },
              ]}
            >
              {title}
              {": "}
              <Text style={styles.editText}>{detail}</Text>
            </Text>
          </View>
        </View>
        {title == "My Notes" ? null : (
          <View style={{ height: 0.5, backgroundColor: "#b2b2b2" }} />
        )}
      </View>
    );
  }
  renderEmojis(detail) {
    const emojis = [];
    console.log("detail ==> " + detail);
    var detailsArray = [];
    // alert(detail);
    if (detail && detail.toString().includes(",")) {
      detailsArray = detail.split(",");
    } else {
      detailsArray = [detail];
    }
    console.log("detailsArray ==> " + detailsArray);
    let dataLength = detailsArray.length > 3 ? 3 : detailsArray.length;
    // for (let i=0; i < detailsArray.length; i++)
    for (let i = 0; i < dataLength; i++) {
      let imageFor = detailsArray[i];
      console.log("imageFor ==> " + imageFor);
      let image = this.state.emojiList[imageFor];

      emojis.push(
        <Image
          style={{ height: "95%", width: "20%", top: 0 }}
          resizeMode="contain"
          source={image}
        />
      );
    }
    return emojis;
  }
  renderEntriesView(displayDate, name, sweatLog) {
    // console.log("renderEntriesView");
    // console.log(sweatLog);
    // alert(JSON.stringify(sweatLog));
    const {
      nameStyle,
      levelStyle,
      weekStyle,
      titleText,
      selectedTrophyText,
      unselectedTrophyText,
      updateStatsText,
      whiteTitleText,
      goalEditText,
    } = styles;
    return (
      <View
        style={{
          width: "85%",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 40,
          padding: 10,
          marginTop: 50,
          backgroundColor: "#fff",
          borderColor: colorNew.bgGrey,
          borderWidth: 1,
        }}
      >
        {this._renderData(name, displayDate, "header")}
        {this._renderData(
          "Workout",
          sweatLog.Workout
            ? sweatLog.Workout
            : sweatLog.description
            ? sweatLog.description
            : "Self Care Day",
          "row"
        )}
        {this._renderData("Bonus Challenge", sweatLog.bonusChallenge, "row")}
        {this._renderData("Time Completion", sweatLog.time, "row")}
        {this._renderData(
          "Distance",
          sweatLog.distance == "" ? "N/A" : sweatLog.distance,
          "row"
        )}
        {this._renderData(
          "Weight Used",
          sweatLog.weight != "" ? sweatLog.weight : "none",
          "row"
        )}
        {this._renderData(
          "D10 Completed",
          sweatLog.isD10Completed === undefined ||
            sweatLog.isD10Completed === null ||
            !sweatLog.isD10Completed
            ? "No"
            : "Yes",
          "row"
        )}
        {this._renderData("How My Body Felt", sweatLog.mood, "row")}
        {this._renderData("How I Felt", sweatLog.felt, "row")}
        {this._renderData(
          "How I Self-Cared",
          sweatLog.selfCare == "" ? "N/A" : sweatLog.selfCare,
          "row"
        )}
        {this._renderData(
          "My Accomplishment",
          sweatLog.accomplishments == ""
            ? "No accomplishments added"
            : sweatLog.accomplishments,
          "row"
        )}
        {this._renderData(
          "My Notes",
          sweatLog.notes == "" ? "No notes added" : sweatLog.notes,
          "row"
        )}
      </View>
    );
  }
  _logButtonPressed = (sweatLog) => {
    console.log("workout::::--::: 1: " + JSON.stringify(sweatLog));

    this.props.saveSweatLog(sweatLog);
    setTimeout(() => {
      this._closeSweatLog();
    }, 8000);

    this.setState({
      sweatLog: sweatLog,
    });
  };
  _openSweatLog = () => {
    console.log("open sweat log");
    this.setState({
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
    const sweatLog = this.state.sweatLog;
    console.log(sweatLog);
    return (
      <SweatLog
        headerText={
          sweatLog.Workout
            ? sweatLog.Workout
            : sweatLog.description
            ? sweatLog.description
            : "Self Care Day"
        }
        logButtonPressed={this._logButtonPressed}
        shift={this._closeSweatLog}
        visible={this.state.showSweatLogModal}
        sweatLog={sweatLog}
        isForEdit={true}
      />
    );
  }
  render() {
    console.log("render Journal");
    const sweatLog = this.state.sweatLog;
    console.log(sweatLog);
    const userDetail = this.props.navigation.state.params.userDetail;
    console.log(userDetail);
    const { name, avatar, level } = userDetail;
    var date = new Date(sweatLog.createdAt);

    // Un-comment them if Date problem persists ----------------------- NOTE

    // const date1 = new Date(sweatLog.createdAt);
    // const utcTimeOffset = date1.getTimezoneOffset() / 60;
    // const currentHours = date.getHours();
    // date.setHours(currentHours + utcTimeOffset);

    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    var day = date.getDate();
    var monthDigit = date.getMonth() + 1;
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();
    var displayDate = monthDigit + "/" + day + "/" + year;
    console.log("Date");
    console.log(day);
    console.log(monthDigit);
    console.log(month);
    console.log(year);
    console.log("Display Date");
    console.log(displayDate);
    console.log(sweatLog.mood);
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];

    // alert('Date : ' + date.toString() + "\n\nUTC: " + utcTimeOffset.toString())

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: width,
          backgroundColor: "#fff",
        }}
      >
        {this.renderEntriesView(displayDate, name, sweatLog)}
        <View
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            height: height * 0.2,
            margin: 30,
          }}
        >
          <TouchableOpacity onPress={this._openSweatLog.bind(this)}>
            <View style={styles.button1}>
              <Text allowFontScaling={false} style={styles.button1Text}>
                Edit Journal
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._backToCalendar}>
            <View style={styles.button1}>
              <Text allowFontScaling={false} style={styles.button1Text}>
                Back to Calendar
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderSweatLog()}
      </ScrollView>
    );
  }
}

const styles = {
  headerTitleText: {
    width: "100%",
    height: 27,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0.5,
    textAlign: "left",
    color: colorNew.textPink,
    marginTop: 0,
  },
  titleText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black,
    marginTop: 0,
  },
  button1: {
    width: width * 0.85,
    padding: 10,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: color.mediumPink,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center",
  },
  button1Text: {
    width: "90%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.2,
    textAlign: "center",
    color: color.white,
  },
  editText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "left",
    color: color.black,
    marginTop: 0,
  },
  subTitle1: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    paddingLeft: 0,
    textAlign: "left",
    color: color.mediumGrey,
    marginTop: 1,
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  whiteTitleText: {
    width: "100%",
    height: 28,
    fontFamily: "SF Pro Text",
    fontSize: 26,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 28,
    letterSpacing: 0.5,
    textAlign: "center",
    color: "#000",
    marginTop: 0,
  },
  levelStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.darkPink,
    marginTop: 0,
  },
  nameStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 20,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 0,
  },
  calenderDetailText: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontSize: 8,
    lineHeight: 10,
    textAlign: "center",
    fontStyle: "normal",
    color: color.mediumGrey,
    paddingLeft: 5,
    paddingRight: 5,
  },
  weekDayStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 5,
  },
  selectedTrophyText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    textDecorationLine: "underline",
    color: color.mediumPink,
  },
  unselectedTrophyText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
  },
  seeAllTrophyText: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: color.lightGrey,
    marginTop: 0,
  },
  updateStatsText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft: 8,
    textAlign: "left",
    color: "#000",
  },
  progressSubTitle1: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft: 0,
    textAlign: "left",
    color: color.darkGrey,
  },
  progressSubTitle2: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft: 0,
    textAlign: "left",
    color: color.mediumGrey,
  },
  goalEditText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft: 8,
    textAlign: "left",
    color: "#fff",
  },
  viewAllProgressButtonStyle: {
    width: "95%",
    height: 60,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    alignItems: "center",
    justifyContent: "center",
  },
  createProgressButtonStyle: {
    width: "95%",
    height: 60,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    width: "100%",
    height: 20,
    fontFamily: "Sofia Pro",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
  cellInnerContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  cellContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    paddingLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  weekStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 0,
  },
};
