import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, Platform, ImageBackground } from "react-native";
import { AsyncStorage } from 'react-native';
import Video from "react-native-video";
import { color } from "../../../modules/styles/theme"
import { ConnectedSpotifyMusicBar } from "../../../components/common"

const { height, width } = Dimensions.get("window");

class Workout extends Component {

  constructor(props) {
    super(props);

    this.currentVideo = null;
  }

  render() {
    const {
      container,
      rowContainer,
      header,
      subHeader,
      leftArrowContainer,
      rightArrowContainer,
      leftArrow,
      rightArrow,
    } = styles;

    const {
      title,
      subtitle,
      onNextArrowPressed,
      onPreviousArrowPressed,
    } = this.props;

    const rowContainerStyle = {
      ...rowContainer,
      top: height * .40,
      left: 0,
      position: "absolute"
    };


    return (
      <View>
        <View style={container}>
          <Text allowFontScaling={false}
            adjustsFontSizeToFit
            numberOfLines={1}
            style={header}>{title.toUpperCase()}</Text>
          <Text allowFontScaling={false} style={subHeader}>{subtitle}</Text>
          {this._renderExerciseInfo()}
        </View>
        {this._renderMedia()}
        {this._renderMusicBar()}
        <View style={rowContainerStyle}>
          <TouchableOpacity onPress={onPreviousArrowPressed}>
            <View style={leftArrowContainer}>
              <Image style={leftArrow} source={require("./images/carouselArrowLeft.png")} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNextArrowPressed}>
            <View style={rightArrowContainer}>
              <Image style={rightArrow} source={require("./images/carouselArrowRight.png")} />
            </View>
          </TouchableOpacity>
        </View>
        {this._renderDaily10Labels()}
      </View>
    );
  }

  _renderMedia() {
    const { withVideo, videoUrl, ignoreSilentSwitch } = this.props
    let videoStyle;

    if (Platform.OS === "ios") {
      videoStyle = { height: 540, width: 960, top: height > 600 ? 0 : 0, left: height > 600 ? -280 : -245, position: "absolute", zIndex: 0, backgroundColor: "#fff" };

    } else {
      videoStyle = { height: 540, width: 960, top: height > 600 ? 60 : 0, left: height > 600 ? -280 : -245, position: "absolute", zIndex: 0 };
    }

    if (withVideo) {
      return <Video
        style={videoStyle}
        source={{ uri: videoUrl }}
        ref={ref => this.currentVideo = ref}
        resizeMode="contain"
        repeat={true}
        fullscreen={true}
        controls={false}
        ignoreSilentSwitch={ignoreSilentSwitch ? "ignore" : "obey"}
        playInBackground={false}
      />;
    } else {
      return <Image
        style={videoStyle}
        source={{ uri: videoUrl }}
        resizeMode="contain"
        fullscreen={true}
      />;
    }
  }

  _renderMusicBar() {
    const { withSpotifyMusicBar } = this.props;

    if (withSpotifyMusicBar) {
      return (
        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 60 }}>
          <ConnectedSpotifyMusicBar />
        </View>
      );
    }

    return null;
  }

  _renderDaily10Labels() {
    const { isDaily10, currentExercise } = this.props;
    const { infoBox } = styles;

    if (isDaily10) {
      return <View style={{ width: 140, height: 70, backgroundColor: color.mediumAqua, top: height * .6, justifyContent: "center", alignItems: "center" }}>
        <Text allowFontScaling={false} style={infoBox}>30 SECONDS</Text>
        <Text allowFontScaling={false} style={infoBox}>{currentExercise.weightRange.toUpperCase()}</Text>
      </View>;
    }

    return null;
  }

  _renderExerciseInfo() {

    const {
      exerciseInfoContainer,
      exerciseInfo
    } = styles;

    const {
      currentExercise
    } = this.props;

    if (currentExercise.weight === "Y") {
      return (
        <View style={exerciseInfoContainer}>
          <Image source={require("./images/iconTimerMini.png")} />
          <Text allowFontScaling={false} style={exerciseInfo}>{currentExercise.reps.toUpperCase()}</Text>
          <Image marginLeft={16} source={require("./images/iconDumbellMini.png")} />
          <Text allowFontScaling={false} style={exerciseInfo}>{currentExercise.weightRange.toUpperCase()}</Text>
        </View>
      );
    } else {
      return (
        <View style={exerciseInfoContainer}>
          <Image source={require("./images/iconTimerMini.png")} />
          <Text allowFontScaling={false} style={exerciseInfo}>{currentExercise.reps.toUpperCase()}</Text>
        </View>
      );
    }


  }
};

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "transparent",
    width: width,
    zIndex: 3
  },
  header: {
    zIndex: 4,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    flexGrow: 1,
    width: 280
  },
  subHeader: {
    marginTop: 10,
    marginBottom: 10,
    width: width,
    zIndex: 4,
  },
  exerciseInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    width: "100%",
    height: 50,
    width: width
  },
  exerciseInfo: {
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.darkGrey,
    marginLeft: 5,
    marginTop: 4
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    width: width
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0
  },
  leftArrowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: 60,
    height: 60
  },
  leftArrow: {
    marginLeft: 5
  },
  rightArrowContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 60,
    height: 60
  },
  rightArrow: {
    marginRight: 5,
  },
  infoBox: {
    width: 99,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "left",
    color: color.black
  }
};

export default Workout;
