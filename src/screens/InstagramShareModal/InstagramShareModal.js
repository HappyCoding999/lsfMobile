import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  PermissionsAndroid,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { LargeButton } from "../../components/common";
import { color, colorNew } from "../../modules/styles/theme";
import { cancel_round_cross } from "../../images";

const { height, width } = Dimensions.get("window");

export default class extends Component {
  constructor(props) {
    super(props);
    console.log("Instagram Share Modal");
    console.log(props.shareImage);

    this._postToInstagram = this._postToInstagram.bind(this);

    this.state = {
      error: null,
      res: null,
      previewSource: "",
      value: {
        format: "png",
        quality: 0.9,
        result: "tmpfile",
        snapshotContentContainer: false,
      },
    };
  }

  render() {
    const { quote, onClose } = this.props;

    const {
      container,
      mask,
      img,
      btnText,
      text,
      mainContent,
      signatureStyle,
      btn,
    } = styles;

    const { height, width } = Dimensions.get("window");
    const containerStyle = {
      ...container,
      width: 0.9 * width,
    };

    return (
      <View style={{ ...containerStyle, borderRadius: 40 }}>
        <View style={mask}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginTop: -10, marginEnd: 20 }}
            onPress={onClose}
          >
            <Image
              style={{ tintColor: "#b2b2b2" }}
              source={cancel_round_cross}
            />
          </TouchableOpacity>
          {this.props.shareImage ? (
            <Image
              style={img}
              resizeMode={"contain"}
              source={{ isStatic: true, uri: this.props.shareImage }}
            />
          ) : (
            <Image
              style={img}
              source={require("./images/illustrationQuoteshapes.png")}
            />
          )}
        </View>
        <View
          style={{
            width: "85%",
            height: 50,
            margin: 30,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            backgroundColor: colorNew.mediumPink,
            borderColor: colorNew.mediumPink,
            borderRadius: 25,
          }}
        >
          <TouchableOpacity onPress={() => this._postToInstagram()}>
            <Text allowFontScaling={false} style={btnText}>
              Share On Instagram
            </Text>
          </TouchableOpacity>
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
      console.log(this.props);
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: height * 0.47,
  },
  img: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "80%",
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
  btn: {
    marginTop: 20,
    marginBottom: 30,
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
