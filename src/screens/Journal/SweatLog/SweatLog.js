import React, { Component } from "react";
import {
  InteractionManager,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
  AsyncStorage,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import firebase from "react-native-firebase";
import { Dropdown } from "react-native-material-dropdown";
const { width, height } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";
import close from "../images/cancel_round_cross.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  next_grey_journal,
  ic_back_white,
  cancel_round_cross,
} from "../../../images";
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
    this.selfCarePressed = this.selfCarePressed.bind(this);
    this._renderSelfCare = this._renderSelfCare.bind(this);

    this.feltPressed = this.feltPressed.bind(this);
    this.moodPressed = this.moodPressed.bind(this);
    console.log("constructor called");
    console.log(props);
    const { headerProps } = props;
    let isForEdit = headerProps.isForEdit;
    var distanceValue = "";
    var timeValue = "";
    var weightValue = "";
    var isD10CompletedValue = false;
    var selfCareValue = [];
    var moodValue = [];
    var feltValue = [];
    var notesValue = "";
    var accomplishmentsValue = "";
    var workoutName = "";
    var createdAtValue = "";
    var selectedBonusChallangeValue = "No";

    if (isForEdit) {
      const { sweatLog } = headerProps;
      console.log("Vishal : sweatLog");
      console.log(sweatLog);

      if (sweatLog != undefined) {
        distanceValue = sweatLog.distance ? sweatLog.distance : "";
        createdAtValue = sweatLog.createdAt ? sweatLog.createdAt : "";
        workoutName = sweatLog.Workout
          ? sweatLog.Workout
          : sweatLog.description
          ? sweatLog.description
          : "";
        timeValue = sweatLog.time ? sweatLog.time : "";
        weightValue = sweatLog.weight ? sweatLog.weight : "";
        isD10CompletedValue = sweatLog.isD10Completed
          ? sweatLog.isD10Completed
          : false;
        feltValue = sweatLog.felt
          ? typeof sweatLog.felt == "string"
            ? [sweatLog.felt]
            : sweatLog.felt
          : [];
        notesValue = sweatLog.notes ? sweatLog.notes : "";
        selectedBonusChallangeValue = sweatLog.bonusChallenge
          ? sweatLog.bonusChallenge
          : "No";
        accomplishmentsValue = sweatLog.accomplishments
          ? sweatLog.accomplishments
          : "";
        moodValue = sweatLog.mood ? sweatLog.mood.split(",") : [];
        selfCareValue = sweatLog.selfCare ? sweatLog.selfCare.split(",") : [];
      }
    } else {
      const { workout } = headerProps;

      workoutName = workout.description;

      timeValue = workout
        ? workout.completionTime
          ? workout.completionTime
          : ""
        : "";
      if (workout && workout.outsideWorkoutData) {
        const { outsideWorkoutData } = workout;
        weightValue = outsideWorkoutData.weight;
        distanceValue = outsideWorkoutData.distance;
      }
    }
    console.log("createdAtValue : " + createdAtValue);
    this.state = {
      entryList: [1, 2, 3, 4, 5, 6, 7, 8],
      createdAt: createdAtValue,
      // seletedWorkout: isForEdit ? workoutName : "",
      seletedWorkout: workoutName,
      workoutNameData: [
        { value: "Legs + Booty" },
        { value: "Cardio Sweat Sesh" },
        { value: "Arms + Abs" },
        { value: "Full Body" },
        { value: "Abs + Cardio" },
        { value: "Self Care Day" },
      ],
      bonusChallangeData: [{ value: "Yes" }, { value: "No" }],
      selectedBonusChallange: selectedBonusChallangeValue,
      felt: feltValue,
      mood: moodValue,
      cares: selfCareValue,
      feelingItem1: [
        { title: "Relaxed", image: ic_relaxed_sweat_log },
        { title: "Strong", image: ic_strong_sweat_log },
        { title: "Energized", image: ic_energized_sweat_log },
        { title: "Happy", image: ic_happy_sweat_log },
        { title: "calm", image: ic_calm_sweat_log },
        { title: "inspired", image: ic_inspired_sweat_log },
      ],
      feelingItem2: [
        { title: "Tired", image: ic_tired_sweat_log },
        { title: "sore", image: ic_sore_sweat_log },
        { title: "Exhausted", image: ic_exhausted_sweat_log },
        { title: "Moody", image: ic_moody_sweat_log },
        { title: "ANGRY", image: ic_angry_sweat_log },
        { title: "PMSing", image: ic_PMSing_sweat_log },
      ],
      selfCareItem: [
        { title: "Excercise", image: ic_exercise_sweat_log },
        { title: "treat", image: ic_treat_sweat_log },
        { title: "Friend Time", image: ic_friend_time_sweat_log },
        { title: "shopping", image: ic_shopping_sweat_log },
        { title: "outdoors", image: ic_outdoors_sweat_log },
      ],
      categories: null,
      time: timeValue,
      weight: weightValue,
      isD10Completed: isD10CompletedValue,
      notes: notesValue,
      accomplishments: accomplishmentsValue,
      distance: distanceValue,
      loading: false,
    };
    console.log("this.state.createdAt : " + this.state.createdAt);

    this.getStarted();
  }

  getStarted = async () => {
    var d10 = await AsyncStorage.getItem("challangeWorkoutDetails");

    try {
      if (d10 === undefined || d10 === null || d10 === {}) {
      } else {
        d10 = JSON.parse(d10);
        var day = new Date(d10.createdAt);
        var currentDay = new Date(Date.now());

        if (
          day.getDate() === currentDay.getDate() &&
          day.getMonth() === currentDay.getMonth() &&
          day.getFullYear() === currentDay.getFullYear()
        ) {
          this.setState({
            isD10Completed: true,
          });
        }
      }
    } catch (ex) {}
  };

  _logItPressed = () => {
    console.log("_logItPressed");
    this.props.navigation.goBack();
  };

  componentDidMount() {}
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
  _renderSeprator() {
    return (
      <View
        style={{ height: 0.5, backgroundColor: "#b2b2b2", width: width * 0.72 }}
      />
    );
  }
  _renderData(title, detail, key) {
    console.log(title);
    console.log(detail);
    const { titleText, subTitle1, editText, headerTitleText } = styles;
    if (key == "header") {
      return (
        <View style={[{ marginTop: 30, marginBottom: 10, width: "100%" }]}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View
              style={{
                width: ITEM_WIDTH - 20,
                height: ITEM_HEIGHT - 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.headerTitleText,
                  { fontSize: 14, fontWeight: "500" },
                ]}
              >
                {title.toUpperCase()}
                {": "}
                <Text
                  style={[
                    styles.editText,
                    {
                      textAlign: "right",
                      color: colorNew.textPink,
                      fontSize: 14,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {detail}
                </Text>
              </Text>
            </View>
          </View>
          {this._renderSeprator()}
        </View>
      );
    }
    return (
      <View
        style={[
          {
            marginTop: 8,
            marginBottom: title == "My Notes" ? 20 : 10,
            width: "90%",
          },
        ]}
      >
        <View style={{ flexDirection: "row", width: "90%" }}>
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
        {title == "My Notes" ? null : this._renderSeprator()}
      </View>
    );
  }
  _renderWorkoutData(title, detail, key) {
    console.log(title);
    console.log(detail);
    const { headerProps } = this.props;
    const { isForEdit } = headerProps;
    const { titleText, subTitle1, editText, headerTitleText } = styles;
    const { time, weight, distance } = this.state;
    let isD10Completed = this.state.isD10Completed;
    const line_height = 15;
    return (
      <View style={[{ marginBottom: 10, width: "100%" }]}>
        {isForEdit ? (
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View
              style={{
                width: ITEM_WIDTH * 0.51,
                height: ITEM_HEIGHT - 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.workoutHeaderTitleText,
                  {
                    fontSize: 12,
                    lineHeight: line_height,
                    height: line_height,
                    fontWeight: "bold",
                  },
                ]}
              >
                {title.toUpperCase()}
                {": "}
              </Text>
            </View>
            <Dropdown
              label=""
              containerStyle={{ width: ITEM_WIDTH * 0.48, marginTop: -20 }}
              onChangeText={(value, index, data) => {
                this.setState({ seletedWorkout: value });
              }}
              value={this.state.seletedWorkout}
              data={this.state.workoutNameData}
            />
          </View>
        ) : (
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View
              style={{
                width: ITEM_WIDTH - 20,
                height: ITEM_HEIGHT - 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.workoutHeaderTitleText,
                  {
                    fontSize: 12,
                    lineHeight: line_height,
                    height: line_height,
                    fontWeight: "bold",
                  },
                ]}
              >
                {title.toUpperCase()}
                {": "}
                <Text
                  style={[
                    styles.editText,
                    {
                      textAlign: "right",
                      color: "#000",
                      fontSize: 12,
                      lineHeight: line_height,
                      height: line_height,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {detail}
                </Text>
              </Text>
            </View>
          </View>
        )}
        {isForEdit ? (
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View
              style={{
                width: ITEM_WIDTH * 0.45,
                height: ITEM_HEIGHT - 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.workoutHeaderTitleText,
                  {
                    fontSize: 12,
                    lineHeight: line_height,
                    height: line_height,
                    fontWeight: "bold",
                  },
                ]}
              >
                {"Bonus Challange: "}
              </Text>
            </View>
            <Dropdown
              label=""
              containerStyle={{ width: ITEM_WIDTH * 0.54, marginTop: -20 }}
              onChangeText={(value, index, data) => {
                this.setState({ selectedBonusChallange: value });
              }}
              value={this.state.selectedBonusChallange}
              data={this.state.bonusChallangeData}
            />
          </View>
        ) : null}

        <View style={[{ marginTop: 0, marginBottom: 0, width: "90%" }]}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text
                style={[
                  styles.titleTextWorkout,
                  {
                    color: "#000",
                    fontSize: 10,
                    lineHeight: line_height,
                    height: line_height,
                    fontWeight: "500",
                  },
                ]}
              >
                {"Time Completed in"}
                {": "}
              </Text>
              <View style={{ height: line_height }}>
                <TextInput
                  textAlign={"center"}
                  // editable={isForEdit}
                  style={[styles.textInputStyle, { width: 90 }]}
                  placeholder={
                    time &&
                    time.toLowerCase() !== "0 seconds" &&
                    time.toLowerCase() !== "0 second" &&
                    time.trim() !== ""
                      ? "Time"
                      : "Minutes"
                  }
                  placeholderTextColor={color.mediumGrey}
                  onChangeText={(time) => {
                    this.setState({ time });
                  }}
                >
                  {/* {time
                    ? time.toLowerCase() == "0 seconds" ||
                      time.toLowerCase() == "0 second"
                      ? "Minutes"
                      : time
                    : "Minutes"} */}
                  {time
                    ? time.toLowerCase() == "0 seconds" ||
                      time.toLowerCase() == "0 second"
                      ? ""
                      : time
                    : ""}
                </TextInput>
              </View>
            </View>
          </View>
        </View>
        <View style={[{ marginTop: 0, marginBottom: 0, width: "90%" }]}>
          <View style={{ flexDirection: "row", width: "90%", marginTop: 5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text
                style={[
                  styles.titleTextWorkout,
                  {
                    color: "#000",
                    lineHeight: line_height,
                    height: line_height,
                    fontSize: 10,
                    fontWeight: "500",
                  },
                ]}
              >
                {"Weights Used"}
                <Text
                  style={[
                    styles.editText,
                    {
                      textAlign: "right",
                      color: "#000",
                      fontSize: 10,
                      fontWeight: "700",
                      fontStyle: "italic",
                    },
                  ]}
                >
                  {" (optional)"}
                </Text>
                <Text
                  style={[
                    styles.titleText,
                    {
                      color: "#000",
                      fontSize: 10,
                      lineHeight: line_height,
                      height: line_height,
                      fontWeight: "500",
                    },
                  ]}
                >
                  {": "}
                </Text>
              </Text>
            </View>
            <View style={{ height: line_height }}>
              <TextInput
                textAlign={"center"}
                style={[styles.textInputStyle, { width: 50 }]}
                placeholder={"Weight"}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(weight) => {
                  this.setState({ weight });
                }}
              >
                {weight}
              </TextInput>
            </View>
          </View>
        </View>
        <View style={[{ marginTop: 0, marginBottom: 0, width: "90%" }]}>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text
                style={[
                  styles.titleTextWorkout,
                  {
                    color: "#000",
                    fontSize: 10,
                    lineHeight: line_height,
                    height: line_height,
                    fontWeight: "500",
                  },
                ]}
              >
                {"Distance"}
                <Text
                  style={[
                    styles.editText,
                    {
                      textAlign: "right",
                      color: "#000",
                      fontSize: 10,
                      fontWeight: "700",
                      fontStyle: "italic",
                    },
                  ]}
                >
                  {" (if applicable)"}
                </Text>
                <Text
                  style={[
                    styles.titleText,
                    {
                      color: "#000",
                      fontSize: 10,
                      lineHeight: line_height,
                      height: line_height,
                      fontWeight: "500",
                    },
                  ]}
                >
                  {": "}
                </Text>
              </Text>
            </View>
            <View style={{ height: line_height }}>
              <TextInput
                textAlign={"center"}
                style={[styles.textInputStyle, { width: 65 }]}
                placeholder={"Distance"}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(distance) => {
                  this.setState({ distance });
                }}
              >
                {distance}
              </TextInput>
            </View>
          </View>
        </View>
        <View style={[{ marginTop: 0, marginBottom: 0, width: "90%" }]}>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              marginTop: 5,
              marginBottom: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Text
                style={[
                  styles.titleTextWorkout,
                  {
                    color: "#000",
                    fontSize: 10,
                    lineHeight: line_height,
                    height: line_height,
                    fontWeight: "500",
                  },
                ]}
              >
                {"Daily 10"}
                <Text
                  style={[
                    styles.titleText,
                    {
                      color: "#000",
                      fontSize: 10,
                      lineHeight: line_height,
                      height: line_height,
                      fontWeight: "500",
                    },
                  ]}
                >
                  {": "}
                </Text>
              </Text>
            </View>
            <View style={{ height: line_height }}>
              <TextInput
                editable={false}
                textAlign={"center"}
                style={[styles.textInputStyle, { width: 65 }]}
                placeholder={""}
                placeholderTextColor={color.mediumGrey}
              >
                {isD10Completed ? "Completed" : ""}
              </TextInput>
            </View>
          </View>
        </View>
        {this._renderSeprator()}
      </View>
    );
  }
  _renderFeelArrow() {
    return (
      <Image
        style={{ height: "60%", width: 12, resizeMode: "center" }}
        source={next_grey_journal}
      />
    );
  }
  _renderFeelData(title, fillcolor) {
    return (
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <View
          style={{
            width: (ITEM_WIDTH - 20) / 8,
            height: (ITEM_WIDTH - 20) / 8,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: fillcolor,
            borderWidth: 1,
            borderColor: colorNew.borderGrey,
            borderRadius: 100,
          }}
        ></View>
        <Text
          style={[
            styles.titleText,
            {
              color: "#000",
              fontSize: 6,
              fontWeight: "normal",
              textAlign: "center",
            },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }
  _renderSelfCareData(title) {
    return (
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <View
          style={{
            width: (ITEM_WIDTH - 20) / 6,
            height: (ITEM_WIDTH - 20) / 6,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: colorNew.boxGrey,
            borderWidth: 1,
            borderColor: colorNew.borderGrey,
          }}
        ></View>
        <Text
          style={[
            styles.titleText,
            {
              color: "#000",
              fontSize: 7,
              fontWeight: "normal",
              textAlign: "center",
            },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      </View>
    );
  }
  _renderSelfCare() {
    const { titleText, subTitle1, editText, headerTitleText } = styles;
    console.log("vishal this.state.selfCareItem");
    console.log(this.state.selfCareItem);
    console.log("vishal this.state.cares");
    console.log(this.state.cares);
    return (
      <View style={[{ marginTop: 10, marginBottom: 10, width: "100%" }]}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View
            style={{
              width: ITEM_WIDTH - 20,
              height: ITEM_HEIGHT - 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styles.headerTitleText,
                { fontSize: 12, fontWeight: "bold" },
              ]}
            >
              {"today's self care?".toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              width: ITEM_WIDTH,
              justifyContent: "space-around",
              flexDirection: "row",
            },
          ]}
        >
          <FlatList
            horizontal={true}
            style={{ flex: 1, width: width }}
            data={this.state.selfCareItem}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.selfCarePressed(item)}>
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      width: (ITEM_WIDTH - 20) / 4.5,
                      height: (ITEM_WIDTH - 20) / 7,
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderWidth: 0,
                      borderColor: colorNew.borderGrey,
                      borderRadius: 100,
                    }}
                  >
                    <Image
                      style={{ height: "95%", top: 0 }}
                      resizeMode="contain"
                      source={item.image}
                    />
                  </View>
                  {this.state.cares.length > 0 &&
                  this.state.cares.includes(item.title) ? (
                    <Text
                      style={[
                        styles.titleText,
                        {
                          color: "#000",
                          fontSize: 6,
                          fontWeight: "normal",
                          textAlign: "center",
                          textDecorationLine: "underline",
                        },
                      ]}
                    >
                      {item.title.toUpperCase()}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.titleText,
                        {
                          color: "#000",
                          fontSize: 7,
                          fontWeight: "normal",
                          textAlign: "center",
                        },
                      ]}
                    >
                      {item.title.toUpperCase()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
          {/*this._renderSelfCareData('Excersize')*/}
          {/*this._renderSelfCareData('treat')*/}
          {/*this._renderSelfCareData('Friend time')*/}
          {/*this._renderSelfCareData('shopping')*/}
          {/*this._renderSelfCareData('outdoors')*/}
          {/*this._renderFeelArrow()*/}
        </View>
        {this._renderSeprator()}
      </View>
    );
  }
  feltPressed(item) {
    console.log("feltPressed");
    console.log(item);
    const { felt = [] } = this.state;

    if (felt.includes(item.title)) {
      this.setState({
        felt: felt.filter((feltTitle) => feltTitle != item.title),
      });
    } else {
      this.setState({ felt: [...felt, item.title] });
    }
  }
  moodPressed(item) {
    console.log("moodPressed");
    console.log(item);
    let mymoods = this.state.mood;
    let index = mymoods.indexOf(item.title);
    if (index > -1) {
      mymoods.splice(index, 1);
    } else {
      mymoods.push(item.title);
    }
    console.log(mymoods);
    this.setState({ mood: mymoods });
  }
  selfCarePressed(item) {
    console.log("selfCarePressed");
    console.log(item);
    let mycares = this.state.cares;
    let index = mycares.indexOf(item.title);
    if (index > -1) {
      mycares.splice(index, 1);
    } else {
      mycares.push(item.title);
    }
    console.log(mycares);
    this.setState({ cares: mycares });
  }
  _renderAccomplishmentOrNotes(isForNotes) {
    const { titleText, subTitle1, editText, headerTitleText } = styles;
    let placeholderText =
      isForNotes == true
        ? "Type your thoughts here..."
        : "Completed Daily 10, Reaching Hydration Goal, Trophies Earned etc.";
    let title = isForNotes == true ? "Your Notes:" : "today's Accomplishments:";
    const { headerProps } = this.props;
    var text = "";
    if (headerProps.isForEdit && headerProps.sweatLog != undefined) {
      const { sweatLog } = headerProps;
      if (isForNotes) {
        text = sweatLog.notes;
      } else {
        text = sweatLog ? sweatLog.accomplishments : "";
      }
    }
    console.log("this.state.accomplishments : " + this.state.accomplishments);
    console.log("this.state.notes : " + this.state.notes);
    return (
      <View
        style={[
          { marginTop: 10, marginBottom: 10, width: "100%", height: 180 },
        ]}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View
            style={{
              width: ITEM_WIDTH - 20,
              height: ITEM_HEIGHT - 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styles.headerTitleText,
                { fontSize: 12, fontWeight: "bold" },
              ]}
            >
              {title.toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              width: ITEM_WIDTH,
              flex: 1,
              justifyContent: "space-around",
              backgroundColor: "#fff",
              borderColor: colorNew.boxGrey,
              borderWidth: 1,
              marginBottom: 30,
            },
          ]}
        >
          <TextInput
            textAlign={"left"}
            style={[styles.textInputAccomplishStyle]}
            placeholder={placeholderText}
            multiline={true}
            blurOnSubmit={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            underlineColorAndroid="transparent"
            placeholderTextColor={color.mediumGrey}
            onChangeText={(text) => {
              isForNotes
                ? this.setState({ notes: text })
                : this.setState({ accomplishments: text });
            }}
          >
            {text}
          </TextInput>
        </View>
        {isForNotes ? null : this._renderSeprator()}
      </View>
    );
  }
  _renderFeelText(title, isForMood) {
    if (
      (isForMood && this.state.mood.includes(title)) ||
      (isForMood == false &&
        this.state.felt != undefined &&
        this.state.felt.length > 0 &&
        this.state.felt.includes(title))
    ) {
      return (
        <Text
          style={[
            styles.titleText,
            {
              color: "#000",
              fontSize: 6,
              fontWeight: "normal",
              textAlign: "center",
              textDecorationLine: "underline",
            },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      );
    } else {
      return (
        <Text
          style={[
            styles.titleText,
            {
              color: "#000",
              fontSize: 6,
              fontWeight: "normal",
              textAlign: "center",
            },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      );
    }
  }
  _renderFeel(title, isForMood) {
    const { headerProps } = this.props;
    console.log(headerProps);
    var value = [];
    if (headerProps.isForEdit && headerProps.sweatLog != undefined) {
      const { sweatLog } = headerProps;
      if (isForMood) {
        console.log(sweatLog.mood);
      } else {
        console.log(sweatLog.felt);
      }
    }
    const { titleText, subTitle1, editText, headerTitleText } = styles;
    return (
      <View style={[{ marginTop: 10, marginBottom: 10, width: "100%" }]}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View
            style={{
              width: ITEM_WIDTH - 20,
              height: ITEM_HEIGHT - 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styles.headerTitleText,
                { fontSize: 12, fontWeight: "bold" },
              ]}
            >
              {title.toUpperCase()}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              width: ITEM_WIDTH,
              justifyContent: "space-around",
              flexDirection: "row",
            },
          ]}
        >
          <FlatList
            horizontal={true}
            style={{ flex: 1, width: width - 50 }}
            data={this.state.feelingItem1}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  isForMood ? this.moodPressed(item) : this.feltPressed(item)
                }
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      width: (ITEM_WIDTH - 20) / 5.5,
                      height: (ITEM_WIDTH - 20) / 8,
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderWidth: 0,
                      borderColor: colorNew.borderGrey,
                      borderRadius: 100,
                    }}
                  >
                    <Image
                      style={{ height: "95%", top: 0 }}
                      resizeMode="contain"
                      source={item.image}
                    />
                  </View>
                  {this._renderFeelText(item.title, isForMood)}
                  {/*<Text style={[styles.titleText,{color:"#000",fontSize: 6,fontWeight: "normal",textAlign: "center"}]}>{item.title.toUpperCase()}</Text>*/}
                </View>
              </TouchableOpacity>
            )}
          />
          {/*this._renderFeelData('Relaxed',colorNew.fillPink)*/}
          {/*this._renderFeelData('Strong',colorNew.fillPink)*/}
          {/*this._renderFeelData('Energized',colorNew.fillPink)*/}
          {/*this._renderFeelData('Happy',colorNew.fillPink)*/}
          {/*this._renderFeelData('calm',colorNew.fillPink)*/}
          {/*this._renderFeelData('inspired',colorNew.fillPink)*/}
          {/*this._renderFeelArrow()*/}
        </View>
        <View
          style={[
            {
              width: ITEM_WIDTH,
              justifyContent: "space-around",
              flexDirection: "row",
            },
          ]}
        >
          <FlatList
            horizontal={true}
            style={{ flex: 1, width: width - 50 }}
            data={this.state.feelingItem2}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  isForMood ? this.moodPressed(item) : this.feltPressed(item)
                }
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={{
                      width: (ITEM_WIDTH - 20) / 5.5,
                      height: (ITEM_WIDTH - 20) / 8,
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderWidth: 0,
                      borderColor: colorNew.borderGrey,
                      borderRadius: 100,
                    }}
                  >
                    <Image
                      style={{ height: "95%", top: 0 }}
                      resizeMode="contain"
                      source={item.image}
                    />
                  </View>
                  {this._renderFeelText(item.title, isForMood)}
                  {/*<Text style={[styles.titleText,{color:"#000",fontSize: 6,fontWeight: "normal",textAlign: "center"}]}>{item.title.toUpperCase()}</Text>*/}
                </View>
              </TouchableOpacity>
            )}
          />
          {/*this._renderFeelData('Tired',colorNew.fillTeal)*/}
          {/*this._renderFeelData('sore',colorNew.fillTeal)*/}
          {/*this._renderFeelData('Exhausted',colorNew.fillTeal)*/}
          {/*this._renderFeelData('Moody',colorNew.fillTeal)*/}
          {/*this._renderFeelData('ANGRY',colorNew.fillTeal)*/}
          {/*this._renderFeelData('PMSing',colorNew.fillTeal)*/}
          {/*this._renderFeelArrow()*/}
        </View>
        {this._renderSeprator()}
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
  renderEntriesView() {
    console.log("renderEntriesView");
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
    const { headerProps } = this.props;
    console.log(headerProps);
    const { headerText } = headerProps;
    var titleHeader = headerText;
    console.log(headerText);
    if (headerProps.isForEdit && headerProps.sweatLog != undefined) {
      const { sweatLog } = headerProps;
      titleHeader = sweatLog.Workout;
    }
    return (
      <View
        style={[
          this.shadowBottom(5),
          {
            width: "85%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 40,
            padding: 20,
            paddingBottom: 10,
            backgroundColor: "#fff",
          },
        ]}
      >
        {/* <ScrollView
          vertical
          horizontal={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        > */}
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
          scrollEnabled={true}
        >
          <View style={{ width: "80%" }}>
            {this._renderWorkoutData("Workout Details", titleHeader, "header")}
            {this._renderFeel("How does your body feel?", false)}
            {this._renderFeel("How do you feel?", true)}
            {this._renderSelfCare()}
            {this._renderAccomplishmentOrNotes(false)}
            {this._renderAccomplishmentOrNotes(true)}
          </View>
        </KeyboardAwareScrollView>
        {/* </ScrollView> */}
      </View>
    );
  }

  _onLogItPressed = () => {
    // console.log("_onLogItPressed 1");
    if (this.state.loading) {
      console.log("loading is in progress");
      return;
    }
    const { logButtonPressed } = this.props;
    /* const {
      sliderValues,
      moods,
      cares,
      sore,
      notes
    } = this;

    const mood = Object.keys(moods).reduce((result, mood) => {
      if (moods[mood]) {
        return [...result, mood];
      }
      return result;
    }, []).join(",");

    const selfCare = Object.keys(cares).reduce((result, care) => {
      if (cares[care]) {
        return [...result, care];
      }
      return result;
    }, []).join(",");
    */
    const { headerProps } = this.props;
    console.log(headerProps);
    const { headerText } = headerProps;
    const mood = this.state.mood.join(",");
    const selfCare = this.state.cares.join(",");
    console.log("_onLogItPressed");

    const { workout } = headerProps;
    console.log(workout);

    if (workout == undefined) {
      alert("workoutDetail Not available.");
      return;
    }

    // alert(this.state.seletedWorkout);

    this.setState({ loading: true });

    // console.log("workout::::--::: " + JSON.stringify(workout));

    if (workout && workout.outsideWorkoutData) {
      const { outsideWorkoutData } = workout;

      // var sl = { ...sweatLog, createdAt: Date.now() };
      // alert(
      //   "1. sweatLog : " +
      //     JSON.stringify({
      //       createdAt: this.state.createdAt,
      //       bonusChallenge: this.state.selectedBonusChallange,
      //       // Workout: this.state.seletedWorkout,
      //       Workout: outsideWorkoutData.Workout,
      //       time: this.state.time,
      //       weight: this.state.weight,
      //       isD10Completed: this.state.isD10Completed,
      //       distance: this.state.distance,
      //       felt: this.state.felt,
      //       mood,
      //       selfCare,
      //       accomplishments: this.state.accomplishments,
      //       intensity: outsideWorkoutData.intensity,
      //       outsideWorkoutTitle: outsideWorkoutData.outsideWorkoutTitle,
      //       notes: this.state.notes,
      //     })
      // );

      logButtonPressed({
        createdAt: this.state.createdAt,
        bonusChallenge: this.state.selectedBonusChallange,
        // Workout: this.state.seletedWorkout,
        Workout: outsideWorkoutData.Workout,
        time: this.state.time,
        weight: this.state.weight,
        isD10Completed: this.state.isD10Completed,
        distance: this.state.distance,
        felt: this.state.felt,
        mood,
        selfCare,
        accomplishments: this.state.accomplishments,
        intensity: outsideWorkoutData.intensity,
        outsideWorkoutTitle: outsideWorkoutData.outsideWorkoutTitle,
        notes: this.state.notes,
      });
    } else {
      logButtonPressed({
        createdAt: this.state.createdAt,
        bonusChallenge: this.state.selectedBonusChallange,
        Workout: this.state.seletedWorkout,
        time: this.state.time,
        weight: this.state.weight,
        isD10Completed: this.state.isD10Completed,
        distance: this.state.distance,
        felt: this.state.felt,
        mood,
        selfCare,
        accomplishments: this.state.accomplishments,
        notes: this.state.notes,
      });
    }
    /*
    logButtonPressed({
      effort: sliderValues.effort,
      felt: sliderValues.felt,
      mood,
      selfCare,
      sore,
      notes
    });*/
  };

  render() {
    console.log("render SweatLog");
    const colors = [colorNew.darkPink, colorNew.lightPink];
    // const { headerProps } = this.props;
    // console.log(headerProps)
    // const { onClose } = headerProps;
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={colors}
          style={styles.linearGradient}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            {this.props.needToDisplayInModal == true ? (
              <View
                style={{
                  justifyContent: "center",
                  marginHorizontal: 20,
                  marginVertical: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {/*<TouchableOpacity style={{ zIndex: 3, height:40, width:40 }} onPress={this._onLogItPressed}>
                    <Image style={{ height: '90%', tintColor:'#fff'}} resizeMode="contain" source={ic_back_white} />
                  </TouchableOpacity>*/}
                  <TouchableOpacity
                    style={{ zIndex: 3, height: 40, width: 40 }}
                  ></TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginTop: 30,
                    marginBottom: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sofia Pro",
                      color: "#fff",
                      fontSize: 25,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Your Daily Journal
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      zIndex: 3,
                      height: 40,
                      width: 40,
                      alignItems: "flex-end",
                    }}
                    onPress={() =>
                      this.props.headerProps.onClose
                        ? this.props.headerProps.onClose()
                        : console.log("check")
                    }
                  >
                    <Image
                      style={{ height: "90%", tintColor: "#fff" }}
                      resizeMode="contain"
                      source={cancel_round_cross}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 25,
                }}
              >
                <Text style={styles.whiteTitleText}>Your Daily Journal</Text>
              </View>
            )}

            {this.renderEntriesView()}
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
                height: height * 0.1,
              }}
            >
              <TouchableOpacity onPress={this._onLogItPressed}>
                <View style={styles.button1}>
                  {this.state.loading ? (
                    <ActivityIndicator
                      animating={true}
                      color="white"
                      size="small"
                    />
                  ) : (
                    <Text allowFontScaling={false} style={styles.button1Text}>
                      Log It!
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
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
    letterSpacing: 0,
    textAlign: "left",
    color: colorNew.textPink,
    marginTop: 0,
  },
  workoutHeaderTitleText: {
    width: "100%",
    height: 27,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    color: colorNew.textPink,
    marginTop: 0,
  },
  textInputStyle: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 2,
    textAlignVertical: "bottom",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    borderBottomColor: colorNew.boxGrey,
    borderBottomWidth: 1,
    fontSize: 10,
  },
  textInputAccomplishStyle: {
    flex: 1,
    margin: 5,
    textAlignVertical: "top",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    fontSize: 11,
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
  titleTextWorkout: {
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
    backgroundColor: colorNew.darkPink,
    borderColor: colorNew.darkPink,
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
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 14,
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
    color: "#fff",
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
