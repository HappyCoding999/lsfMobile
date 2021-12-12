import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid,
  Alert,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { sample, range } from "lodash";
import { color, colorNew } from "../../modules/styles/theme";
import { Subscriptions } from "../../components/common";
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
import { captureRef } from "react-native-view-shot";
import {
  icon_close_x_pink,
  premium_end_bg,
  cancel_round_cross,
  ic_back_white,
  premium_end_bottom_image_combo,
} from "../../images";
import {
  end_screens_1,
  end_screens_2,
  end_screens_3,
  end_screens_4,
  end_screens_7,
  end_screens_self_care_day,
} from "../../images";
import LottieView from "lottie-react-native";
import PremiumEndBolt from "../../animations/PremiumEndBolt";
import PremiumEndCheckmark from "../../animations/PremiumEndCheckmark";
import PremiumEndSweatDrop from "../../animations/PremiumEndSweatDrop";
import Selfie from "../Workouts/CompletionModalStack/Selfie";
import ShareModal from "../ShareModal";

const { height, width } = Dimensions.get("window");
const START_ANIMATION_ATTEMPT_THRESHOLD = 10;

class PremiumEndScreen extends Component {
  constructor(props) {
    super(props);
    this._saveToPhone = this._saveToPhone.bind(this);
    this._openShareModal = this._openShareModal.bind(this);

    this.state = {
      showSubscriptionModal: false,
      showSelfiModal: false,
      showShareModal: false,
      shareImage: "",
      startAnimationCounter: 0,
    };
  }
  _imageBackgroundsRef = (title, day) => {
    const {
      bonusChallenge,
      absCardio,
      armsAbs,
      cardioSweatSesh,
      secondaryCardioSweatSesh,
      fullBody,
      legsBooty,
      selfCare,
    } = this.props.endScreens;

    const img = {
      bonusChallenge: this.linkCheck(bonusChallenge)
        ? { uri: bonusChallenge }
        : require("./images/bonuschallenge.jpg"),
      "Abs + Cardio": this.linkCheck(absCardio)
        ? { uri: absCardio }
        : require("./images/absAndCardioEndscreen.jpg"),
      "Arms + Abs": this.linkCheck(armsAbs)
        ? { uri: armsAbs }
        : require("./images/armsAndAbsEndscreen.jpg"),
      "Full Body": this.linkCheck(fullBody)
        ? { uri: fullBody }
        : require("./images/fullBodyEndscreen.jpg"),
      "Legs + Booty": this.linkCheck(legsBooty)
        ? { uri: legsBooty }
        : require("./images/legsAndBootyEndscreen.jpg"),
      "Self Care": this.linkCheck(selfCare)
        ? { uri: selfCare }
        : require("./images/selfLoveEndscreen.jpg"),
      "Cardio Sweat Sesh":
        day != 4
          ? this.linkCheck(cardioSweatSesh)
            ? { uri: cardioSweatSesh }
            : require("./images/cardioSweatSeshEndscreen.jpg")
          : this.linkCheck(secondaryCardioSweatSesh)
          ? { uri: secondaryCardioSweatSesh }
          : require("./images/legsAndBootyEndscreen.jpg"),
    };

    return img[title];
  };

