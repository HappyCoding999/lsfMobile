import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  Alert,
  Dimensions,
  Platform,
  ImageBackground,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { color, colorNew } from "../../../../modules/styles/theme";
import { LargeButton } from "../../../../components/common";
import { captureRef } from "react-native-view-shot";
import Carousel from "../../../../components/common/Carousel";
import { Pagination } from "react-native-snap-carousel";
import Camera from "../../../Camera";
import firebase from "react-native-firebase";

import { ic_back_white, cancel_round_cross } from "../../../../images";

const { width, height } = Dimensions.get("window");
const SLIDER_WIDTH = width;
const ITEM_WIDTH = (width * 0.5 * 3) / 4; //Math.round(SLIDER_WIDTH * 0.53);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 4) / 4);

const SLIDER_1_FIRST_ITEM = 0;

export default class Selfie extends Component {
  constructor(props) {
    super(props);

    this._postToInstagram = this._postToInstagram.bind(this);
    this._saveToPhone = this._saveToPhone.bind(this);

    this.state = {
      imageUrl: this.props.shareImage,
      frameImage: "",
      shareImage: "",
      showCamera: false,
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      datasource: [],
      entries: [
        {
          title: "Beautiful and dramatic Antelope Canyon",
          subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
          illustration:
            "https://b1.pngbarn.com/png/901/61/steampunk-border-brown-frame-png-clip-art.png",
        },
        {
          title: "Earlier this morning, NYC",
          subtitle: "Lorem ipsum dolor sit amet",
          illustration:
            "https://b1.pngbarn.com/png/172/455/film-borders-frames-kodak-frame-illustration-png-clip-art.png",
        },
        {
          title: "White Pocket Sunset",
          subtitle: "Lorem ipsum dolor sit amet et nuncat ",
          illustration:
            "https://b1.pngbarn.com/png/461/7/polaroid-white-frame-illustration-png-clip-art.png",
        },
      ],
    };
  }
  componentDidMount() {
    //https://lsf-development.firebaseio.com/sweatySelfieImages
    var ref = firebase.database().ref("sweatySelfieImages");
    ref.once("value").then((snapshot) => {
      var arr = snapshot.val();
      console.log(arr);
      console.log(arr[0]);
      this.setState({
        datasource: snapshot.val(),
        frameImage: arr[0].imgUrl,
      });
    });
  }
  renderImage() {
    console.log("check state.imageUrl");
    console.log(this.state.imageUrl);
    console.log(this.state.imageUrl.length);
    const selfieImage =
      this.state.imageUrl.length != 0
        ? { uri: this.state.imageUrl }
        : require("./images/camera_.png");
    console.log(selfieImage);
    const backgroundColor =
      this.state.imageUrl.length != 0 ? "#fff" : "transparent";
    const imageWidth = this.state.imageUrl.length != 0 ? "88%" : "30%";
    const resizeMode_new =
      this.state.imageUrl.length != 0 ? "cover" : "contain";
    return (
      <TouchableOpacity
        style={{ position: "absolute", width: imageWidth, height: imageWidth }}
        onPress={this._onShareSelfiePress}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: backgroundColor,
          }}
          source={selfieImage}
          resizeMode={resizeMode_new}
        />
      </TouchableOpacity>
    );
  }

  renderDotes() {
    const dotes = [];
    const { datasource, slider1ActiveSlide } = this.state;
    console.log("renderDotes selfie");
    const {
      pageDotContainer,
      paginationDot,
      paginationInnerDotActive,
      paginationDotInactive,
    } = styles;
    for (let i = 0; i < datasource.length; i++) {
      dotes.push(
        <View
          style={
            slider1ActiveSlide == i ? paginationDot : paginationDotInactive
          }
        >
          {slider1ActiveSlide == i ? (
            <View style={paginationInnerDotActive} />
          ) : null}
        </View>
      );
    }
    return dotes;
  }

  render() {
    const backgroundColor =
      this.state.imageUrl.length != 0 ? "#fff" : colorNew.bgGrey;

    const { challengeActive, challengeSelfieFrame } = this.props;
    const { slider1ActiveSlide } = this.state;
    // const selfieFrame = (challengeActive)
    // ? { uri: this.state.frameImage }
    // : require("./images/Sweaty_Selfies-01.jpg");
    console.log("render this.state.frameImage");
    console.log(this.state.frameImage);
    const selfieFrame =
      this.state.frameImage != ""
        ? { uri: this.state.frameImage }
        : require("./images/Sweaty_Selfies-01.jpg");

    console.log("this.state.datasource.length");
    console.log(this.state.datasource.length);

    return (
      <View
        style={{
          width: width,
          height: height,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: width,
          }}
        >
          <View
            style={{ justifyContent: "center", width: "100%", marginTop: 24 }}
          >
            <View
              style={{
                position: "absolute",
                height: 40,
                zIndex: 3,
                width: 40,
                marginLeft: "5%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/*<TouchableOpacity onPress={() => this.props.onClose()}>
                <Image style={{ height: '90%',top:0,tintColor:colorNew.darkPink}} resizeMode="contain" source={ic_back_white} />
              </TouchableOpacity>*/}
            </View>
            <View
              style={{
                position: "absolute",
                height: 30,
                zIndex: 0,
                width: 30,
                marginLeft: width * 0.85,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => this.props.onClose()}>
                <Image
                  style={{
                    height: "90%",
                    top: 0,
                    tintColor: colorNew.darkPink,
                  }}
                  resizeMode="contain"
                  source={cancel_round_cross}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={{
              fontFamily: "Sofia Pro",
              color: colorNew.darkPink,
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              marginTop: 25,
              marginBottom: 5,
            }}
          >
            {"Sweaty Selfie".toUpperCase()}
          </Text>
          <View style={styles.container}>
            <View
              ref="snapshot"
              options={{ format: "png", quality: 0.9 }}
              collapsable={false}
              style={{
                width: width * 0.7,
                height: width * 0.7,
                justifyContent: "center",
                alignItems: "center",
                marginTop: width * 0.05,
              }}
            >
              <TouchableOpacity
                style={{ width: "100%", height: "100%" }}
                onPress={this._onShareSelfiePress}
              >
                {this.state.frameImage == "" ? (
                  <View
                    style={{
                      width: width * 0.7,
                      height: width * 0.7,
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      textAlign: "center",
                      backgroundColor: colorNew.bgGrey,
                      borderColor: colorNew.mediumPink,
                      borderWidth: 2,
                      borderRadius: 15,
                    }}
                  >
                    <View
                      style={{
                        width: "97%",
                        height: "97%",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {this.renderImage()}
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      width: width * 0.7,
                      height: width * 0.7,
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        backgroundColor: backgroundColor,
                      }}
                    >
                      {this.renderImage()}
                      <Image
                        style={styles.polaroid}
                        source={selfieFrame}
                        resizeMode="stretch"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: width,
                height: width * 0.52,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                textAlign: "center",
                marginTop: width * 0.1,
              }}
            >
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.datasource}
                renderItem={this._renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                firstItem={SLIDER_1_FIRST_ITEM}
                containerCustomStyle={styles.carouselContainer}
                autoplay={false}
                inactiveSlideScale={0.8}
                layoutCardOffset={25}
                autoplayDelay={1}
                autoplayInterval={3000}
                onSnapToItem={(index) =>
                  this.setState({
                    slider1ActiveSlide: index,
                    frameImage: this.state.datasource[index].imgUrl,
                  })
                }
              />
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.renderDotes()}
              </View>
              {/*<Pagination
                  dotsLength={this.state.entries.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotStyle={styles.paginationDot}
                  inactiveDotStyle={styles.paginationDotInactive}
                  dotColor="#f08fa3"
                  inactiveDotColor="#000"
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />*/}
            </View>
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
                onPress={this._postToInstagram}
                underlayColor={"#ee90af"}
              >
                <Text style={styles.buttonText}>SHARE!</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: width,
                height: width * 0.2,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              <Text
                allowFontScaling={false}
                style={styles.sweatySelfie}
                numberOfLines={2}
              >
                Don't forget to use #TEAMLSF when{"\n"}you share your sweaty
                selfie
              </Text>
            </View>
          </View>
        </ScrollView>
        {this._renderModals()}
      </View>
    );
  }
  _onShareSelfiePress = () => {
    this.setState({
      showCamera: true,
    });
  };
  _onCancelPress = () => {
    console.log("cancel");
    this.setState({
      showCamera: false,
    });
  };

  _onPictureTaken = (pictureurl) => {
    this.setState({
      imageUrl: pictureurl,
      showCamera: false,
    });
  };
  _renderModals() {
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
  onFrameSelection = (frame) => {
    console.log("onFrameSelection called : ", frame);
    this.setState({ frameImage: frame.imgUrl });
  };
  _renderItem = ({ item, index }) => {
    console.log("_renderItem");
    // console.log(item);
    // console.log(item.illustration);
    console.log(item.imgUrl);
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.onFrameSelection(item)}
        >
          <View
            style={
              Platform.OS === "ios"
                ? styles.itemContainer
                : styles.itemContainerAndroid
            }
          >
            <Image
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              source={{ uri: item.imgUrl }}
            />
          </View>
        </TouchableOpacity>
      </View>
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
  _saveToPhone() {
    captureRef(this.refs["snapshot"], {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._savePhoto(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
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
      CameraRoll.save(uri, "photo")
        .then(() => Alert.alert("Yay!", "Your Photo Has Been Saved"))
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
  carouselContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  paginationContainer: {
    paddingVertical: 8,
    paddingBottom: 25,
  },
  paginationDot_old: {
    marginTop: 5,
    marginBottom: 5,
    width: 8,
    height: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colorNew.mediumPink,
    marginHorizontal: 1,
  },
  paginationDotInactive_old: {
    marginTop: 5,
    marginBottom: 5,
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  paginationDot: {
    marginTop: 5,
    marginBottom: 5,
    width: 12,
    height: 12,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colorNew.mediumPink,
    marginHorizontal: 1,
  },
  paginationInnerDotActive: {
    width: 7,
    height: 7,
    backgroundColor: colorNew.mediumPink,
    borderWidth: 0,
    borderRadius: 6,
  },
  paginationDotInactive: {
    marginTop: 5,
    marginBottom: 5,
    width: 6,
    height: 6,
    backgroundColor: colorNew.boxGrey,
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  pageDotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  itemContainerAndroid: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorNew.bgGrey,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
    backgroundColor: "transparent",
  },
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
  sweatySelfie: {
    width: width,
    height: 50,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
    paddingTop: 10,
    justifyContent: "center",
  },
  polaroid: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  btnView: {
    marginTop: Platform.OS === "ios" ? 65 : 28,
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
  shareBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: width,
    marginTop: 20,
    height: 50,
  },
  buttonView: {
    height: width * 0.1,
    width: width / 2.4,
    borderRadius: 100,
    backgroundColor: colorNew.darkPink,
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
    width: "80%",
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
});
