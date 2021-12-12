import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Image,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid,
  Alert,
  AsyncStorage,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { sample, range } from "lodash";
import { color, colorNew } from "../../../modules/styles/theme";
import { Subscriptions } from "../../../components/common";
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
import { captureRef } from "react-native-view-shot";
import { icon_close_x_pink } from "../../../images";
import ShareNew from "react-native-share";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";

const { height, width } = Dimensions.get("window");

export default class extends Component {
  constructor(props) {
    super(props);
    this._saveToPhone = this._saveToPhone.bind(this);
    this._close = this._close.bind(this);
    this.state = {
      showSubscriptionModal: false,
    };
  }
  _navigateToWorkouts = () => {
    captureRef(this.refs, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._share(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
    // this.props.close();
    // this.props.navigation.navigate('Menu');
    // this.props.navigation.navigate('ProgressPhotoBuilder');
  };
  _share(uri) {
    if (Platform.OS === "android") {
      RNFS.readFile(uri, "base64").then((res) => {
        let shareOptionsUrl = {
          title: "LSF",
          message: "LSF - Daily 10 completed",
          url: `data:image/jpeg;base64,${res}`, // use image/jpeg instead of image/jpg
          subject: "LSF - Daily 10 completed",
          social: ShareNew.Social.INSTAGRAM,
        };
        ShareNew.shareSingle(shareOptionsUrl)
          .then((res) => {
            console.log(res);
            this.props.close();
            this.props.navigation.navigate("Menu");
          })
          .catch((err) => {
            err && console.log(err);
          });
      });
    } else {
      CameraRoll.save(uri, "photo")
        .then(() => {
          Linking.openURL(
            "instagram://library?OpenInEditor=1&LocalIdentifier=" + uri
          );
        })
        .catch((err) => console.log("err:", err));
    }
  }
  _close = () => {
    this.props.close();
  };
  _closeModal = () => {
    this.setState({ showSubscriptionModal: false });
  };
  _renderSubscriptionModal() {
    const { showSubscriptionModal } = this.state;

    return (
      <Modal
        visible={showSubscriptionModal}
        onRequestClose={() => alert("close")}
      >
        <Subscriptions onClose={this._closeModal} />
      </Modal>
    );
  }
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
  _renderEndscreen = () => {
    const { endScreen } = this.props;

    // return (
    //   <ImageBackground
    //     style={imageStyle}
    //     source={require("../images/daily_10_finish_1.jpg")}
    //   />
    // );

    return endScreen != null || endScreen != undefined ? (
      <ImageBackground style={imageStyle} source={{ uri: endScreen }} />
    ) : (
      <ImageBackground
        style={imageStyle}
        source={require("../images/Daily_10_End_Screen_Sept-02.jpg")}
      />
    );
  };
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
    const { endScreen } = this.props;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    const topMargin = Platform.OS === "ios" ? 64 : 44;
    const bottomMargin = height * 0.2;

    const min = 1;
    const max = 4;
    var x = parseInt(min + Math.random() * (max - min));

    var img_url;

    if (x === 1) {
      img_url = require("../images/daily_10_finish_1.jpg");
    } else if (x === 2) {
      img_url = require("../images/daily_10_finish_2.jpg");
    } else {
      img_url = require("../images/daily_10_finish_3.jpg");
    }

    return (
      <View
        ref={(snapshot) => (this.refs = snapshot)}
        collapsable={false}
        style={[
          this.shadowBottom(5),
          {
            width: "80%",
            height: height - topMargin - bottomMargin,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 40,
            top: topMargin,
            backgroundColor: "#fff",
          },
        ]}
      >
        <Image
          style={{
            backgroundColor: "transparent",
            width: "100%",
            height: height - topMargin - bottomMargin,
            resizeMode: "stretch",
            alignSelf: "center",
            borderRadius: 40,
            // margin: 20,
          }}
          source={img_url}
        />
        {/* <ImageBackground
          style={styles.linearGradient}
          source={require("../images/daily_10_finish_1.jpg")}
        /> */}
      </View>
    );
  };

  // _renderEndscreenNew = () => {
  //   const { endScreen } = this.props;
  //   const colors = [colorNew.darkPink, colorNew.lightPink];
  //   const topMargin = Platform.OS === "ios" ? 64 : 44;
  //   const bottomMargin = height * 0.2;
  //   return (
  //     <View
  //       ref={(snapshot) => (this.refs = snapshot)}
  //       collapsable={false}
  //       style={[
  //         this.shadowBottom(5),
  //         {
  //           width: "80%",
  //           height: height - topMargin - bottomMargin,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           borderRadius: 40,
  //           top: topMargin,
  //           backgroundColor: "#fff",
  //         },
  //       ]}
  //     >
  //       <LinearGradient
  //         // ref="snapshot"
  //         start={{ x: 0, y: 0 }}
  //         end={{ x: 0, y: 1 }}
  //         colors={colors}
  //         style={styles.linearGradient}
  //       >
  //         <View
  //           style={{
  //             width: "100%",
  //             height: "35%",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             top: 30,
  //           }}
  //         >
  //           {/*<Text allowFontScaling={false} style={styles.d10HeadingText}>D10</Text>*/}
  //           <Image
  //             style={{
  //               backgroundColor: "transparent",
  //               width: "35%",
  //               height: "35%",
  //               resizeMode: "contain",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               margin: 20,
  //             }}
  //             source={require("../images/D10.png")}
  //           />
  //           <Text allowFontScaling={false} style={styles.headingText}>
  //             LSF THE APP
  //           </Text>
  //         </View>
  //         <View
  //           style={{
  //             width: "100%",
  //             height: "30%",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             top: 15,
  //           }}
  //         >
  //           <View
  //             style={{
  //               width: "70%",
  //               height: "100%",
  //               justifyContent: "center",
  //               alignItems: "center",
  //             }}
  //           >
  //             <Image
  //               style={{
  //                 backgroundColor: "transparent",
  //                 width: "65%",
  //                 height: "65%",
  //                 resizeMode: "contain",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //               source={require("../images/right_mark_rounded.png")}
  //             />
  //           </View>
  //         </View>
  //         <View
  //           style={{
  //             width: "100%",
  //             height: "35%",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             bottom: 15,
  //           }}
  //         >
  //           <Text allowFontScaling={false} style={styles.bottomDailyText}>
  //             DAILY TEN:{" "}
  //             <Text allowFontScaling={false} style={styles.bottomDoneText}>
  //               DONE
  //             </Text>
  //           </Text>
  //           <Text allowFontScaling={false} style={styles.bottomWayText}>
  //             WAY TO GO, BABE!
  //           </Text>
  //         </View>
  //       </LinearGradient>
  //     </View>
  //   );
  // };

  render() {
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

    return (
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: 50,
            marginTop: 10,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "flex-start",
            marginRight: 10,
            position: "absolute",
          }}
        >
          <TouchableOpacity activeOpacity={0.5} onPress={this._close}>
            <Image style={{ margin: 20 }} source={icon_close_x_pink} />
          </TouchableOpacity>
        </View>
        {this._renderEndscreenNew()}
        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 40 }}>
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
              onPress={this._navigateToWorkouts}
              underlayColor={"#ee90af"}
            >
              <Text style={styles.buttonText}>SHARE!</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this._renderSubscriptionModal()}
      </View>
    );
  }
  _saveToPhone() {
    captureRef(this.refs, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._savePhoto(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
  photoSaved() {
    // Alert.alert("Daily 10", "Yay! Your photo has been saved.");
    Alert.alert("Daily 10", "Yay! Your photo has been saved.", [
      { text: "OK", onPress: this.props.close },
    ]);
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
    captureRef(this.refs, {
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

const styles = {
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    top: Platform.OS === "ios" ? -20 : 10,
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  bottomDailyText: {
    width: "100%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 4,
    textAlign: "center",
    color: "#fff",
  },
  bottomDoneText: {
    width: "20%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 25,
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
    textAlign: "center",
    color: colorNew.textPink,
  },
  headingText: {
    width: 249,
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 4,
    textAlign: "center",
    color: "#fff",
  },
  d10HeadingText: {
    width: 249,
    height: 80,
    fontFamily: "Northwell",
    fontSize: 50,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 80,
    textAlign: "center",
    letterSpacing: 4,
    color: "#fff",
  },
  shareBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    marginTop: 20,
    height: 50,
  },
  buttonView: {
    height: 48,
    width: "47%",
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
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginLeft: 0,
  },
};
