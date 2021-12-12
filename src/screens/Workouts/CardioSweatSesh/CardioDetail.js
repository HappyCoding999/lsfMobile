import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import { LargeButton, MediumButton } from "../../../components/common";
import { EventRegister } from "react-native-event-listeners";
import { ConnectedMusicButtons } from "../../../components/common";
import LinearGradient from "react-native-linear-gradient";
import firebase from "react-native-firebase";
import { Dropdown } from "react-native-material-dropdown";
import closeButton from "../images/iconCircleclose.png";

const { width, height } = Dimensions.get("window");
const itemRatio = 125 / 160;
export default class extends Component {
  constructor(props) {
    console.log("Cardio Detail");
    console.log(props);
    super(props);

    var minutes = [];
    var hours = [];

    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        hours.push({ value: i });
      }
      minutes.push({ value: i });
    }
    this.hideEditModal = this.hideEditModal.bind(this);
    this.state = {
      videoList: [],
      videoUrl: "",
      hoursSelected: 0,
      minuteSelected: 0,
      showEditModal: false,
      intensity: "Easy",
      hoursList: hours,
      minutesList: minutes,
      challenges: [
        {
          title: "Hot Body HIIT - Full Body",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/MABUbpDl.jpg",
        },
        {
          title: "Earlier this morning, NYC",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/KZsmUi2l.jpg",
        },
        {
          title: "White Pocket Sunset",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/MABUbpDl.jpg",
        },
        {
          title: "Acrocorinth, Greece",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/KZsmUi2l.jpg",
        },
      ],
    };
  }

  componentDidMount() {
    if (this.state.videoList.length === 0) {
      this._retrieveVideoData();
    }
    console.log(this.state.videoList);
  }

  _retrieveVideoData = async () => {
    const { type } = this.props;
    let category = type.replace("Cardio", "Workouts");
    console.log("_retrieveVideoData 1");
    console.log(category);

    console.log("Check 1");
    let ref = firebase.database().ref("videos");
    let title = "";
    ref
      .orderByChild("subcategory")
      .limitToFirst(4)
      .equalTo(category)
      .once("value")
      .then((snapshot) => {
        const fbObject = snapshot.val();
        const newArr = Object.values(fbObject);

        this.setState({
          videoList: newArr.reverse(),
        });
      });
  };
  addDataForItem() {
    this.setState({
      showEditModal: true,
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
    this.setState({
      showEditModal: false,
    });
    setTimeout(() => {
      this.props.onCompletionPress(timeString);
    }, 500);
  }
  setIntensity(intensity) {
    console.log("setIntensity");
    this.setState({
      intensity: intensity,
    });
  }

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
                ></View>
              </View>

              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                GREAT JOB!
              </Text>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                How long was your workout?
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
              <View style={styles.buttonView}>
                <TouchableOpacity onPress={() => this.hideEditModal()}>
                  <Text allowFontScaling={false} style={styles.button1Text}>
                    COMPLETE
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({
                    showEditModal: false,
                  });
                }}
                style={{ position: "absolute", right: 20, top: 20 }}
              >
                <Image source={closeButton} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  render() {
    console.log("render called in cardio Detail");
    const {
      onSweatSoloPress,
      onVideoLibraryPress,
      onCompletionPress,
      onSkipPress,
      onOutsideWorkoutPress,
    } = this.props;
    const { videoUrl, thumbnailUrl, videoName, videoDescription } = this.state;
    const colors = [color.mediumPink, colorNew.lightPink];
    let itemWidth = (width * 0.95 - 42) / 2;
    let gridHeight = itemWidth * 1.1 * 2 + 40;
    console.log(this.state.videoList);
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text allowFontScaling={false} style={styles.mainTitle}>
            {this.props.mainTitle}
          </Text>
          <Text allowFontScaling={false} style={styles.secondTitle}>
            {this.props.secondTitle.toUpperCase()} |{" "}
            {this.props.type.toUpperCase()}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: width,
          }}
        >
          <View style={styles.gridTitleContainer}>
            <Text allowFontScaling={false} style={styles.innerTitle}>
              Choose a Video
            </Text>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: "space-around", padding: 10 }}
              activeOpacity={0.9}
              onPress={() =>
                EventRegister.emit("paywallEvent", onVideoLibraryPress)
              }
            >
              <Text allowFontScaling={false} style={styles.innerSubTitleText}>
                SEE ALL
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              height: gridHeight,
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <FlatList
              data={this.state.videoList}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.gridcontainer}
              renderItem={this.renderGridItem}
              keyExtractor={(item, idx) => item + idx}
            />
          </View>
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <View style={{ marginTop: 10 }}>
              <MediumButton
                onPress={() =>
                  EventRegister.emit("paywallEvent", onSweatSoloPress)
                }
              >
                <Text>Cardio Timer</Text>
              </MediumButton>
            </View>
            <View style={{ marginTop: 22 }}>
              <MediumButton
                onPress={() =>
                  EventRegister.emit("paywallEvent", onOutsideWorkoutPress)
                }
              >
                <Text>Outside Workout</Text>
              </MediumButton>
            </View>
            <View style={{ marginTop: 22, marginBottom: 22 }}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={colors}
                style={styles.linearGradient}
              >
                <TouchableOpacity
                  onPress={() =>
                    EventRegister.emit(
                      "paywallEvent",
                      this.addDataForItem.bind(this)
                    )
                  }
                  style={styles.logButton}
                >
                  <View>
                    <Text
                      allowFontScaling={false}
                      style={styles.whiteButtonText}
                    >
                      Log Workout
                    </Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
        {this.props.renderVideoModal(
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription
        )}
        {this._renderEditModal()}
      </View>
    );
  }

  renderGridItem = ({ item }) => {
    let itemWidth = (width * 0.95 - 42) / 2;
    const { onVideoLibraryPress } = this.props;
    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: (width * 0.95) / 2,
          height: itemWidth * 1.1,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "space-around", padding: 10 }}
          activeOpacity={0.9}
          onPress={() => this._checkVideoPaywall(item)}
        >
          <View
            style={{
              width: itemWidth,
              backgroundColor: "#ddd",
              height: itemWidth * itemRatio,
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <ImageBackground
              style={{ width: "100%", height: "100%" }}
              source={{ uri: item.thumbnailUrl }}
            />
          </View>
          <Text
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.7}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.gridText}
          >
            {item.videoName}
          </Text>
          <Text
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.7}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.subTitleTextPink}
          >
            {item.duration ? item.duration + " min" : "0 min"}
            <Text
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.subTitleText}
            >
              {" "}
              | {item.videoDescription}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  _checkVideoPaywall = (item) => {
    const { isFree, videoUrl, thumbnailUrl, videoName, videoDescription } =
      item;

    console.log("_checkVideoPaywall");
    console.log(item);
    if (isFree) {
      return this._showVideoFullScreen(
        videoUrl,
        thumbnailUrl,
        videoName,
        videoDescription
      )();
    } else {
      return EventRegister.emit(
        "paywallEvent",
        this._showVideoFullScreen(
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription
        )
      );
    }
  };

  _showVideoFullScreen =
    (videoUrl, thumbnailUrl, videoName, videoDescription) => () => {
      console.log("_showVideoFullScreen");
      console.log(videoUrl);
      const { openVideoModal } = this.props;
      this.setState(
        {
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
        },
        () =>
          openVideoModal(videoUrl, thumbnailUrl, videoName, videoDescription)
      );
    };
  _renderSkipBtn() {
    const { onSkipPress } = this.props;
    if (onSkipPress) {
      return (
        <View style={{ marginTop: 22 }}>
          <TouchableOpacity
            onPress={() => EventRegister.emit("paywallEvent", onSkipPress)}
            style={styles.completeButton}
          >
            <View>
              <Text allowFontScaling={false} style={styles.smallButtonText}>
                SKIP WORKOUT NEW
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorNew.darkPink,
  },
  gridTitleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colorNew.white,
  },
  mainTitle: {
    width: "100%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 90,
  },
  innerTitle: {
    width: "50%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 20,
    color: "#000",
    marginTop: 20,
  },
  innerSubTitleText: {
    width: "50%",
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 0,
    color: "#000",
    marginTop: 20,
  },
  secondTitle: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.white,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  completeButton: {
    width: 315,
    height: 48,
    borderColor: color.mediumPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logButton: {
    width: width * 0.7,
    height: 48,
    borderRadius: 100,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    width: width * 0.7,
    height: 48,
    borderRadius: 100,
    backgroundColor: "color.mediumPink",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
    paddingRight: 12,
    margin: 0,
  },
  smallButtonText: {
    width: 315,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
  gridcontainer: {
    width: width,
    marginTop: 2,
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  gridText: {
    width: "96%",
    height: 19,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    paddingLeft: 5,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000",
    marginTop: 15,
  },
  subTitleTextPink: {
    width: "96%",
    height: 19,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontStyle: "normal",
    lineHeight: 20,
    paddingLeft: 5,
    letterSpacing: 0,
    textAlign: "left",
    color: color.mediumPink,
    marginTop: 8,
  },
  subTitleText: {
    width: "96%",
    height: 19,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft: 5,
    textAlign: "left",
    color: colorNew.bgGrey,
    marginTop: 8,
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
  dialogue: {
    width: "90%",
    height: Platform.OS === "ios" ? 310 : 360,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
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
  buttonView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
    backgroundColor: color.white,
    borderRadius: 100,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
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
  whiteButtonText: {
    width: 315,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
};
