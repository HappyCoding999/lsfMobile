import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";
import ShareNew from "react-native-share";
import { color } from "../../modules/styles/theme";
import { GoalsWeekView } from "./GoalsWeekView";
import { GoalsCalendar } from "./GoalsCalendar";
import { ScrollView } from "react-native";
import Measurements from "../Profile/tabs/Tracking/Measurements/Measurements";
import InstagramShareModal from "../InstagramShareModal";

const { width } = Dimensions.get("window");

export class Progress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCalendarWeek: false,
      showInspoModal: false,
      shareImage: null,
    };
  }

  viewOrEditDays = () => {
    console.log("viewOrEditDays");
    const {
      sweatLogs,
      completedBonusChallenges,
      completedWorkouts,
      selfCareLogs,
      filteredChallengeLogs,
    } = this.props.screenProps;
    this.props.navigation.navigate("Journal", {
      sweatLogs: sweatLogs,
      completedWorkouts: completedWorkouts,
      bonusChallenges: [...completedBonusChallenges, ...filteredChallengeLogs],
      selfCareLogs: selfCareLogs,
    });
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  shareCalendar = () => {
    console.log("shareCalendar");
    this.setState({ showCalendarWeek: true }, async () => {
      await this.sleep(100);
      const uri = await captureRef(this.refs["calendarContainerView"], {
        format: "jpg",
        quality: 0.8,
      });
      this.setState({ showCalendarWeek: false });
      // this.setState({ showCalendarWeek: false, showInspoModal:true, shareImage:uri })
      await this.share(uri);
    });
  };

  share = async (uri) => {
    console.log("share uri", uri);
    this.setState({
      showCalendarWeek: false,
      showInspoModal: true,
      shareImage: uri,
    });
    return;
    try {
      const base64Image = await RNFS.readFile(uri, "base64");
      const shareOptionsUrl = {
        title: "LSF",
        message: "LSF",
        url: `data:image/jpeg;base64,${base64Image}`, // use image/jpeg instead of image/jpg
        subject: "LSF",
      };

      const shareResponse = await ShareNew.open(shareOptionsUrl);
      console.log("shareResponse", shareResponse);
    } catch (e) {
      console.log(`error sharing: ${uri} `, e);
    }
  };

  _closeInspoModal = () => {
    this.setState({
      showInspoModal: false,
      shareImage: null,
    });
  };

  render() {
    const { buttonContainer, buttonText } = styles;
    const { screenProps } = this.props;
    const { showCalendarWeek } = this.state;

    return (
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          backgroundColor: "#fff",
          justifyContent: "flex-start",
          alignItems: "center",
          width: width,
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            ref={"calendarContainerView"}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {showCalendarWeek && <GoalsWeekView screenProps={screenProps} />}
            <GoalsCalendar
              screenProps={screenProps}
              navigation={this.props.navigation}
              openSweatLog={this.props.openSweatLog}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: width,
              height: width * 0.2,
            }}
          >
            <TouchableOpacity
              style={buttonContainer}
              onPress={this.viewOrEditDays}
            >
              <Text allowFontScaling={true} style={buttonText}>
                View + Edit Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonContainer}
              onPress={this.shareCalendar}
            >
              <Text allowFontScaling={true} style={buttonText}>
                Share Your Calendar
              </Text>
            </TouchableOpacity>
          </View>
          <Measurements {...this.props} />
        </View>
        <InstagramShareModal
          shareImage={this.state.shareImage}
          visible={this.state.showInspoModal}
          quote={""}
          onClose={() => this._closeInspoModal()}
          onPostSuccessful={() => console.log("post successful")}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: width * 0.45,
    height: 55,
    borderRadius: 50 / 2,
    borderWidth: 2,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    width: width * 0.4,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
});
