import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  Dimensions,
  Platform,
  Linking,
  PermissionsAndroid,
  Alert,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { color, colorNew } from "../../../../../modules/styles/theme";
import { LargeButton } from "../../../../../components/common";
import { captureRef, captureScreen } from "react-native-view-shot";
import LinearGradient from "react-native-linear-gradient";

import ShareNew from "react-native-share";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";

const { width, height } = Dimensions.get("window");

export default class Settings extends Component {
  render() {
    const colors = [colorNew.lightPink, colorNew.darkPink];
    const {
      title,
      content,
      largeStickerComponent: LargeSticker,
      name,
      active,
    } = this.props;
    const { container, titleStyle, contentStyle, stickerStyle } = styles;

    // const containerStyle = {
    //   ...container,
    //   top: (0.27 * height),
    //   left: (0.05 * width),
    // height: (0.56 * height),
    // width: (0.9 * width)
    // };

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {/*<View ref="snapshot" options={{ format: "png", quality: 0.9 }}  collapsable={false}>
          <LinearGradient colors={colors} style={{ width: width, height: width, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <View style={{ height: "90%", width: "90%", justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
              {LargeSticker ? <LargeSticker stickerStyle={{ width: 160, height: 160}} /> : null}
              <Text allowFontScaling={false} style={titleStyle}>{name}</Text>
              <Image style={{ margin: 5 }} source={require("../../../images/illustrationSwiggle.png")} />
              <Text allowFontScaling={false} style={contentStyle}>{content}</Text>
            </View>
          </LinearGradient>
        </View>*/}
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "transparent",
            position: "absolute",
            top: 0,
          }}
        >
          {/*<LinearGradient colors={colors} style={{ width: width, height: height, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", backgroundColor: "orange" }}>*/}
          <View
            ref={(snapshot) => (this.refs = snapshot)}
            collapsable={false}
            style={{
              ...container,
              backgroundColor: active ? "white" : "#bababa",
            }}
          >
            <View
              style={{
                height: "90%",
                width: "100%",
                position: "absolute",
                top: 80,
                backgroundColor: active ? "#fff" : "#bababa",
              }}
            ></View>
            <View style={{ ...stickerStyle, marginTop: 0 }}>
              {LargeSticker ? (
                <LargeSticker
                  stickerStyle={{ width: 150, height: 150, marginBottom: 10 }}
                />
              ) : null}
            </View>
            <Text
              allowFontScaling={false}
              style={{ ...titleStyle, color: active ? "#000" : "#fff" }}
            >
              {name}
            </Text>
            {active ? (
              <Image
                style={{ margin: 20 }}
                source={require("../../../images/illustrationSwiggle.png")}
              />
            ) : (
              <Image
                style={{ margin: 20, tintColor: "#fff" }}
                source={require("../../../images/illustrationSwiggle.png")}
              />
            )}
            <Text
              allowFontScaling={false}
              style={{ ...contentStyle, color: active ? "#000" : "#fff" }}
            >
              {content}
            </Text>
          </View>
          {active ? (
            <View style={{ bottom: 60 }}>
              <LargeButton onPress={() => this._postToInstagram(name, content)}>
                SHARE YOUR TROPHY
              </LargeButton>
            </View>
          ) : null}

          {/*</LinearGradient>*/}
        </View>
      </View>
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

  _postToInstagram = (name, content) => {
    // Alert.alert("URI", JSON.stringify(this.refs));
    // this.refs["snapshot"]
    captureRef(this.refs, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._send(uri, name, content),
      (error) => Alert.alert("Oops", error.toString())
    );
  };

  _send(uri, name, content) {
    if (Platform.OS === "android") {
      RNFS.readFile(uri, "base64").then((res) => {
        let shareOptionsUrl = {
          title: "LSF",
          message: "LSF",
          url: `data:image/jpeg;base64,${res}`, // use image/jpeg instead of image/jpg
          subject: "LSF",
          social: ShareNew.Social.INSTAGRAM,
        };
        ShareNew.shareSingle(shareOptionsUrl)
          .then((res) => {
            console.log(res);
            // this.props.close();
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

  // _send(uri) {
  //   if (Platform.OS === "android") {
  //     this._requestStoragePermission().then((granted) => {
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         CameraRoll.saveToCameraRoll(uri, "photo")
  //           .then(() => Linking.openURL("http://instagram.com"))
  //           .catch((err) => console.log("err:", err));
  //       }
  //     });
  //   } else {
  //     CameraRoll.saveToCameraRoll(uri, "photo").then(() => {
  //       Linking.openURL(
  //         "instagram://library?OpenInEditor=1&LocalIdentifier=" + uri
  //       );
  //     });
  //   }
  // }
}

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "transparent",
    height: height > 667 ? 0.75 * height : 0.8 * height,
    width: 0.9 * width,
    borderRadius: 40,
    overflow: "hidden",
  },
  renderContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "transparent",
    height: height > 667 ? 470 : 0.7 * height,
    width: 0.9 * width,
  },
  titleStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  contentStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    width: "80%",
  },
  stickerStyle: {},
};
