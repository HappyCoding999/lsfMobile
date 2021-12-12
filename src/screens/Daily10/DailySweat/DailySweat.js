import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Platform,
  AsyncStorage,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import Video from "react-native-video";
import { ic_back_white, cancel_round_cross } from "../../../images";

import LinearGradient from "react-native-linear-gradient";
import SwipeGesture from "../../../screens/swipe-gesture";

const { height, width } = Dimensions.get("window");
const videoContainerHeight = height * 0.62;
const videoContainerWidth = videoContainerHeight * 0.6;

export default class extends Component {
  onSwipePerformed = (action) => {
    /// action : 'left' for left swipe
    /// action : 'right' for right swipe
    /// action : 'up' for up swipe
    /// action : 'down' for down swipe
    const { onRightArrowPress, onLeftArrowPress } = this.props;
    switch (action) {
      case "left": {
        console.log("left Swipe performed");
        onRightArrowPress();
        break;
      }
      case "right": {
        console.log("right Swipe performed");
        onLeftArrowPress();

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
      shadowOpacity: 0.15,
      shadowRadius: 0.7 * elevation,
      backgroundColor: "transparent",
    };
  }
  render() {
    const {
      onRightArrowPress,
      onLeftArrowPress,
      name,
      imgUrl,
      reps,
      headerProps,
    } = this.props;
    const { onClose } = headerProps;
    if (Platform.OS === "ios") {
      videoStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.15,
        backgroundColor: "transparent",
        borderRadius: 40,
      };
      imageStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.15,
        backgroundColor: "transparent",
        borderRadius: 40,
      };
    } else {
      videoStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.15,
        backgroundColor: "transparent",
        borderRadius: 40,
      };
      imageStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.15,
        backgroundColor: "transparent",
        borderRadius: 40,
      };
    }

    return (
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: "85%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              marginLeft: "10%",
              marginRight: "10%",
              marginBottom: 10,
              marginTop: -20,
              height: height * 0.12,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity activeOpacity={0.5}>
              <View
                style={{
                  width: 40,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                {/*<Image style={{ height: '90%',top:0,tintColor:colorNew.darkPink}} resizeMode="contain" source={ic_back_white} />*/}
              </View>
            </TouchableOpacity>
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={styles.mainTitle}
            >
              LSF DAILY 10
            </Text>
            <TouchableOpacity activeOpacity={0.5} onPress={onClose}>
              <View
                style={{
                  width: 40,
                  height: 50,
                  marginRight: 10,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    height: "90%",
                    top: 0,
                    tintColor: colorNew.darkPink,
                  }}
                  resizeMode="contain"
                  source={cancel_round_cross}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <View style={[styles.videoContainerBottom]}>
              <SwipeGesture
                gestureStyle={styles.videoContainer}
                onSwipePerformed={this.onSwipePerformed}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {name == "#LSFROLLCALL" ? (
                    <Image
                      style={imageStyle}
                      source={{
                        uri: imgUrl,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Video
                      style={[videoStyle]}
                      // key={currentExerciseIdx}
                      source={{
                        uri:
                          Platform.OS === "android"
                            ? "file://" + imgUrl
                            : imgUrl,
                      }}
                      // ref={(ref) => (this.currentVideo = ref)}
                      resizeMode="contain"
                      repeat={true}
                      fullscreen={false}
                      controls={false}
                      onLoad={() => {
                        console.log("Video Loaded");
                      }}
                      onError={(error) => {
                        console.log("Video Load error: " + error.error);
                      }}
                    />
                  )}
                </View>
              </SwipeGesture>
            </View>
          </View>
        </View>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.95 }}
          colors={[color.mediumPink, color.hotPink]}
          // colors={[color.hotPink, color.mediumPink]}
          style={{
            width: "100%",
            height: "15%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              // backgroundColor: colorNew.mediumPink,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/*<View style={{ width: width, height: 100, flexDirection: "row", backgroundColor: colorNew.lightPink, position: "absolute", justifyContent: "space-between", alignItems: "center", top: height-100-60}}>*/}
            <TouchableOpacity activeOpacity={0.5} onPress={onLeftArrowPress}>
              <View
                style={{
                  width: 40,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  style={{ margin: 20 }}
                  source={require("../images/back_pink.png")}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: width - 150,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.subTitle}
              >
                {name.toUpperCase()}
              </Text>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.highlighText}
              >
                {reps}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={onRightArrowPress}>
              <View
                style={{
                  width: 40,
                  height: 50,
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Image
                  style={{ margin: 20 }}
                  source={require("../images/next_pink.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    // backgroundColor: "#fff",
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  videoContainer: {
    height: videoContainerHeight,
    width: videoContainerWidth,
    // backgroundColor: "#b2b2b2",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    zIndex: 0,
    // zIndex: 1,
    overflow: "hidden",
    flexDirection: "column",
  },
  videoContainerBottom: {
    // top: 0,
    // height: videoContainerHeight,
    marginLeft: 0,
    // width: videoContainerWidth,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    flexDirection: "column",
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0.5 * 20 },
    shadowOpacity: 0.15,
    shadowRadius: 0.7 * 5,
  },
  mainTitle: {
    width: width,
    height: 20,
    margin: 20,
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.mediumPink,
  },
  subTitle: {
    width: width - 100,
    height: 25,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.white,
    flexWrap: "wrap",
  },
  highlighText: {
    width: width - 100,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    color: colorNew.white,
    flexWrap: "wrap",
  },
};
