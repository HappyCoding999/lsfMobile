import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import LinearGradient from "react-native-linear-gradient";

import { LargeButton } from "../../components/common";
import { cancel_round_cross } from "../../images";

import { color, colorNew } from "../../modules/styles/theme";

const { height, width } = Dimensions.get("window");
import LottieView from "lottie-react-native";
import PremiumEndBolt from "../../animations/PremiumEndBolt";
import PremiumEndCheckmark from "../../animations/PremiumEndCheckmark";
import PremiumEndSweatDrop from "../../animations/PremiumEndSweatDrop";
import { captureRef } from "react-native-view-shot";
import ShareNew from "react-native-share";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";

export default class extends Component {
  constructor(props) {
    super(props);

    console.log(props.shareImage);

    this._postToInstagram = this._postToInstagram.bind(this);
    this._shareClicked = this._shareClicked.bind(this);
    this._shareFor = this._shareFor.bind(this);
    this._share = this._share.bind(this);

    this.state = {
      error: null,
      res: null,
      isStorySize: "",
      previewSource: "",
      value: {
        format: "png",
        quality: 0.9,
        result: "tmpfile",
        snapshotContentContainer: false,
      },
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.animation.play();
    }, 100);
    setTimeout(() => {
      this.animation4.play();
    }, 100);
  }
  renderAnimatedView() {
    const imagePadding = 13;
    return (
      <View
        style={{
          width: "100%",
          height: "20%",
          justifyContent: "center",
          alignItems: "center",
          bottom: -28,
        }}
      >
        <View
          style={{
            width: "24%",
            height: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            bottom: 5,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: imagePadding,
              marginRight: imagePadding,
            }}
          >
            <LottieView
              ref={(animation) => {
                this.animation = animation;
              }}
              loop={false}
              style={{ width: "30%", height: "100%" }}
              source={PremiumEndCheckmark}
              onAnimationFinish={() => this.animation1.play()}
            />
          </View>
          <View
            style={{
              height: "100%",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: imagePadding,
              marginRight: imagePadding,
            }}
          >
            <LottieView
              ref={(animation1) => {
                this.animation1 = animation1;
              }}
              loop={false}
              style={{ width: "30%", height: "100%" }}
              source={PremiumEndBolt}
              onAnimationFinish={() => this.animation2.play()}
            />
          </View>
          <View
            style={{
              height: "100%",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: imagePadding,
              marginRight: imagePadding,
            }}
          >
            <LottieView
              ref={(animation2) => {
                this.animation2 = animation2;
              }}
              loop={false}
              style={{ width: "30%", height: "100%" }}
              source={PremiumEndSweatDrop}
            />
          </View>
        </View>
      </View>
    );
  }
  renderAnimatedView1() {
    const imagePadding = 13;
    return (
      <View
        style={{
          width: "100%",
          height: "20%",
          justifyContent: "center",
          alignItems: "center",
          bottom: -23,
        }}
      >
        <View
          style={{
            width: "24%",
            height: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            bottom: 5,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: imagePadding,
              marginRight: imagePadding,
            }}
          >
            <LottieView
              ref={(animation4) => {
                this.animation4 = animation4;
              }}
              loop={false}
              style={{ width: "30%", height: "100%" }}
              source={PremiumEndCheckmark}
              onAnimationFinish={() => this.animation5.play()}
            />
          </View>
          <View
            style={{
              height: "100%",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: imagePadding,
              marginRight: imagePadding,
            }}
          >
            <LottieView
              ref={(animation5) => {
                this.animation5 = animation5;
              }}
              loop={false}
              style={{ width: "30%", height: "100%" }}
              source={PremiumEndBolt}
              onAnimationFinish={() => this.animation6.play()}
            />
          </View>
          <View
            style={{
              height: "100%",
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: imagePadding,
              marginRight: imagePadding,
            }}
          >
            <LottieView
              ref={(animation6) => {
                this.animation6 = animation6;
              }}
              loop={false}
              style={{ width: "30%", height: "100%" }}
              source={PremiumEndSweatDrop}
            />
          </View>
        </View>
      </View>
    );
  }
  render() {
    const { quote, onClose, regularImage, squareImage, title } = this.props;

    const {
      container,
      mask,
      img,
      btnText,
      smallBtnTextNormal,
      smallBtnTextSelected,
      titleText,
      bottomText,
      shareText,
      text,
      mainContent,
      signatureStyle,
      btnSmall,
      btnSmallSelected,
      btn,
    } = styles;
    const { height, width } = Dimensions.get("window");
    const bgWidthRatio = 414 / 791;
    const bgRatio = 791 / 414;
    const topMargin = Platform.OS === "ios" ? 34 : 64;
    const newWidth = (width * 0.85) / 2;
    const newHeight = newWidth * bgRatio - topMargin;
    const imagePadding = 13;
    const containerStyle = {
      ...container,
      width: width,
      height: height,
    };
    const colors = [colorNew.darkPink, colorNew.lightPink];
    return (
      <View style={containerStyle}>
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginTop: 64, marginEnd: 19 }}
          onPress={onClose}
        >
          <Image style={{ tintColor: "#000" }} source={cancel_round_cross} />
        </TouchableOpacity>
        {/*<Text allowFontScaling={false} style={titleText}>{'BE YOUR OWN HYPE GIRL'.toUpperCase()}</Text>*/}
        <Text allowFontScaling={false} style={titleText}>
          {" "}
        </Text>
        <Text allowFontScaling={false} style={shareText}>
          {"BE YOUR OWN HYPE GIRL".toUpperCase()}
        </Text>
        <View style={mask}>
          <View
            style={{
              flex: 1,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              ref={(snapshot) => (this.snapshotStory = snapshot)}
              style={{
                marginTop: "5%",
                width: newWidth,
                height: newHeight,
                overflow: "hidden",
                borderRadius: 0,
                marginBottom: 10,
              }}
            >
              <ImageBackground
                style={{
                  ...img,
                  width: "100%",
                  height: "105%",
                  marginTop: 0,
                  marginLeft: "0%",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  backgroundColor: "#b2b2b2",
                }}
                resizeMode="contain"
                source={regularImage}
              >
                {this.renderAnimatedView()}
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.bottomDailyText,
                    fontWeight: "bold",
                    fontSize: 12,
                    // letterSpacing: 0.5,
                    marginBottom: 0,
                  }}
                >
                  {title.toUpperCase()}
                </Text>
              </ImageBackground>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isStorySize: "story" });
              }}
            >
              <View
                style={
                  this.state.isStorySize == "story"
                    ? btnSmallSelected
                    : btnSmall
                }
              >
                <Text
                  allowFontScaling={false}
                  style={
                    this.state.isStorySize == "story"
                      ? smallBtnTextSelected
                      : smallBtnTextNormal
                  }
                >
                  STORY
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: 2,
              height: "96%",
              marginTop: "4%",
              backgroundColor: colorNew.boxGrey,
            }}
          ></View>
          <View
            style={{
              flex: 1,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              ref={(snapshot) => (this.snapshotSquare = snapshot)}
              style={{
                flex: 1,
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: newWidth,
                  height: newWidth,
                  overflow: "hidden",
                  borderRadius: 0,
                  marginRight: 5,
                }}
              >
                <ImageBackground
                  style={{
                    ...img,
                    width: "100%",
                    height: "100%",
                    marginTop: 0,
                    marginLeft: "0%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    backgroundColor: "#b2b2b2",
                  }}
                  resizeMode="contain"
                  source={squareImage}
                >
                  {this.renderAnimatedView1()}
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.bottomDailyText,
                      fontWeight: "bold",
                      fontSize: 12,
                      // letterSpacing: 0.5,
                      marginBottom: -3,
                    }}
                  >
                    {title.toUpperCase()}
                  </Text>
                </ImageBackground>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isStorySize: "square" });
              }}
            >
              <View
                style={
                  this.state.isStorySize == "square"
                    ? btnSmallSelected
                    : btnSmall
                }
              >
                <Text
                  allowFontScaling={false}
                  style={
                    this.state.isStorySize == "square"
                      ? smallBtnTextSelected
                      : smallBtnTextNormal
                  }
                >
                  FEED
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={btn} onPress={() => this._shareClicked()}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={colors}
            style={styles.linearGradient}
          >
            <Text allowFontScaling={false} style={btnText}>
              Share On Social
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text allowFontScaling={false} style={bottomText}>
          Use #TEAMLSF & #LOVESWEATFITNESS
        </Text>
      </View>
    );
  }
  _shareClicked() {
    console.log("_shareClicked");
    console.log(this.state.isStorySize);
    if (this.state.isStorySize == "") {
      Alert.alert(
        "",
        "Please choose Story Size or Square above, then try again."
      );
      return;
    }
    var shareViewRef = this.snapshotStory;
    if (this.state.isStorySize == "square") {
      shareViewRef = this.snapshotSquare;
    }
    this._shareFor(shareViewRef, false);
  }
  _share(uri) {
    RNFS.readFile(uri, "base64").then((res) => {
      let shareOptionsUrl = {
        title: "LSF",
        message: "LSF",
        url: `data:image/jpeg;base64,${res}`, // use image/jpeg instead of image/jpg
        subject: "LSF",
      };
      ShareNew.open(shareOptionsUrl)
        .then((res) => {
          console.log(res);
          this.props.close();
        })
        .catch((err) => {
          err && console.log(err);
        });
    });
  }
  _shareFor(shareViewRef, openInstaModel) {
    console.log("_share");

    captureRef(shareViewRef, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._share(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
  _requestStoragePermission = () => {
    try {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Love Sweat Fitness Storage Permission",
          message:
            "Love Sweat Fitness would like to save photos to your photo " +
            "gallery to save and share images. Your photos wont be shared without your permission.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
    } catch (err) {
      console.warn(err);
    }
  };

  _postToInstagram() {
    const { onClose } = this.props;

    if (Platform.OS === "android") {
      this._requestStoragePermission().then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CameraRoll.save(this.props.shareImage, "photo")
            .then(() => Linking.openURL("http://instagram.com"))
            .catch((err) => console.log("err:", err));
        }
      });
    } else {
      CameraRoll.save(this.props.shareImage, "photo").then(() => {
        Linking.openURL(
          "instagram://library?OpenInEditor=1&LocalIdentifier=" +
            this.state.imageUrl
        );
      });
    }
  }
}

