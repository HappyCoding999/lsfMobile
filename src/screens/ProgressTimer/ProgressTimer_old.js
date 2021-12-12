import React, { Component } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity, ImageBackground, Platform } from "react-native";
import { Timer, CountDown, ConnectedSpotifyMusicBar } from "../../components/common";
import NextWorkOutFooter from "./NextMoveFooter"
import HeartAnimation from "./HeartAnimation";

const { height, width } = Dimensions.get("window");

export default class ProgressTimer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isPaused: false,
      start: true
    }
  }

  _pause() {
    this.setState({
      isPaused: true,
      start: false
    });
  }

  _playFromPause() {
    this.setState({
      isPaused: false,
      start: true
    })
  }

  render() {
    const { title, subTitleText, withTimer, nextMove, onClose, onCompletePress,restartTimer } = this.props;
    const { isPaused, start } = this.state

    const {
      container,
      titleStyle,
      subtitleStyle,
      img,
      completeButton,
      smallButtonText,
      footerContainer
    } = styles;

    if (withTimer) {

      return (
        <View style={{ width: width, flex: 1, justifyContent: "flex-start", alignItems: "center" }} contentContainerStyle={container}>
          {title ?
            <Text allowFontScaling={false} style={titleStyle}>
              {title}
            </Text>
            :
            null
          }
          {subTitleText ?
            <Text allowFontScaling={false} style={subtitleStyle}>
              {subTitleText}
            </Text>
            :
            null
          }
          <Timer start={start} />
          <ImageBackground style={img} resizeMode={"center"} source={require("./images/iconHeart.png")}>
            <TouchableOpacity onPress={isPaused ? () => this._playFromPause() : () => this._pause()}>
              <Image style={{ marginTop: 40 }} source={isPaused ? require("./images/iconPlay.png") : require("./images/pause.png")} />
            </TouchableOpacity>
          </ImageBackground>
          <TouchableOpacity style={{ ...completeButton, marginTop: 0, width: 0.7 * width, zIndex: 10 }} onPress={onCompletePress}>
            <View>
              <Text allowFontScaling={false} style={{ ...smallButtonText, width: "100%" }}>COMPLETE WORKOUT</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 0 }}>
            <ConnectedSpotifyMusicBar />
          </View>
        </View>
      );

    } else {
      const containerStyle = {
        ...container,
        marginBottom: Platform.OS === "android" ? 20 : 0
      };

      return (
        <View style={containerStyle}>
          <Text allowFontScaling={false} style={titleStyle}>
            {title}
          </Text>
          <Text allowFontScaling={false} style={subtitleStyle}>
            {subTitleText}
          </Text>
          <View style={{ marginTop: 80, justifyContent: "center", alignContent: "center" }}>
            <HeartAnimation childContainerStyle={{position: "absolute", top: 130, left: 85}} >
              <CountDown start={restartTimer} initial={30} onClose={onClose} />
            </HeartAnimation>
          </View>
          <View style={footerContainer}>
            <NextWorkOutFooter nextMove={nextMove} onClose={onClose} />
          </View>
        </View>
      );

    }
  }

};

const styles = {
  container: {
    width: width,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  titleStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 38,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  subtitleStyle: {
    width: 240,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  img: {
    width: width,
    height: width,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40

  },
  modalContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  modalContent: {
    justifyContent: "flex-start",
    flex: 1
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginTop: 15
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
    color: "#fff"
  },
  completeButton: {
    width: 150,
    height: 48,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },


};
