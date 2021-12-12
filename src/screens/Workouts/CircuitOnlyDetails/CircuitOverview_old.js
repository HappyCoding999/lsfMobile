import React, { Component } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { color } from "../../../modules/styles/theme";
import CircuitCard from "../CircuitCard";
import { LargeButton, Sticker, ConnectedMusicButtons } from "../../../components/common";
import Spotify from "rn-spotify-sdk"
import { EventRegister } from "react-native-event-listeners";

const { width } = Dimensions.get("window");

class CircuitOverview extends Component {

  state = {
    spotifyLoggedIn: false,
    showPlaylistModal: false,
    myMusicPressed: false
  };

  musicChoice = "";

  componentDidMount() {
    Spotify.isLoggedInAsync().then((result) => {
      this.setState({ spotifyLoggedIn: result });
    }).catch((err) => { console.log(err) });
  }

  render() {
    const {
      container,
      btnStyle,
      subTitle,
    } = styles;

    const { onSecondBtnPressed } = this.props

    return (
      <ScrollView contentContainerStyle={container}>
        {this._renderHeader()}
        {this._renderCircuitCards()}
        <LargeButton
          onPress={() => EventRegister.emit("paywallEvent", this._onLargeButtonPressed)}
          containerStyle={btnStyle}>
          LET'S GET SWEATY
        </LargeButton>
        {this._renderSkipBtn()}
        <Text allowFontScaling={false} style={subTitle}>Grab your gear!</Text>
        {this._renderStickers()}
        <Text allowFontScaling={false} style={subTitle}>Choose your music!</Text>
        {this._renderMusicButtons()}
        <Image style={{ marginTop: 13, marginBottom: 25 }} source={require("./images/illustrationMusicnotes.png")} />
      </ScrollView>
    );
  }

  _onLargeButtonPressed = () => {
    const { onLargeBtnPressed } = this.props;
    onLargeBtnPressed();
  };

  // _skipWorkoutPressed = () => {
  // };

  _renderSkipBtn() {
    const { onSecondBtnPressed } = this.props;
    const { btnStyle } = styles;
    if (onSecondBtnPressed) {
      return (
        <LargeButton
          onPress={() => EventRegister.emit("paywallEvent", onSecondBtnPressed)}
          containerStyle={btnStyle}>
          SKIP WORKOUT
        </LargeButton>
      );
    }

    return null;
  }

  _renderHeader() {
    const { headerContainer, title, info, rowContainer } = styles;
    const { workoutTitle, time, level } = this.props;
    const infoText = time === "none" ? level : `Approx ${time} | ${level}`;

    return (
      <View style={headerContainer}>
        <View style={{ ...rowContainer, width: "100%" }}>
          <Text allowFontScaling={false} style={title}>{workoutTitle}</Text>
        </View>
        <View style={{ ...rowContainer, width: "100%" }}>
          <Text allowFontScaling={false} style={info}>{infoText}</Text>
        </View>
      </View>
    );
  }

  _renderCircuitCards() {
    const rowContainer = { ...styles.rowContainer, marginTop: 20, marginBottom: 10 };
    const { circuitCardPressed } = this.props;

    return (
      <View style={rowContainer}>
        <TouchableOpacity activeOpacity={.5} onPress={() => EventRegister.emit("paywallEvent", () => circuitCardPressed(1))}>
          <CircuitCard imageSource={require("./images/1.png")} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={.5} onPress={() => EventRegister.emit("paywallEvent", () => circuitCardPressed(2))}>
          <CircuitCard imageSource={require("./images/2.png")} />
        </TouchableOpacity>
      </View>
    );
  }

  _renderStickers() {

    const rowContainer = { ...styles.rowContainer, width: "90%" };
    const { sticker, stickerLabel } = styles;

    const { gear } = this.props;
    const needsMat = gear.includes("MAT")
    const needsBand = gear.includes("BAND")
    const needsWeight = gear.includes("WEIGHT")
    const needsStep = gear.includes("STEP")

    return (
      <View style={rowContainer}>
        {needsMat ?
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image style={{ width: 90, height: 90 }} resizeMode={"cover"} source={require("./images/mat.png")} />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>MAT</Text>
          </View> : null}
        {needsBand ?
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image style={{ width: 90, height: 90 }} resizeMode={"cover"} source={require("./images/buttonDumbells.png")} />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>DUMBBELLS</Text>
          </View> : null}
        {needsWeight ?
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image style={{ width: 90, height: 90 }} resizeMode={"cover"} source={require("./images/buttonBootyband.png")} />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>BOOTY BAND</Text>
          </View> : null}
        {needsStep ?
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image style={{ width: 90, height: 90 }} resizeMode={"cover"} source={require("./images/buttonStep.png")} />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>STEP</Text>
          </View> : null}
      </View>
    );
  }

  _renderMusicButtons() {
    return <ConnectedMusicButtons />;
  }
}

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },
  headerContainer: {
    marginTop: 10,
    alignItems: "center"
  },
  title: {
    width: 116,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 10
  },
  info: {
    width: width,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  },
  btnStyle: {
    marginTop: 20
  },
  stickerLabel: {
    width: 80,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
  },
  subTitle: {
    marginTop: 20,
    marginBottom: 20,
    fontFamily: "Northwell",
    fontSize: 38,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 75,
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    width: width

  },
  sticker: {
    margin: 10
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
  },
  musicBtn: {
    width: 150,
    height: 48,
    borderColor: color.mediumPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  smallButtonText: {
    width: 105,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink
  }
};

export default CircuitOverview;