  _imageBackgroundsRefForSquare = (title, day) => {
    const {
      bonusChallenge,
      absCardio,
      armsAbs,
      cardioSweatSesh,
      secondaryCardioSweatSesh,
      fullBody,
      legsBooty,
      selfCare,
    } = this.props.endScreensSquare;

    const img = {
      bonusChallenge: this.linkCheck(bonusChallenge)
        ? { uri: bonusChallenge }
        : require("./images/square_bonuschallenge.jpg"),
      "Abs + Cardio": this.linkCheck(absCardio)
        ? { uri: absCardio }
        : require("./images/square_absAndCardioEndscreen.jpg"),
      "Arms + Abs": this.linkCheck(armsAbs)
        ? { uri: armsAbs }
        : require("./images/square_armsAndAbsEndscreen.jpg"),
      "Full Body": this.linkCheck(fullBody)
        ? { uri: fullBody }
        : require("./images/square_fullBodyEndscreen.jpg"),
      "Legs + Booty": this.linkCheck(legsBooty)
        ? { uri: legsBooty }
        : require("./images/square_legsAndBootyEndscreen.jpg"),
      "Self Care": this.linkCheck(selfCare)
        ? { uri: selfCare }
        : require("./images/square_selfLoveEndscreen.jpg"),
      "Cardio Sweat Sesh":
        day != 4
          ? this.linkCheck(cardioSweatSesh)
            ? { uri: cardioSweatSesh }
            : require("./images/square_cardioSweatSeshEndscreen.jpg")
          : this.linkCheck(secondaryCardioSweatSesh)
          ? { uri: secondaryCardioSweatSesh }
          : require("./images/square_legsAndBootyEndscreen.jpg"),
    };

    return img[title];
  };