const styles = {
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  mask: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: height * 0.5,
  },
  img: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
    marginBottom: "5%",
    marginLeft: "10%",
    width: "80%",
    height: "72%",
  },
  bottomDailyText: {
    width: "100%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 25,
    marginTop: 10,
    marginBottom: 10,
    // letterSpacing: 4,
    textAlign: "center",
    color: "#fff",
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    marginTop: 20,
  },
  btnText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  linearGradient: {
    width: width * 0.85,
    height: 50,
    marginTop: 30,
    marginBottom: 0,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  smallBtnTextSelected: {
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0.1,
    textAlign: "center",
    color: "#ffffff",
  },
  smallBtnTextNormal: {
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    letterSpacing: 0.1,
    color: colorNew.textPink,
  },
  bottomText: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    marginBottom: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#000",
  },
  titleText: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#000",
  },
  shareText: {
    fontFamily: "SF Pro Text",
    fontSize: 17,
    margin: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: colorNew.textPink,
  },
  btn: {
    marginTop: 20,
    marginBottom: 30,
  },
  btnSmall: {
    borderColor: color.mediumPink,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    width: (width / 2) * 0.7,
    height: 30,
    borderRadius: 100,
    marginTop: 10,
    marginLeft: 0,
  },
  btnSmallSelected: {
    backgroundColor: colorNew.darkPink,
    justifyContent: "center",
    alignItems: "center",
    width: (width / 2) * 0.7,
    borderRadius: 100,
    height: 30,
    marginTop: 10,
    marginLeft: 0,
  },
  mainContent: {
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    justifyContent: "center",
    color: color.black,
    marginTop: 50,
    width: 260,
    lineHeight: 27,
  },
  signatureStyle: {
    fontFamily: "Northwell",
    fontSize: 40,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    justifyContent: "center",
    color: color.hotPink,
    marginTop: 30,
  },
};
