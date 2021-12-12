import React, { Component } from "react";
import {
  InteractionManager,
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  TextInput,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { Header } from "react-native-elements";
import moment from "moment";
import { LoadingComponent, MediumButton } from "../../components/common";
import { challenge_pink_mark_rounded } from "../../images";
import { isEmpty } from "lodash";
import { color, colorNew } from "../../modules/styles/theme";

import LinearGradient from "react-native-linear-gradient";

const { height, width } = Dimensions.get("window");

export default class extends Component {
  constructor(props) {
    super(props);
    console.log("Vishal - Check props");
    console.log(props);
    this.state = {
      thisWeekData: [],
    };
    // this.state = {
    //   thisWeekData: [
    //       {
    //           title: 'Sweat Sesh',
    //           time: '20 min',
    //           subtitle: 'Strenthen, tone, and BURN',
    //           featureImageUrl: 'https://i.imgur.com/MABUbpDl.jpg',
    //           isCompleted:true
    //       },
    //       {
    //           title: 'Daily 10',
    //           time: '20 min',
    //           subtitle: 'Strenthen, tone, and BURN',
    //           featureImageUrl: 'https://i.imgur.com/KZsmUi2l.jpg',
    //           isCompleted:false
    //       },
    //       {
    //           title: 'Cardio',
    //           time: '20 min',
    //           subtitle: 'Strenthen, tone, and BURN',
    //           featureImageUrl: 'https://i.imgur.com/MABUbpDl.jpg',
    //           isCompleted:false
    //       }
    //   ]
    // }
  }

  componentDidMount() {
    let handle = InteractionManager.createInteractionHandle();
    var data = [];
    const {
      weeklyWorkoutSchedule,
      daily10,
      isRegularWorkoutCompletedForToday,
      isD10CompletedForToday,
      isBonusCompletedForToday,
    } = this.props;
    const {
      challengeBonusText,
      challengeBonusButtonText,
      challengeBonusPicture,
      challengeBonusSectionData,
    } = this.props;
    if (weeklyWorkoutSchedule) {
      console.log("today in today's move");
      console.log(weeklyWorkoutSchedule);
      var todayData = [];

      todayData["description"] = weeklyWorkoutSchedule.description;
      todayData["imageUrl"] = weeklyWorkoutSchedule.imageUrl;
      todayData["buttonText"] = "START NOW";
      todayData["data"] = weeklyWorkoutSchedule;
      todayData["isCompleted"] = isRegularWorkoutCompletedForToday;
      data.push(todayData);
    }
    // if (weeklyWorkoutSchedule && weeklyWorkoutSchedule.today) {
    //   const { today } = weeklyWorkoutSchedule;
    //   console.log("today in today's move");
    //   console.log(today);
    //   var todayData = [];

    //   todayData["description"] = today.description;
    //   todayData["imageUrl"] = today.imageUrl;
    //   todayData["buttonText"] = "START NOW";
    //   todayData["data"] = today;
    //   todayData["isCompleted"] = isRegularWorkoutCompletedForToday;

    //   data.push(todayData);
    // }
    if (daily10) {
      console.log(daily10);
      let imageURL = daily10.ssuPhoto;
      var daily10Data = [];

      daily10Data["description"] = "Daily 10";
      daily10Data["imageUrl"] = imageURL;
      daily10Data["buttonText"] = "START NOW";
      daily10Data["data"] = daily10;
      daily10Data["isCompleted"] = isD10CompletedForToday;
      console.log("daily10Data");
      console.log(daily10Data);
      data.push(daily10Data);
    }
    if (
      challengeBonusText &&
      challengeBonusPicture &&
      challengeBonusSectionData
    ) {
      var bonusData = [];
      bonusData["description"] = challengeBonusText;
      bonusData["imageUrl"] = challengeBonusPicture;
      bonusData["buttonText"] = challengeBonusButtonText
        ? challengeBonusButtonText
        : "START NOW";
      bonusData["data"] = challengeBonusSectionData;
      bonusData["isCompleted"] = isBonusCompletedForToday;
      console.log("bonusData");
      console.log(bonusData);
      data.push(bonusData);
    }
    this.setState({
      thisWeekData: data,
    });
    InteractionManager.clearInteractionHandle(handle);
  }

  render() {
    console.log("render ChallengeTodaysMove");

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <FlatList
          contentContainerStyle={{
            paddingLeft: width * 0.05,
            paddingRight: width * 0.05,
          }}
          data={this.state.thisWeekData}
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          scrollEnabled={true}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: 10,
                height: "100%",
                backgroundColor: "transparent",
              }}
            />
          )}
          style={{ width: "100%", backgroundColor: "#fff", padding: 0 }}
          renderItem={this._renderVideos}
          keyExtractor={(item, idx) => item + idx}
        />
      </View>
    );
  }
  _renderVideos = ({ item, index }) => {
    console.log("Vishal - _renderVideos");
    console.log(item);

    let itemHeight = height * 0.26 * 0.9;
    let itemWidth = width * 0.65;
    let uri;

    if (item && item.imageUrl != undefined) {
      uri = { uri: item.imageUrl };
    } else {
      uri = { uri: null };
    }

    const {
      isRegularWorkoutCompletedForToday,
      isD10CompletedForToday,
      isBonusCompletedForToday,
    } = this.props;

    // const colors = [colorNew.lightPink, colorNew.boxGrey];
    const { onVideoLibraryPress, displayCompletedView } = this.props;
    const colors = ["#f2c9cf10", "#C8C7CC"];
    if (
      item.isCompleted ||
      (index == 0 && isRegularWorkoutCompletedForToday) ||
      (index == 1 && isD10CompletedForToday) ||
      (index == 2 && isBonusCompletedForToday)
    ) {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            width: itemWidth,
            height: height * 0.26,
            justifyContent: "space-around",
            alignItems: "space-around",
          }}
          activeOpacity={0.9}
          onPress={() => {
            if (index == 2) {
              this._startClicked(item, index);
            }
          }}
        >
          <ImageBackground
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
              width: itemWidth,
              backgroundColor: colorNew.boxGrey,
              height: itemHeight,
              overflow: "hidden",
              borderRadius: 10,
            }}
            source={uri}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.95 }}
              colors={colors}
              style={{
                flexDirection: "row",
                width: itemWidth,
                height: itemHeight,
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <View style={{ flex: 1, height: 30, margin: 10 }}>
                <Text
                  allowFontScaling={true}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ ...styles.titleText }}
                >
                  {item.description}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "transparent",
                  height: 30,
                  width: 30,
                  borderRadius: 100,
                  margin: 10,
                  borderColor: "#fff",
                  borderWidth: 0,
                }}
              >
                <Image
                  style={{ padding: 7, marginTop: 5 }}
                  source={challenge_pink_mark_rounded}
                />
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            width: itemWidth,
            height: height * 0.26,
            justifyContent: "space-around",
            alignItems: "space-around",
          }}
          onPress={() => this._startClicked(item, index)}
          activeOpacity={0.9}
        >
          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
              width: itemWidth,
              backgroundColor: colorNew.boxGrey,
              height: itemHeight,
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <ImageBackground
              style={{
                flexDirection: "row",
                width: itemWidth,
                height: itemHeight,
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
              source={uri}
            >
              <View style={{ flex: 1, height: 30, margin: 10 }}>
                <Text
                  allowFontScaling={true}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ ...styles.titleText }}
                >
                  {item.description}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colorNew.darkPink,
                  height: 30,
                  borderRadius: 100,
                  margin: 10,
                  borderColor: "#fff",
                  borderWidth: 2,
                }}
              >
                <Text
                  allowFontScaling={true}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={styles.thisWeekStartNow}
                >
                  {item.buttonText}
                </Text>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      );
    }
  };

  _startClicked(item, index) {
    console.log("_startClicked");
    console.log("item");
    console.log(item);
    console.log("index");
    console.log(index);
    if (index == 0) {
      this.props.startWorkout(item.data, "ChallengeDashboard");
    } else if (index == 1) {
      this.props.openDailySweatModal();
    } else if (index == 2) {
      this.props.openBonusChallengeModal();
    }
    // if (this.props.onStartClicked != undefined) {
    //   this.props.onStartClicked();
    // }
  }
}

const styles = {
  titleText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 5,
    color: "#fff",
    marginTop: 10,
  },
  thisWeekStartNow: {
    fontFamily: "SF Pro Text",
    fontSize: 9,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    padding: 5,
    letterSpacing: 0,
    textAlign: "center",
    color: "#fff",
    marginTop: 0,
  },
};