  linkCheck = (link) => {
    return link && link.includes("https");
  };
  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    const { startAnimationCounter } = this.state;
    if (startAnimationCounter > START_ANIMATION_ATTEMPT_THRESHOLD) {
      return;
    }
    this.setState({ startAnimationCounter: startAnimationCounter + 1 });
    console.log("startAnimation: ", startAnimationCounter + 1);
    setTimeout(() => {
      if (this.animation) {
        this.animation.play();
      } else {
        this.startAnimation();
      }
    }, 100);
  };

  _navigateToWorkouts = () => {
    this.props.close();
    this.props.navigation.navigate("Menu");
    // this.props.navigation.navigate('ProgressPhotoBuilder');
  };

  isIphoneXorAbove() {
    const dimen = Dimensions.get("window");

    return (
      Platform.OS === "ios" &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 ||
        dimen.width === 812 ||
        dimen.height === 896 ||
        dimen.width === 896)
    );
  }

  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.15,
      shadowRadius: 0.7 * elevation,
      backgroundColor: "white",
    };
  }
  _renderEndscreenNew = () => {
    const bgWidthRatio = 414 / 791;
    const bgRatio = 791 / 414;
    var imageStyle = {
      flex: 1,
      height: height,
      width: width,
      top: -50,
      resizeMode: "contain",
      backgroundColor: "white",
    };
    if (Platform.OS === "ios") {
      if (this.isIphoneXorAbove()) {
        imageStyle = {
          flex: 1,
          height: height,
          width: width,
          top: -64,
          resizeMode: "contain",
          backgroundColor: "white",
        };
      } else {
        imageStyle = {
          flex: 1,
          height: height + 20,
          width: width,
          top: -50,
          resizeMode: "contain",
          backgroundColor: "white",
        };
      }
    } else {
      imageStyle = {
        flex: 1,
        height: height,
        width: width,
        top: -50,
        resizeMode: "contain",
        backgroundColor: "white",
      };
    }
    const { title, day } = this.props.headerProps;
    const { endScreens, endScreensSquare } = this.props;

    // console.log("title from CompletionModalStackWrapper in PremiumEndScreen")
    // console.log(title);

    const colors = [colorNew.darkPink, colorNew.lightPink];
    const topMargin = Platform.OS === "ios" ? 64 : 64;
    const bottomMargin = height * 0.2;
    const newWidth = width * 0.8;
    const newHeight = newWidth * bgRatio - topMargin;
    const imagePadding = 13;
    const imagePaddingNew = 0;
    var arr = [
      end_screens_1,
      end_screens_2,
      end_screens_3,
      end_screens_4,
      end_screens_7,
    ];
    const shuffled = arr.sort(() => 0.5 - Math.random());
    // var end_screens = shuffled[0];
    // var end_screens = shuffled[0];
    var imgSource;
    imgSource = this._imageBackgroundsRef(title, day);
    console.log("Vishal imgSource for title => " + title);
    console.log(imgSource);
    // if (title == "Self Care") {
    //   end_screens = end_screens_self_care_day;
    // }
    return (
      <View
        style={[
          this.shadowBottom(5),
          {
            width: newWidth,
            height: newHeight,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 40,
            top: topMargin,
          },
        ]}
      >
        <View
          ref="snapshot"
          style={{
            width: newWidth,
            height: newHeight,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 40,
            overflow: "hidden",
            top: 0,
            backgroundColor: "#b2b2b2",
          }}
        >
          <ImageBackground
            imageStyle={{ resizeMode: "cover" }}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            source={imgSource}
          >
            <View
              style={{
                width: "100%",
                height: "15%",
                justifyContent: "center",
                alignItems: "flex-start",
                top: 0,
              }}
            >
              {/*<Text allowFontScaling={false} style={{...styles.headingText,textAlign: "left",fontSize: 22,letterSpacing: 3}}>LSF THE APP</Text>*/}
            </View>
            <View
              style={{
                width: "100%",
                height: "55%",
                justifyContent: "center",
                alignItems: "center",
                top: 15,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                height: "25%",
                justifyContent: "center",
                alignItems: "center",
                bottom: 10,
              }}
            >
              <View
                style={{
                  width: "24%",
                  height: 75,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: 5,
                }}
              >
                {/*<Image style={{marginLeft: imagePadding,marginRight:imagePadding}} source={icon_close_x_pink} />
              <Image style={{marginLeft: imagePadding,marginRight:imagePadding}} source={icon_close_x_pink} />
              <Image style={{marginLeft: imagePadding,marginRight:imagePadding}} source={icon_close_x_pink} />*/}
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
                      if (animation) {
                        this.animation = animation;
                      }
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
                      if (animation1) {
                        this.animation1 = animation1;
                      }
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
                      if (animation2) {
                        this.animation2 = animation2;
                      }
                    }}
                    loop={false}
                    style={{ width: "30%", height: "100%" }}
                    source={PremiumEndSweatDrop}
                  />
                </View>
                {/*<Image style={{width: 12,height:11,resizeMode: 'contain'}} source={icon_shop_now_arrow} />*/}
                {/*<Image style={{width:"90%",height:"90%",resizeMode: 'contain',marginLeft: imagePadding}} source={premium_end_bottom_image_combo} />*/}
              </View>
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.bottomDailyText,
                  fontWeight: "bold",
                  fontSize: 20,
                  letterSpacing: 3,
                }}
              >
                {title.toUpperCase()}
              </Text>
              {/*<Text allowFontScaling={false} style={{...styles.bottomWayText,fontWeight: "bold",fontSize: 13,marginRight:25,letterSpacing: 3}}>YOU CRUSHED IT!</Text>*/}
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  render() {
    console.log("render called in PremiumEndScreen");
    // if (Platform.OS === "ios") {

    //   if (this.isIphoneXorAbove()) {
    //     imageStyle = {flex: 1, height: height, width: width, top: -64, resizeMode: 'contain', backgroundColor: 'white'};
    //   } else {
    //     imageStyle = {flex: 1, height: height + 20, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
    //   }

    // } else {
    //   imageStyle = {flex: 1, height: height, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
    // }

    const { challengeActive } = this.props;

    const { challengeSelfieFrame, shift } = this.props.headerProps;
    console.log("Vishal device height : " + height);
    return (
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: 50,
            marginTop: 10,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "space-around",
            marginRight: 10,
            position: "absolute",
            zIndex: 10,
            flexDirection: "row",
          }}
        >
          {/*<TouchableOpacity activeOpacity={0.5} onPress={shift}>
            <Image style={{ margin: 20,height: '90%',top:20,tintColor:colorNew.darkPink}} resizeMode="contain" source={ic_back_white} />
            </TouchableOpacity>*/}
          <TouchableOpacity activeOpacity={0.5}></TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={0.5} onPress={shift}>
            <Image
              style={{
                margin: 20,
                height: "90%",
                top: 20,
                tintColor: colorNew.darkPink,
              }}
              resizeMode="contain"
              source={cancel_round_cross}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: height > 736 ? "85%" : "75%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this._renderEndscreenNew()}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          <View style={styles.shareBtnsContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonView}
              onPress={this._saveToPhone}
              underlayColor={"#ee90af"}
            >
              <Text style={styles.buttonText}>SAVE TO PHONE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonView}
              onPress={this._openShareModal}
              underlayColor={"#ee90af"}
            >
              <Text style={styles.buttonText}>SHARE!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonView}
              onPress={this._openSelfieModal}
              underlayColor={"#ee90af"}
            >
              <Text style={styles.buttonText}>SWEATY SELFIE!</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Selfie
          shareImage={this.state.shareImage}
          onPostSuccessful={() => console.log("post successful")}
          visible={this.state.showSelfiModal}
          challengeActive={challengeActive}
          challengeSelfieFrame={challengeSelfieFrame}
          onClose={this._closeSelfieModal}
        />
        {this.renderShare()}
      </View>
    );
  }

  _openShareModal() {
    this.setState({
      showShareModal: true,
    });
  }

  _closeShareModal() {
    this.setState({
      showShareModal: false,
    });
  }
  renderShare() {
    const { showShareModal } = this.state;
    const { title, day } = this.props.headerProps;
    var imgSource;
    var imgSourceSquare;
    imgSource = this._imageBackgroundsRef(title, day);
    imgSourceSquare = this._imageBackgroundsRefForSquare(title, day);
    return (
      <View>
        <ShareModal
          title={title}
          regularImage={imgSource}
          squareImage={imgSourceSquare}
          visible={showShareModal}
          onClose={() => this._closeShareModal()}
        />
      </View>
    );
  }
  _openSelfieModal = () => {
    this.setState({
      showSelfiModal: true,
    });
  };
  _closeSelfieModal = () => {
    this.setState({
      showSelfiModal: false,
    });
  };

  _saveToPhone() {
    captureRef(this.refs["snapshot"], {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._savePhoto(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
  photoSaved() {
    Alert.alert("Yay!", "Your Photo Has Been Saved");
    this.props.close();
    // this.props.navigation.navigate('Menu');
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
  _savePhoto(uri) {
    if (Platform.OS === "android") {
      this._requestStoragePermission().then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CameraRoll.save(uri, "photo")
            .then(() => this.photoSaved())
            .catch((err) => console.log("err:", err));
        }
      });
    } else {
      CameraRoll.save(uri, "photo")
        .then(() => this.photoSaved())
        .catch((err) => console.log("err:", err));
    }
  }
  _postToInstagram() {
    captureRef(this.refs["snapshot"], {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._send(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
  _send(uri) {
    if (Platform.OS === "android") {
      this._requestStoragePermission().then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CameraRoll.save(uri, "photo")
            .then(() => Linking.openURL("http://instagram.com"))
            .catch((err) => console.log("err:", err));
        }
      });
    } else {
      CameraRoll.save(uri, "photo").then(() => {
        Linking.openURL(
          "instagram://library?OpenInEditor=1&LocalIdentifier=" +
            this.state.imageUrl
        );
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    top: Platform.OS === "ios" ? -20 : 10,
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
    letterSpacing: 4,
    textAlign: "center",
    color: "#fff",
  },
  bottomWayText: {
    width: 249,
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 5,
    textAlign: "right",
    color: colorNew.textPink,
  },
  headingText: {
    width: 249,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 4,
    paddingLeft: 10,
    textAlign: "center",
    color: "#fff",
  },
  shareBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    marginTop: 20,
    height: 35,
  },
  buttonView: {
    height: 34,
    width: "30%",
    borderRadius: 100,
    backgroundColor: colorNew.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    width: "90%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginLeft: 0,
  },
});

export default PremiumEndScreen;
