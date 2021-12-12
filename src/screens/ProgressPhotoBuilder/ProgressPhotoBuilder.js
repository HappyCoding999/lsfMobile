import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  Dimensions,
  NativeModules,
  Modal,
  PermissionsAndroid,
  Alert,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { color, colorNew } from "../../modules/styles/theme";
import { subscribeUserToEmailList } from "../../utils";
import firebase from "react-native-firebase";

import { captureRef } from "react-native-view-shot";

import { GradientHeader, GoalViewForHeader } from "../../components/common";

import ProgressPhotos from "../../screens/ProgressPhotos";
import Camera from "../../screens/Camera";
import ShareNew from "react-native-share";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";

import { cancel_round_cross } from "../../images";
import HomeHeader from "../Header/HomeHeader";
import HomeHeaderBack from "../Header/HomeHeaderBack";

const ProdChecker = NativeModules.ProdChecker;

const { height, width } = Dimensions.get("window");

const addPhotoButton = require("./images/add_photo.png");
// var ImagePicker = require('react-native-image-picker');
import { launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "react-native-image-picker";

class ProgressPhotoBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsList: null,
      showCamera: false,
      showGoalView: false,
      showAllPhotos: false,
      showImagePickingModal: false,
      imageFor: null,
      leftImage: "",
      rightImage: "",
      checked: false,
    };
  }

  async componentDidMount() {}

  buttonSelected = async (buttonText) => {
    console.log("buttonText: ", buttonText);
    captureRef(this.refs["snapshot"], {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) =>
        buttonText == "Share On Social Media"
          ? this._send(uri)
          : buttonText == "Send To A Friend"
          ? this._share(uri)
          : this._savePhoto(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  };
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
  _send(uri) {
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
      CameraRoll.save(uri, "photo").then(() => {
        Linking.openURL(
          "instagram://library?OpenInEditor=1&LocalIdentifier=" + uri
        );
      });
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
  //         "instagram://library?OpenInEditor=1&LocalIdentifier=" +
  //           this.state.imageUrl
  //       );
  //     });
  //   }
  // }
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
            .then(() => Alert.alert("Yay!", "Your Photo Has Been Saved"))
            .catch((err) => console.log("err:", err));
        }
      });
    } else {
      CameraRoll.saveToCameraRoll(uri, "photo")
        .then(() => Alert.alert("Yay!", "Your Photo Has Been Saved"))
        .catch((err) => console.log("err:", err));
    }
  }
  renderButton(buttonText) {
    return (
      <View style={styles.planViewContainer}>
        <View style={styles.planView}>
          <TouchableOpacity
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this.buttonSelected(buttonText)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "95%",
                height: "90%",
                margin: 15,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "95%",
                  height: "100%",
                }}
              >
                <Text style={styles.planSubtitle}>{buttonText}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  _closeAllPhotoPressed = () => {
    console.log("_closeAllPhotoPressed");
    this.setState({
      showAllPhotos: false,
    });
  };

  addPhotoSelected = async (isForBefore) => {
    console.log("isForBefore: ", isForBefore);
    this.setState({
      showImagePickingModal: true,
      imageFor: isForBefore,
    });
  };
  hidePhotoSelectionModel = () => {
    console.log("addPhotoFromCameraRole: ");
    this.setState({
      showImagePickingModal: false,
      imageFor: null,
    });
  };
  renderAddPhotoView(text, isForBefore) {
    let image = isForBefore ? this.state.leftImage : this.state.rightImage;

    if (image != "") {
      return (
        <TouchableOpacity
          style={styles.progressPhotoView}
          onPress={() => this.addPhotoSelected(isForBefore)}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            source={{ uri: image }}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.progressPhotoView}
          onPress={() => this.addPhotoSelected(isForBefore)}
        >
          <Image
            style={{ width: "60%", top: 0 }}
            resizeMode="contain"
            source={require("./images/add_photo.png")}
          />
          <Text style={styles.beforeAfterText}>{text}</Text>
        </TouchableOpacity>
      );
    }
  }
  _onCancelPress = () => {
    console.log("cancel");
    this.setState({
      showCamera: false,
    });
  };
  _renderCameraModal() {
    const { showCamera } = this.state;

    return (
      <View>
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
  _onPictureTaken = (pictureurl) => {
    let isForBeforeImage = this.state.imageFor;
    if (isForBeforeImage) {
      this.setState({
        leftImage: pictureurl,
        showCamera: false,
      });
    } else {
      this.setState({
        rightImage: pictureurl,
        showCamera: false,
      });
    }
  };
  addPhotoFromCameraRole = async () => {
    console.log("addPhotoFromCameraRole: ");
    //   this.setState({
    //   showImagePickingModal: false,
    //   showCamera: true,
    // })

    this.setState({
      showImagePickingModal: false,
    });

    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
      } catch (error) {
        return {
          error: "Failed to get the required permissions.",
        };
      }
      const isCameraAuthorized = await PermissionsAndroid.check(
        "android.permission.CAMERA"
      );
      console.log("Vishal : isCameraAuthorized");
      console.log(isCameraAuthorized);
    }

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    const options = {
      title: "Add photo using below options",
      storageOptions: {
        skipBackup: true,
        saveToPhotos: true,
        privateDirectory: true,
        path: "Pictures/myAppPicture/",
      },
      quality: Platform.OS === "ios" ? 0.5 : 0.7,
    };
    setTimeout(() => {
      ImagePicker.showImagePicker(options, (response) => {
        console.log("Response = ", response.uri);

        if (response.didCancel) {
          console.log("User cancelled image picker");
          this.setState({
            loading: false,
          });
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
          this.setState({
            loading: false,
          });
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          let isForBeforeImage = this.state.imageFor;
          if (isForBeforeImage) {
            this.setState({
              leftImage: response.uri,
            });
          } else {
            this.setState({
              rightImage: response.uri,
            });
          }
        }
      });
    }, 500);
  };
  addPhotoFromGallary = () => {
    console.log("addPhotoFromGallary: ");
    this.setState({
      showImagePickingModal: false,
      showAllPhotos: true,
    });
  };
  _renderImagePickingOptionModal() {
    const { showImagePickingModal } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showImagePickingModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            this._onCloseButtonPressed, console.log("Dialogue Closed");
          }}
        >
          <View style={styles.window}>
            <View style={styles.dialogue}>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                Add Progress Photo
              </Text>
              <View
                style={{
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                  height: "60%",
                }}
              >
                <TouchableOpacity onPress={this.addPhotoFromCameraRole}>
                  <View style={styles.button1}>
                    <Text allowFontScaling={false} style={styles.button1Text}>
                      ADD FROM CAMERA ROLL
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.addPhotoFromGallary}>
                  <View style={styles.button1}>
                    <Text allowFontScaling={false} style={styles.button1Text}>
                      ADD FROM PROGRESS GALLERY
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "90%",
                  marginLeft: 50,
                  marginLeft: "20%",
                  flex: 1,
                  top: 20,
                  marginBottom: 0,
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{ width: 20, height: 20 }}
                  onPress={() => this.hidePhotoSelectionModel()}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      top: 0,
                      resizeMode: "contain",
                      marginBottom: 0,
                      tintColor: "#b2b2b2",
                    }}
                    source={cancel_round_cross}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  _navigationLeftButtonPressed() {
    console.log("_navigationLeftButtonPressed");
    this.props.navigation.navigate("Settings", { backToScreen: "Goals" });
  }
  _navigationRightButtonPressed() {
    console.log("_navigationRightButtonPressed");
    let showGoalView = !this.state.showGoalView;
    this.setState({ showGoalView });
  }
  shadowBottom = (elevation) => {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  };
  renderGoalView() {
    const { showGoalView } = this.state;
    console.log("renderGoalView : ");
    const { weekData } = this.props.navigation.state.params.props;
    console.log(weekData);
    console.log(showGoalView);
    if (showGoalView) {
      let weekData = this.props.screenProps.weekData;
      return (
        <View
          style={[
            this.shadowBottom(5),
            {
              width: "100%",
              marginTop: 100,
              position: "absolute",
              backgroundColor: colorNew.lightPink,
              justifyContent: "flex-end",
            },
          ]}
        >
          <GoalViewForHeader {...this.props} completed={weekData} />
        </View>
      );
    } else {
      return null;
    }
  }
  renderHeader() {
    return (
      <View style={[{ width: "100%", height: 100 }]}>
        <HomeHeaderBack
          containerStyle={{ paddingBottom: 10 }}
          onLeftButtonPressed={() => this.props.navigation.pop()}
          onRightPressed={this._navigationLeftButtonPressed.bind(this)}
        />
        {/*<GradientHeader onLeftPress={this._navigationLeftButtonPressed.bind(this)} onRightPress={this._navigationRightButtonPressed.bind(this)}/>*/}
      </View>
    );
  }
  render() {
    return (
      <View style={{ backgroundColor: "#fff", flex: 1, marginTop: 0 }}>
        {this.renderHeader()}
        <View style={{ backgroundColor: "#fff", flex: 1, marginTop: 0 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: width,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                top: 25,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sofia Pro",
                  color: "#000",
                  fontSize: 25,
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "90%",
                }}
              >
                Progress Photo Builder
              </Text>
              <Text
                style={{
                  fontFamily: "Sofia Pro",
                  color: "#000",
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: "center",
                  fontWeight: "300",
                  width: "90%",
                  marginTop: 25,
                  marginBottom: 20,
                }}
              >
                {
                  "Document your progress and milestones!\nCreate a side-by-side and share using\n#TEAMLSF"
                }
              </Text>
            </View>
            <View style={styles.goalViewContainer}>
              <View
                ref="snapshot"
                options={{ format: "png", quality: 0.9 }}
                style={styles.progressMainlView}
              >
                <View style={styles.progressImageView}>
                  <Image
                    style={{ width: "60%", top: 0 }}
                    resizeMode="contain"
                    source={require("./images/goals.png")}
                  />
                </View>
                <View style={styles.progressBeforeAfterView}>
                  {this.renderAddPhotoView("ADD BEFORE\nPHOTO", true)}
                  {this.renderAddPhotoView("ADD PROGRESS\nPHOTO", false)}
                </View>
                <View style={styles.progressLSFView}>
                  <Image
                    style={{ width: "100%", top: 0 }}
                    resizeMode="contain"
                    source={require("./images/logo_white_love_seat_fitness.png")}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              {this.renderButton("Share On Social Media")}
              {this.renderButton("Send To A Friend")}
              {this.renderButton("Save to Camera Roll")}
            </View>
            {this._renderImagePickingOptionModal()}
          </ScrollView>
        </View>
        {this.renderGoalView()}
        <ProgressPhotos
          {...this.props}
          onClose={this._closeAllPhotoPressed}
          onImageSelection={this._onPictureTaken}
          visible={this.state.showAllPhotos}
        />
        {this._renderCameraModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
  mainTitle: {
    width: "100%",
    height: 120,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center",
  },
  primaryText: {
    width: 120,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    color: "#ffffff",
    marginTop: 12,
    marginLeft: 26,
  },
  secondaryText: {
    width: 200,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    color: "#f7f7f7",
    marginLeft: 26,
    marginTop: -2,
  },
  priceText: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff",
  },
  priceText2: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff",
  },
  readyText: {
    width: 146,
    height: 26,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 26,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
  },
  freeWorkoutsText: {
    width: 175,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
    textDecorationLine: "underline",
  },
  legalText: {
    width: "96%",
    height: 200,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black,
  },
  legalText2: {
    width: 300,
    height: 54,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  bubbleSelected: {
    padding: 10,
    marginLeft: 5,
    height: 35,
    top: 10,
    backgroundColor: color.lightPink,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.lightPink,
    borderWidth: 1,
  },
  goalViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  planViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  planSaveText: {
    fontFamily: "Sofia Pro",
    color: colorNew.white,
    fontSize: 16,
    letterSpacing: 0,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 0,
  },
  planTitle: {
    fontFamily: "Sofia Pro",
    color: colorNew.darkPink,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planTitleSelected: {
    fontFamily: "Sofia Pro",
    color: color.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planSubtitleSelected: {
    fontFamily: "Sofia Pro",
    color: color.white,
    fontSize: 18,
    fontWeight: "normal",
    textAlign: "center",
    width: "100%",
  },
  planSubtitle: {
    fontFamily: "Sofia Pro",
    color: colorNew.mediumPink,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
  },
  beforeAfterText: {
    fontFamily: "Sofia Pro",
    color: colorNew.bgGrey,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "300",
    width: "90%",
    marginTop: 25,
  },
  planViewSelected: {
    width: "90%",
    backgroundColor: colorNew.darkPink,
    borderRadius: 100,
  },
  planView: {
    width: "80%",
    backgroundColor: color.white,
    borderRadius: 100,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
  },
  progressMainlView: {
    width: "90%",
    height: width * 0.98,
    backgroundColor: colorNew.lightPink,
    borderRadius: 20,
    borderColor: colorNew.darkPink,
    borderWidth: 2,
  },
  progressImageView: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  progressBeforeAfterView: {
    width: "100%",
    height: "68%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  progressPhotoView: {
    width: "44%",
    borderRadius: 20,
    borderColor: colorNew.bgGrey,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "95%",
    overflow: "hidden",
    backgroundColor: "white",
  },
  modalContainer: {
    flex: 1,
  },
  window: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialogue: {
    width: "90%",
    height: 250,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.2)",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeaderText: {
    width: "90%",
    height: "20%",
    marginTop: 30,
    fontFamily: "SF Pro Text",
    fontSize: 23,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  button1: {
    width: width * 0.65,
    padding: 10,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: color.mediumPink,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center",
  },
  button1Text: {
    width: "90%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.white,
  },
  progressLSFView: {
    width: "100%",
    height: "12%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default ProgressPhotoBuilder;
