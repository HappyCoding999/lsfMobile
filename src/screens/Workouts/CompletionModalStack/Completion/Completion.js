import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Share,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import InstagramShareModal from "../../../InstagramShareModal";
import Selfie from "../Selfie";
import { color } from "../../../../modules/styles/theme";
import { captureRef } from "react-native-view-shot";
import Camera from "../../../Camera";

const { height, width } = Dimensions.get("window");

export default class extends Component {
  state = {
    showSelfiModal: false,
    showInspoModal: false,
    shareImage: "",
    showCamera: false,
  };

  render() {
    const { container } = styles;

    const { title, endScreen, day } = this.props;

    var imgSource;

    if (endScreen) {
      imgSource = endScreen;
    } else {
      imgSource = this._imageBackgroundsRef(title, day);
    }

    return (
      <View style={styles.container}>
        <View
          ref={(snapshot) => (this.snapshot = snapshot)}
          options={{ format: "png", quality: 0.9 }}
          collapsable={false}
        >
          <ImageBackground
            style={{ width: width + 60, height: height - 60 }}
            source={imgSource}
            resizeMode={"contain"}
          ></ImageBackground>
        </View>
        {this._renderShareButtons()}
        {this._renderModals()}
      </View>
    );
  }

  linkCheck = (link) => {
    return link.includes("https");
  };

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
      "bonus Challenge": this.linkCheck(bonusChallenge)
        ? { uri: bonusChallenge }
        : require("../images/bonuschallenge.png"),
      "Abs + Cardio": this.linkCheck(absCardio)
        ? { uri: absCardio }
        : require("../images/absAndCardioEndscreen.jpg"),
      "Arms + Abs": this.linkCheck(armsAbs)
        ? { uri: armsAbs }
        : require("../images/armsAndAbsEndscreen.jpg"),
      "Full Body": this.linkCheck(fullBody)
        ? { uri: fullBody }
        : require("../images/fullBodyEndscreen.jpg"),
      "Legs + Booty": this.linkCheck(legsBooty)
        ? { uri: legsBooty }
        : require("../images/legsAndBootyEndscreen.jpg"),
      "Self Care": this.linkCheck(selfCare)
        ? { uri: selfCare }
        : require("../images/selfLoveEndscreen.jpg"),
      "Cardio Sweat Sesh":
        day != 4
          ? this.linkCheck(cardioSweatSesh)
            ? { uri: cardioSweatSesh }
            : require("../images/cardioSweatSeshEndscreen.jpg")
          : this.linkCheck(secondaryCardioSweatSesh)
          ? { uri: secondaryCardioSweatSesh }
          : require("../images/cardioSweatSeshEndscreen2.jpg"),
    };

    return img[title];
  };

  _renderShareButtons() {
    const { shareBtnsContainer, buttonText, buttonView } = styles;

    const { lowerButtons } = this.props;

    if (lowerButtons == true) {
      lowerButtonsStyle = { bottom: 0 };
    } else {
      lowerButtonsStyle = {};
    }

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: height * 0.05,
        }}
      >
        <View style={[shareBtnsContainer, lowerButtonsStyle]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[buttonView, { marginRight: 5 }]}
            onPress={this._onShareInspoPress}
            underlayColor={"#ee90af"}
          >
            <Image
              source={require("../images/iconInstagram.png")}
              style={{ marginLeft: 0 }}
            />
            <Text style={buttonText}>SHARE INSPO</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            style={[buttonView, { marginLeft: 5 }]}
            onPress={this._onShareSelfiePress}
            underlayColor={"#ee90af"}
          >
            <Image
              source={require("../images/iconInstagram.png")}
              style={{ marginLeft: 0 }}
            />
            <Text style={buttonText}>SWEATY SELFIE</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={[buttonView, { marginTop: 20 }]}
          onPress={this._savePhoto}
          underlayColor={"#ee90af"}
        >
          {/* <Image
            source={require("../images/iconInstagram.png")}
            style={{ marginLeft: 0 }}
          /> */}
          <Text style={buttonText}>SAVE TO PHONE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderModals() {
    const { showInspoModal, showSelfiModal, mainQuote, showCamera } =
      this.state;
    const { challengeActive } = this.props;
    const { challengeSelfieFrame } = this.props.headerProps;

    return (
      <View>
        <InstagramShareModal
          visible={showInspoModal}
          quote={mainQuote}
          onClose={this._closeInspoModal}
          shareImage={this.state.shareImage}
          onPostSuccessful={() => console.log("post successful")}
        />
        <Selfie
          shareImage={this.state.shareImage}
          onPostSuccessful={() => console.log("post successful")}
          visible={showSelfiModal}
          challengeActive={challengeActive}
          challengeSelfieFrame={challengeSelfieFrame}
          onClose={this._closeSelfieModal}
        />
        <Modal
          visible={showCamera}
          animationType={"slide"}
          onRequestClose={() => ""}
        >
          <Camera
            onPictureTaken={this._onPictureTaken}
            onCancelPress={this._onCancelPress}
          />
        </Modal>
      </View>
    );
  }

  _onCancelPress = () => {
    console.log("cancel");
    this.setState({
      showCamera: false,
    });
  };

  _onPictureTaken = (pictureurl) => {
    this.setState({
      shareImage: pictureurl,
      showCamera: false,
      showSelfiModal: true,
    });
  };

  _onShareInspoPress = () => {
    captureRef(this.snapshot, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => {
        this.setState({
          shareImage: uri,
          showInspoModal: true,
        });
      },
      (error) => alert("Oops, snapshot failed", error)
    );
  };

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

  _savePhoto = () => {
    if (Platform.OS === "android") {
      this._requestStoragePermission().then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this._onSaveToPhone();
        }
      });
    } else {
      this._onSaveToPhone();
    }
  };

  _onSaveToPhone = () => {
    captureRef(this.snapshot, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => {
        CameraRoll.save(uri, "photo")
          .then(() => {
            Alert.alert("Yay", "Your photo has been saved.");
          })
          .catch((err) => Alert.alert("Oops, error in saving", err.toString()));
      },
      (error) => alert("Oops, snapshot failed", error.toString())
    );
  };

  _onShareSelfiePress = () => {
    this.setState({
      showSelfiModal: true,
      // showCamera: true
    });
  };

  _closeInspoModal = () => {
    this.setState({
      showInspoModal: false,
    });
  };

  _closeSelfieModal = () => {
    this.setState({
      showSelfiModal: false,
    });
  };
}

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  titleStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    marginBottom: 0,
    alignSelf: "center",
  },
  mainTitleStyle: {
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 120,
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: "center",
    height: 100,
  },
  subtitleStyle: {
    width: 279,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  mainContent: {
    width: "80%",
    height: 100,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "normal",
    lineHeight: 31,
    letterSpacing: 0,
    textAlign: "center",
    justifyContent: "center",
    color: color.black,
    marginTop: 100,
  },
  maskContent: {
    marginTop: 10,
    width: width,
    height: 414,
    backgroundColor: color.palePink,
    alignItems: "center",
  },
  signatureStyle: {
    width: width,
    height: 200,
    fontFamily: "Northwell",
    fontSize: 40,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 54,
    letterSpacing: 0,
    textAlign: "center",
    justifyContent: "center",
    color: color.hotPink,
    marginTop: 20,
  },
  buttonView: {
    height: 48,
    width: 160,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
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
    width: "70%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginLeft: 0,
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancelButton: {
    width: "31%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 20,
    textDecorationLine: "underline",
  },
  shareBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    // position: "absolute",
    // bottom: height * 0.1,
    // height: 90,
  },
};
