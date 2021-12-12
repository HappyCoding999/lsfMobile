import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { AsyncStorage } from "react-native";
import { color, colorNew } from "../../modules/styles/theme";
import firebase from "react-native-firebase";
import { EventRegister } from "react-native-event-listeners";
import { SafeAreaView } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import { Dropdown } from "react-native-material-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { width, height } = Dimensions.get("window");
const WORKOUT_ITEM_WIDTH = Math.round(width * 0.75);
const WORKOUT_ITEM_HEIGHT = 50;

import { cancel_round_cross, info_grey } from "../../images";

export default class OutsideWorkout extends Component {
  constructor(props) {
    super(props);
    console.log("OutsideWorkout constructor called");
    console.log(props);
    var minutes = [];
    var hours = [];

    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        hours.push({ value: i });
      }
      minutes.push({ value: i });
    }
    this.state = {
      list: [
        "Aerobics",
        "Barre",
        "Bike Ride",
        "Boxing",
        "Cardio Dance",
        "Circuit Training",
        "Elliptical",
        "General group fitness",
        "HIIT",
        "Indoor run",
        "Outdoor run",
        "Swim",
        "Other",
      ],
      selectedIndexList: [""],
      showEditModal: false,
      hoursList: hours,
      minutesList: minutes,
      editFor: "",
      hoursSelected: 0,
      minuteSelected: 0,
      time: "",
      distance: "",
      weight: "",
      intensity: "Easy",
      checked: false,
      showOthers: false,
      otherValue: "",
    };
  }

  async componentDidMount() {}

  buttonSelected = async (buttonText) => {
    console.log("buttonText: ", buttonText);
  };
  addDataForItem(item) {
    console.log("addDataForItem");
    this.setState({
      showEditModal: true,
      editFor: item,
    });
  }
  setIntensity(intensity) {
    console.log("setIntensity");
    this.setState({
      intensity: intensity,
    });
  }
  hideEditModal() {
    console.log("hideEditModal");
    if (this.state.hoursSelected == 0 && this.state.minuteSelected == 0) {
      Alert.alert(
        "",
        "Please select the time you spent to complete this workout."
      );
      return;
    }

    this.setState({
      showEditModal: false,
    });
    var timeString = "";
    console.log("this.state.hoursSelected = > " + this.state.hoursSelected);
    console.log("this.state.minuteSelected = > " + this.state.minuteSelected);
    if (this.state.hoursSelected > 0 && this.state.minuteSelected > 0) {
      timeString =
        this.state.hoursSelected +
        (this.state.hoursSelected > 1 ? " Hours " : " Hour ") +
        this.state.minuteSelected +
        " Minutes";
    } else if (this.state.hoursSelected > 0 && this.state.minuteSelected == 0) {
      timeString =
        this.state.hoursSelected +
        (this.state.hoursSelected > 1 ? " Hours" : " Hour");
    } else if (this.state.hoursSelected == 0 && this.state.minuteSelected > 0) {
      timeString = this.state.minuteSelected + " Minutes";
    }
    this.props.navigation.state.params.onCompletionPress({
      outsideWorkoutTitle: this.state.editFor,
      Workout: this.props.navigation.state.params.title,
      time: timeString,
      distance: this.state.distance,
      weight: this.state.weight,
      intensity: this.state.intensity,
      createdAt: "",
    });
  }
  _renderItem = ({ item, index }) => {
    console.log(item);
    console.log(index);
    let isDataAvailable = this.state.selectedIndexList.includes(item);
    const { workputTitleText } = styles;
    return (
      <View style={styles.cellContainer}>
        <View style={styles.cellInnerContainer}>
          <TouchableOpacity
            onPress={() => {
              if (index != this.state.list.length - 1) {
                this.setState(
                  {
                    showOthers: false,
                  },
                  () => {
                    this.addDataForItem(item);
                  }
                );
              } else {
                this.setState({
                  showOthers: true,
                });
              }
            }}
          >
            <View
              style={{
                width: WORKOUT_ITEM_WIDTH - 20,
                height: WORKOUT_ITEM_HEIGHT - 1,
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={
                  isDataAvailable
                    ? styles.workputTitleTextPink
                    : styles.workputTitleText
                }
              >
                {item}
              </Text>
              {isDataAvailable ? (
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 5,
                  }}
                >
                  <Text style={styles.workputDataTextPink}>
                    Time: 1 hr 45 min
                  </Text>
                  <Text style={styles.workputDataTextPink}>Weight: 5lb</Text>
                  <Text style={styles.workputDataTextPink}>
                    Intensity: Medium
                  </Text>
                </View>
              ) : null}
            </View>
            <View
              style={{
                width: WORKOUT_ITEM_WIDTH - 20,
                height: 1,
                backgroundColor: "#b2b2b2",
                alignItems: "flex-start",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            ></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  cancelEditModal = () => {
    this.setState({
      showEditModal: false,
      hoursSelected: 0,
      minuteSelected: 0,
      time: "",
      distance: "",
      weight: "",
      intensity: "Easy",
    });
  };
  _renderEditModal() {
    const { showEditModal } = this.state;
    const { time, weight, distance } = this.state;
    if (!this.state.showEditModal) return null;
    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showEditModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            this.hideInfo, console.log("Dialogue Closed");
          }}
        >
          <View style={styles.window}>
            <View style={styles.dialogue}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    height: 10,
                    zIndex: 0,
                    width: 30,
                    marginRight: 20,
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{ padding: 15 }}
                    onPress={this.cancelEditModal}
                  >
                    <Image
                      source={cancel_round_cross}
                      style={{
                        tintColor: colorNew.darkPink,
                        height: 20,
                        width: 20,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                Add Your Workout Details
              </Text>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginRight: "10%",
                }}
              >
                <Text allowFontScaling={false} style={styles.lableText}>
                  Time:{" "}
                </Text>
                <View
                  style={{
                    ...styles.sectionStyle,
                    marginTop: -20,
                    margin: 2,
                    width: width * 0.15,
                    borderBottomColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <Dropdown
                    label=""
                    containerStyle={{ width: 45 }}
                    onChangeText={(value, index, data) => {
                      this.setState({ hoursSelected: value });
                    }}
                    value={this.state.hoursSelected}
                    data={this.state.hoursList}
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={{ ...styles.lableText, marginLeft: "1%" }}
                >
                  hours
                </Text>
                <View
                  style={{
                    ...styles.sectionStyle,
                    marginTop: -20,
                    margin: 2,
                    width: width * 0.15,
                    borderBottomColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <Dropdown
                    label=""
                    containerStyle={{ width: 45 }}
                    onChangeText={(value, index, data) => {
                      this.setState({ minuteSelected: value });
                    }}
                    value={this.state.minuteSelected}
                    data={this.state.minutesList}
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={{ ...styles.lableText, marginLeft: "1%" }}
                >
                  minutes
                </Text>
              </View>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginRight: "10%",
                  marginTop: -10,
                }}
              >
                <Text allowFontScaling={false} style={styles.lableText}>
                  Distance
                  <Text
                    allowFontScaling={false}
                    style={[styles.optionalText, { fontStyle: "italic" }]}
                  >
                    {" "}
                    (if applicable):{" "}
                  </Text>
                </Text>
                <TextInput
                  textAlign={"center"}
                  style={[styles.textInputStyle]}
                  placeholder={""}
                  placeholderTextColor={color.mediumGrey}
                  onChangeText={(distance) => {
                    this.setState({ distance });
                  }}
                >
                  {distance}
                </TextInput>
              </View>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginRight: "10%",
                }}
              >
                <Text allowFontScaling={false} style={styles.lableText}>
                  Weight
                  <Text
                    allowFontScaling={false}
                    style={[styles.optionalText, { fontStyle: "italic" }]}
                  >
                    {" "}
                    (if applicable):{" "}
                  </Text>
                </Text>
                <TextInput
                  textAlign={"center"}
                  style={[styles.textInputStyle]}
                  placeholder={""}
                  placeholderTextColor={color.mediumGrey}
                  onChangeText={(weight) => {
                    this.setState({ weight });
                  }}
                >
                  {weight}
                </TextInput>
              </View>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginRight: "10%",
                  marginTop: 10,
                }}
              >
                <Text allowFontScaling={false} style={styles.lableText}>
                  Intensity:{" "}
                </Text>
                <TouchableOpacity onPress={() => this.setIntensity("Easy")}>
                  <Text
                    allowFontScaling={false}
                    style={
                      this.state.intensity == "Easy"
                        ? styles.intensityOptionTextSelected
                        : styles.intensityOptionText
                    }
                  >
                    Easy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setIntensity("Medium")}>
                  <Text
                    allowFontScaling={false}
                    style={
                      this.state.intensity == "Medium"
                        ? styles.intensityOptionTextSelected
                        : styles.intensityOptionText
                    }
                  >
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setIntensity("Hard")}>
                  <Text
                    allowFontScaling={false}
                    style={
                      this.state.intensity == "Hard"
                        ? styles.intensityOptionTextSelected
                        : styles.intensityOptionText
                    }
                  >
                    Hard
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity onPress={() => this.hideEditModal()}>
                  <Text allowFontScaling={false} style={styles.button1Text}>
                    COMPLETE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
  renderMain() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    return (
      <View style={[this.shadowBottom(5), styles.container]}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          style={{
            width: width * 0.75,
            backgroundColor: "#fff",
            marginTop: 10,
            marginBottom: 10,
          }}
          data={this.state.list}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item + index}
        />

        {this.state.showOthers && (
          <View
            style={{
              // height: 40,
              // width: width * 0.84,
              paddingHorizontal: 20,
              marginVertical: 10,
              borderTopColor: color.lightGrey,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontFamily: "SF Pro Text",
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                color: "#000",
              }}
              value={this.state.otherValue}
              placeholder={"Enter other outside workout"}
              underlineColorAndroid={"transparent"}
              placeholderTextColor={color.mediumGrey}
              onChangeText={(text) => {
                this.setState({ otherValue: text });
              }}
            ></TextInput>
            <TouchableOpacity
              onPress={() => {
                if (
                  this.state.otherValue.trim() === "" ||
                  this.state.otherValue.trim().length < 3
                ) {
                  Alert.alert("", "Enter valid other outside workout.");
                } else {
                  this.setState({
                    showEditModal: true,
                    editFor: this.state.otherValue.trim(),
                  });
                }
              }}
            >
              <Icon name={"arrow-right"} size={24} color={color.bgPink} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  render() {
    const colors = [colorNew.darkPink, colorNew.lightPink];

    return (
      <View
        style={{
          width: width,
          backgroundColor: colorNew.darkPink,
          marginTop: 0,
          height: height,
        }}
      >
        <SafeAreaView forceInset={{ top: "always" }}>
          <KeyboardAwareScrollView style={{ width: width, height: height }}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={colors}
              style={styles.linearGradient}
            >
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: "Sofia Pro",
                    color: "#fff",
                    fontSize: 25,
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                    padding: 40,
                  }}
                >
                  Add An Outside Workout
                </Text>
              </View>
              {this.renderMain()}
              {this._renderEditModal()}
            </LinearGradient>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sectionStyle: {
    marginTop: height * 0.002,
    width: 45,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
    paddingLeft: 5,
  },
  textInputStyle: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 2,
    textAlignVertical: "bottom",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    borderBottomColor: "#ADABAC",
    textAlign: "left",
    borderBottomWidth: 1,
    fontSize: 12,
  },
  buttonView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
    backgroundColor: color.white,
    borderRadius: 100,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
  },
  dialogue: {
    width: "90%",
    height: Platform.OS === "ios" ? 310 : 350,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  workputDataTextPink: {
    height: WORKOUT_ITEM_HEIGHT - 2,
    fontFamily: "SF Pro Text",
    fontSize: 8,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: WORKOUT_ITEM_HEIGHT - 2,
    letterSpacing: 0,
    textAlign: "left",
    color: colorNew.mediumPink,
    marginLeft: 2,
    marginTop: 0,
  },
  workputTitleTextPink: {
    height: WORKOUT_ITEM_HEIGHT - 2,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: WORKOUT_ITEM_HEIGHT - 2,
    letterSpacing: 0.5,
    textAlign: "left",
    color: colorNew.mediumPink,
    marginTop: 0,
  },
  workputTitleText: {
    width: "100%",
    height: WORKOUT_ITEM_HEIGHT - 2,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: WORKOUT_ITEM_HEIGHT - 2,
    letterSpacing: 0.5,
    textAlign: "left",
    color: color.black,
    marginTop: 0,
  },
  cellInnerContainer: {
    width: WORKOUT_ITEM_WIDTH - 20,
    height: WORKOUT_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cellContainer: {
    width: WORKOUT_ITEM_WIDTH,
    height: WORKOUT_ITEM_HEIGHT,
    paddingLeft: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  waterBottoleSelectedText: {
    fontFamily: "Sofia Pro",
    color: colorNew.textPink,
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
    width: "100%",
    padding: 0,
  },
  waterBottoleNormalText: {
    fontFamily: "Sofia Pro",
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
    textAlign: "center",
    width: "100%",
    padding: 0,
  },
  titleText: {
    fontFamily: "Sofia Pro",
    color: "#000",
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    padding: 0,
  },
  linearGradient: {
    width: "100%",
    height: height,
    marginTop: -40,
    padding: "8%",
  },
  container: {
    width: "100%",
    height: "75%",
    marginTop: "1%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
  mainTitle: {
    width: "100%",
    height: 120,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center",
  },
  primaryText: {
    width: 120,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    color: "#ffffff",
    marginTop: 12,
    marginLeft: 26,
  },
  secondaryText: {
    width: 200,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    color: "#f7f7f7",
    marginLeft: 26,
    marginTop: -2,
  },
  priceText: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff",
  },
  priceText2: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff",
  },
  readyText: {
    width: 146,
    height: 26,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 26,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
  },
  freeWorkoutsText: {
    width: 175,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
    textDecorationLine: "underline",
  },
  legalText: {
    width: "96%",
    height: 200,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black,
  },
  legalText2: {
    width: 300,
    height: 54,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  bubbleSelected: {
    padding: 10,
    marginLeft: 5,
    height: 35,
    top: 10,
    backgroundColor: color.lightPink,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.lightPink,
    borderWidth: 1,
  },
  goalViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  planViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  planSaveText: {
    fontFamily: "Sofia Pro",
    color: colorNew.white,
    fontSize: 16,
    letterSpacing: 0,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 0,
  },
  planTitle: {
    fontFamily: "Sofia Pro",
    color: colorNew.darkPink,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planTitleSelected: {
    fontFamily: "Sofia Pro",
    color: color.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planSubtitleSelected: {
    fontFamily: "Sofia Pro",
    color: color.white,
    fontSize: 18,
    fontWeight: "normal",
    textAlign: "center",
    width: "100%",
  },
  planSubtitle: {
    fontFamily: "Sofia Pro",
    color: colorNew.mediumPink,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
  beforeAfterText: {
    fontFamily: "Sofia Pro",
    color: colorNew.bgGrey,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "300",
    width: "90%",
    marginTop: 25,
  },
  planViewSelected: {
    width: "90%",
    backgroundColor: colorNew.darkPink,
    borderRadius: 100,
  },
  planView: {
    width: "80%",
    backgroundColor: color.white,
    borderRadius: 100,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
  },
  progressMainlView: {
    width: "90%",
    height: width * 0.98,
    backgroundColor: colorNew.lightPink,
    borderRadius: 20,
    borderColor: colorNew.darkPink,
    borderWidth: 2,
  },
  progressImageView: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  progressBeforeAfterView: {
    width: "100%",
    height: "68%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  progressPhotoView: {
    width: "44%",
    borderRadius: 20,
    borderColor: colorNew.bgGrey,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "95%",
    backgroundColor: "white",
  },
  modalContainer: {
    flex: 1,
  },
  window: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(148,148,148,0.5)",
  },
  infoMiddleText: {
    width: "90%",
    marginTop: 0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#828282",
  },
  lableText: {
    marginLeft: "10%",
    marginTop: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#8E8D95",
  },
  optionalText: {
    marginLeft: "10%",
    marginTop: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#C9C9CB",
  },
  intensityOptionText: {
    marginLeft: "10%",
    marginTop: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#A8A8AA",
  },
  intensityOptionTextSelected: {
    marginLeft: "10%",
    marginTop: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colorNew.darkPink,
  },
  modalHeaderText: {
    width: "90%",
    height: "15%",
    marginTop: 0,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  button1: {
    width: width * 0.65,
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
    height: 20,
    marginBottom: 5,
    marginTop: 5,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1.5,
    textAlign: "center",
    color: color.mediumPink,
  },
  progressLSFView: {
    width: "100%",
    height: "12%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
