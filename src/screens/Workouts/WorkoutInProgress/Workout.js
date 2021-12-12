import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AsyncStorage } from "react-native";

import Video from "react-native-video";
import { VLCPlayer, VlCPlayerView } from "react-native-vlc-media-player";

import { color, colorNew } from "../../../modules/styles/theme";
import {
  clock_in_progress,
  lightning_sel,
  workout_lb_weight,
} from "../../../images";

import { ConnectedSpotifyMusicBar } from "../../../components/common";

import SwipeGesture from "../../../screens/swipe-gesture";

const { height, width } = Dimensions.get("window");
const videoContainerHeight = height * 0.49;
// const videoContainerWidth = videoContainerHeight * 0.6;
const videoContainerWidth = width - 40;

var excercises = [];

class Workout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPage: 0,
      load: false,
    };

    // this.currentVideo = null;

    // this.getStarted();
  }

  // getStarted = async () => {
  //   try {
  //     excercises = JSON.parse(await AsyncStorage.getItem("cachedExercises"));
  //   } catch (ex) {
  //     excercises = [];
  //   }

  //   if(excercises.length > 0) {

  //   }
  // };

  renderPageDot(isSelected) {
    const {
      pageDotContainer,
      paginationDot,
      paginationInnerDotActive,
      paginationDotInactive,
    } = styles;
    return (
      <View style={isSelected ? paginationDot : paginationDotInactive}>
        {isSelected ? <View style={paginationInnerDotActive} /> : null}
      </View>
    );
  }
  previousArrowPressed(page) {
    this.setState({
      selectedPage: page,
    });
    setTimeout(() => {
      this.props.onPreviousArrowPressed();
    }, 50);
  }
  renderDotes() {
    const dotes = [];
    const { currentExerciseIdx, currentPageIdx, totalPage } = this.props;
    const {
      pageDotContainer,
      paginationDot,
      paginationInnerDotActive,
      paginationDotInactive,
    } = styles;
    for (let i = 0; i < totalPage; i++) {
      dotes.push(
        <View
          style={currentPageIdx == i ? paginationDot : paginationDotInactive}
        >
          {currentPageIdx == i ? (
            <View style={paginationInnerDotActive} />
          ) : null}
        </View>
      );
    }
    return dotes;
  }

  onSwipePerformed = (action) => {
    /// action : 'left' for left swipe
    /// action : 'right' for right swipe
    /// action : 'up' for up swipe
    /// action : 'down' for down swipe

    const { onNextArrowPressed, onPreviousArrowPressed } = this.props;
    switch (action) {
      case "left": {
        console.log("left Swipe performed");
        onNextArrowPressed();
        break;
      }
      case "right": {
        console.log("right Swipe performed");
        onPreviousArrowPressed();
        break;
      }
      case "up": {
        console.log("up Swipe performed");
        break;
      }
      case "down": {
        console.log("down Swipe performed");
        break;
      }
      default: {
        console.log("Undeteceted action");
      }
    }
  };

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

  render() {
    const {
      container,
      rowContainer,
      header,
      subHeader,
      mainTitle,
      leftArrowContainer,
      leftArrowSmallContainer,
      pageDotContainer,
      rightArrowContainer,
      rightArrowSmallContainer,
      exerciseInfoContainer,
      timeInfoContainer,
      exerciseInfo,
      leftArrow,
      leftArrowSmall,
      rightArrowSmall,
      rightArrow,
    } = styles;

    const {
      title,
      subtitle,
      circuitNumber,
      roundNumber,
      onNextArrowPressed,
      currentExercise,
      currentExerciseIdx,
      totalPage,
      onPreviousArrowPressed,
      totalSeconds,
      timerStart,
      timerStop,
      videoUrl,
    } = this.props;

    // console.log(
    //   "========>>>\n" +
    //     title +
    //     "\n" +
    //     subtitle +
    //     "\n" +
    //     circuitNumber +
    //     "\n" +
    //     roundNumber +
    //     "\n" +
    //     videoUrl
    // );

    // const rowContainerStyle = {
    //   ...rowContainer,
    //   top: height * 0.4,
    //   left: 0,
    //   position: "absolute",
    // };

    // const config = {
    //   velocityThreshold: 0.3,
    //   directionalOffsetThreshold: 10,
    // };

    return (
      <View>
        <View style={container}>
          <View
            style={{
              padding: 2,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text allowFontScaling={false} style={mainTitle}>
              {circuitNumber.toUpperCase()}
            </Text>
            <View
              style={{
                marginLeft: 5,
                marginRight: 5,
                width: 4,
                height: 4,
                // backgroundColor: colorNew.textPink,
                backgroundColor:
                  circuitNumber === undefined ||
                  roundNumber === undefined ||
                  circuitNumber === "" ||
                  roundNumber === ""
                    ? colorNew.white
                    : colorNew.textPink,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                borderRadius: 100,
              }}
            ></View>
            <Text allowFontScaling={false} style={mainTitle}>
              {roundNumber.toUpperCase()}
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            adjustsFontSizeToFit
            numberOfLines={1}
            style={header}
          >
            {title.toUpperCase()}
          </Text>
          <Text allowFontScaling={false} style={subHeader}>
            {subtitle}
          </Text>
          {this._renderExerciseInfo()}
        </View>
        <View style={[this.shadowBottom(5), styles.videoContainerNew]}>
          <SwipeGesture
            gestureStyle={styles.videoContainer}
            onSwipePerformed={this.onSwipePerformed}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
                // backgroundColor: Platform.OS === "ios" ? "#b2b2b2" : "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!this.state.load ? (
                this._renderMedia()
              ) : (
                <View
                  style={{
                    height: (videoContainerHeight - 1) * 1.7,
                    width: (videoContainerWidth - 1) * 2.35,
                    top: height > 600 ? 0 : 0,
                    left: height > 600 ? 0 : -5,
                    backgroundColor: "#fff",
                    borderRadius: 40,
                  }}
                />
              )}
              {/* {this._renderMedia()} */}
            </View>
          </SwipeGesture>
        </View>
        <View
          style={{
            height: 40,
            width: videoContainerWidth,
            marginLeft: 20,
            marginTop: 25,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onPreviousArrowPressed();

              this.setState(
                {
                  load: true,
                },
                () => {
                  setTimeout(() => {
                    this.setState({ load: false });
                  }, 100);
                }
              );
            }}
          >
            <View style={leftArrowSmallContainer}>
              <Image
                style={leftArrowSmall}
                source={require("./images/carouselArrowLeft.png")}
              />
            </View>
          </TouchableOpacity>
          {this.renderDotes()}
          <TouchableOpacity
            style={{ ...rightArrowSmallContainer }}
            onPress={() => {
              onNextArrowPressed();

              this.setState(
                {
                  load: true,
                },
                () => {
                  setTimeout(() => {
                    this.setState({ load: false });
                  }, 100);
                }
              );
            }}
          >
            <View style={{ ...rightArrowSmallContainer }}>
              <Image
                style={rightArrowSmall}
                source={require("./images/carouselArrowRight.png")}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/*<View style={{height:30,width:videoContainerWidth,marginLeft:40,marginTop:10}}>
              <View style={timeInfoContainer}>
                <Image source={clock_in_progress} resizeMode="contain" style={{height:20,width:20}} />*/}
        {/*<Text allowFontScaling={false} style={exerciseInfo}>{currentExercise.reps.toUpperCase()}</Text>*/}
        {/*<Text allowFontScaling={false} style={exerciseInfo}>{this._formatTime()}</Text>
              </View>
            </View>*/}
        {this._renderMusicBar()}
        {this._renderDaily10Labels()}
      </View>
    );
  }
  _formatTime() {
    const { totalSeconds } = this.props;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds - hours * 3600 - minutes * 60;

    return `${this._twoDigitFormat(minutes)}:${this._twoDigitFormat(seconds)}`;
  }

  _twoDigitFormat(num) {
    const str = num.toString();
    if (str.length <= 1) {
      return "0" + str;
    }

    return str;
  }

  _renderMedia() {
    const { withVideo, videoUrl, ignoreSilentSwitch, currentExerciseIdx } =
      this.props;
    let videoStyle;
    let new_height = videoContainerHeight - 1;
    let new_width = videoContainerWidth - 1;

    if (Platform.OS === "ios") {
      // videoStyle = { height: 540, width: 960, top: height > 600 ? 0 : 0, left: height > 600 ? -280 : -245, position: "absolute", zIndex: 0, backgroundColor: "#fff" };
      videoStyle = {
        height: new_height * 1.7,
        width: new_width * 2.35,
        top: height > 600 ? 0 : 0,
        left: height > 600 ? 0 : -5,
        backgroundColor: "#fff",
        borderRadius: 40,
      };
    } else {
      // videoStyle = { height: 540, width: 960, top: height > 600 ? 60 : 0, left: height > 600 ? -280 : -245, position: "absolute", zIndex: 0 };
      videoStyle = {
        height: new_height * 1.7,
        width: new_width * 2.35,
        top: height > 600 ? 0 : 0,
        left: height > 600 ? 0 : -5,
        backgroundColor: "#fff",
        borderRadius: 40,
      };
    }

    // console.log(withVideo + " :=: videoUrl::::==== " + videoUrl);

    if (withVideo) {
      return (
        <Video
          style={videoStyle}
          key={currentExerciseIdx}
          source={{
            // uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            // uri: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/exercises480%2F%20Alt%20Bicep%20Curl%20Band480.mp4?alt=media&token=be41d69b-0c47-472d-9976-5584a94ae0ea",
            uri: videoUrl,
            type: "mp4",
          }}
          // ref={(ref) => (this.currentVideo = ref)}
          resizeMode="contain"
          repeat={true}
          controls={false}
          ignoreSilentSwitch={ignoreSilentSwitch ? "ignore" : "obey"}
          playInBackground={false}
          hideShutterView={true}
          onLoad={() => {
            // alert("Video Load: ");
          }}
          onError={(err) => {
            // alert("Video Load Error: " + JSON.stringify(err));
          }}
        />

        // <VlCPlayerView
        //   url={videoUrl}
        //   autoplay={true}
        //   resizeMode="contain"
        //   style={videoStyle}
        //   videoAspectRatio={"16:9"}
        //   repeat={true}
        //   key={currentExerciseIdx}
        // />

        // <VLCPlayer
        //   ref={(ref) => (this.vlcPlayer = ref)}
        //   // resume={this.state.paused}
        //   //seek={this.state.seek}
        //   style={[videoStyle]}
        //   source={{ uri: videoUrl, isNetwork: true }}
        //   videoAspectRatio={"16:9"}
        //   repeat={true}
        //   autoplay={true}
        //   // onProgress={this.onProgress.bind(this)}
        //   // onEnd={(event) => {
        //     // this.vlcPlayer.seek(0);
        //     // this.vlcPlayer.resume(true);
        //   // }}
        //   // onStopped={(event) => {
        //   //   this.setState(
        //   //     {
        //   //       paused: true,
        //   //     },
        //   //     () => {
        //   //       this.setState({
        //   //         paused: false,
        //   //       });
        //   //       alert("onStopped");
        //   //     }
        //   //   );
        //   // }}
        //   // onPlaying={this.onPlaying.bind(this)}
        //   // onBuffering={this.onBuffering.bind(this)}
        //   progressUpdateInterval={100}
        //   // onError={this._onError}
        //   // onOpen={this._onOpen}
        //   // onLoadStart={this._onLoadStart}
        // />
      );
    } else {
      return (
        <Image
          style={videoStyle}
          source={{ uri: videoUrl }}
          resizeMode="contain"
          fullscreen={true}
        />
      );
    }
  }

  _renderMusicBar() {
    const { withSpotifyMusicBar } = this.props;

    if (withSpotifyMusicBar) {
      return (
        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 30 }}>
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
      return (
        <View
          style={{
            width: 140,
            height: 70,
            backgroundColor: color.mediumAqua,
            top: height * 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text allowFontScaling={false} style={infoBox}>
            30 SECONDS
          </Text>
          <Text allowFontScaling={false} style={infoBox}>
            {currentExercise.weightRange.toUpperCase()}
          </Text>
        </View>
      );
    }

    return null;
  }

  _renderExerciseInfo() {
    const { exerciseInfoContainer, exerciseInfo } = styles;

    const { currentExercise } = this.props;

    if (currentExercise.weight === "Y") {
      return (
        <View style={exerciseInfoContainer}>
          <Image
            source={lightning_sel}
            resizeMode="contain"
            style={{ height: 15, width: 15 }}
          />
          <Text allowFontScaling={false} style={exerciseInfo}>
            {currentExercise.reps.toUpperCase()}
          </Text>
          <Image
            source={workout_lb_weight}
            resizeMode="contain"
            style={{ height: 25, width: 25, marginTop: 5 }}
            marginLeft={16}
          />
          <Text allowFontScaling={false} style={exerciseInfo}>
            {currentExercise.weightRange.toUpperCase()}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={exerciseInfoContainer}>
          <Image
            source={lightning_sel}
            resizeMode="contain"
            style={{ height: 20, width: 20 }}
          />
          <Text allowFontScaling={false} style={exerciseInfo}>
            {currentExercise.reps.toUpperCase()}
          </Text>
        </View>
      );
    }
  }
}

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "transparent",
    width: width,
    zIndex: 0,
  },
  videoContainer: {
    height: videoContainerHeight,
    width: videoContainerWidth,
    backgroundColor: Platform.OS === "ios" ? "#b2b2b2" : "#fff",
    borderWidth: Platform.OS === "ios" ? 1 : 0.5,
    borderColor: Platform.OS === "ios" ? "#b2b2b2" : "#b2b2b2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    zIndex: 0,
    overflow: "hidden",
    flexDirection: "column",
  },
  videoContainerNew: {
    height: videoContainerHeight,
    width: videoContainerWidth,
    backgroundColor: Platform.OS === "ios" ? "#b2b2b2" : "#fff",
    borderWidth: Platform.OS === "ios" ? 1 : 0.5,
    borderColor: Platform.OS === "ios" ? "#b2b2b2" : "#b2b2b2",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    zIndex: 0,
    marginTop: 10,
    marginLeft: 20,
  },
  videoContainerOverlay: {
    height: videoContainerHeight,
    width: videoContainerWidth,
    backgroundColor: "transparent",
    borderWidth: Platform.OS === "ios" ? 1 : 0.5,
    borderColor: Platform.OS === "ios" ? "#b2b2b2" : "#b2b2b2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    position: "absolute",
    zIndex: 0,
    marginTop: 130,
    marginLeft: 40,
    overflow: "hidden",
    flexDirection: "column",
  },
  header: {
    zIndex: 4,
    height: 25,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    flexGrow: 1,
    width: 280,
  },
  subHeader: {
    marginTop: 10,
    marginBottom: 10,
    width: width,
    zIndex: 4,
  },
  mainTitle: {
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 18,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
    zIndex: 4,
  },
  exerciseInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    width: "100%",
    height: 50,
    width: width,
  },
  timeInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  exerciseInfo: {
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: colorNew.textPink,
    marginLeft: 5,
    marginTop: 4,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    width: width,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  leftArrowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: 60,
    height: 60,
  },
  leftArrowSmallContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  pageDotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  paginationDot: {
    marginTop: 5,
    marginBottom: 5,
    width: 16,
    height: 16,
    borderWidth: 0.5,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colorNew.mediumPink,
    marginHorizontal: 1,
  },
  paginationInnerDotActive: {
    width: 10,
    height: 10,
    backgroundColor: colorNew.mediumPink,
    borderWidth: 0,
    borderRadius: 5,
  },
  paginationDotInactive: {
    marginTop: 5,
    marginBottom: 5,
    width: 8,
    height: 8,
    backgroundColor: colorNew.boxGrey,
    borderWidth: 0,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  leftArrow: {
    marginLeft: 5,
  },
  leftArrowSmall: {
    marginLeft: 5,
    width: 20,
    height: 20,
  },
  rightArrowContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: 60,
    height: 60,
  },
  rightArrowSmallContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
  },
  rightArrow: {
    marginRight: 5,
  },
  rightArrowSmall: {
    marginLeft: 5,
    width: 20,
    height: 20,
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
    color: color.black,
  },
};

export default Workout;
