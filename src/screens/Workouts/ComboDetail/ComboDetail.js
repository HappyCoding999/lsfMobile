import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  FlatList,
  Modal,
  Alert,
  Linking,
} from "react-native";
import Video from "react-native-video";
import { EventRegister } from "react-native-event-listeners";
import { color, colorNew } from "../../../modules/styles/theme";
import {
  LargeButton,
  MediumButton,
  ConnectedMusicButtonsWhite,
  LargeGradientButton,
} from "../../../components/common";
import LinearGradient from "react-native-linear-gradient";
import Carousel from "../../../components/common/Carousel";
import { Pagination } from "react-native-snap-carousel";
import YourSweatMustHave from "./YourSweatMustHave";
import { AnimatedCheckmark } from "../../../components/common/AnimatedComponents";
import LottieView from "lottie-react-native";
import bottleFillingUp from "../../../animations/bottleFillingUp.json";
import checkMarkAnimation from "../../../animations/CheckMarkAnimation.json";
import {
  day_check_roundec,
  grey_bg_check_mark,
  cancel_round_cross,
} from "../../../images";
import { ArrowShopNow } from "../../../components/common/AnimatedComponents";
import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import closeButton from "./images/iconCircleclose.png";

const { height, width } = Dimensions.get("window");
const itemRatio = 125 / 160;
const cardContainerHeight = width * 0.87;
const SLIDER_WIDTH = width;
const ITEM_WIDTH = (height * 0.45 * 2.6) / 4; //Math.round(SLIDER_WIDTH * 0.53);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 4) / 3);
const SLIDER_1_FIRST_ITEM = 0;

const GEAR_ITEM_WIDTH = Math.round(width * 0.72);
const GEAR_ITEM_HEIGHT = (width * 1.5) / 5;

export default class extends Component {
  state = {
    showVideos: false,
    selectTodayMove: false,
    selectTodayCardio: false,
    showLogTimeModal: false,
    videoUrl: "",
    thumbnailUrl: "",
    videoName: "",
    videoDescription: "",
    hoursSelected: 0,
    minuteSelected: 0,
    hoursList: [],
    minutesList: [],
    videoList: [],
    shopList: [],
    currentShopItem: null,
    showShopItem: false,
    gearList: [
      "LSF Booty Bands",
      "Workout Mat",
      "Dumbbells",
      "LSF Booty Bands",
      "Workout Mat",
      "Dumbbells",
      "LSF Booty Bands",
      "Workout Mat",
      "Dumbbells",
    ],
    entries: [
      {
        title: "Beautiful and dramatic Antelope Canyon",
        subtitle: "Lorem ipsum dolor sit amet et nuncat mergitur",
        illustration: "https://i.imgur.com/UYiroysl.jpg",
      },
      {
        title: "Earlier this morning, NYC",
        subtitle: "Lorem ipsum dolor sit amet",
        illustration: "https://i.imgur.com/UPrs1EWl.jpg",
      },
    ],
    cardioEntries: [
      {
        thumbnailUrl:
          "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhbhfullbody.jpg?alt=media&token=29a854cf-56f3-40d5-843a-1694206c384d",
        category: "Workouts",
        videoDescription:
          "Strengthen, tone, & burn crazy calories in just 20 minutes",
        videoName: "20 Minute Hot Body HIIT - Full Body Burn",
        subcategory: "HIIT Workouts",
        videoUrl:
          "https://lsfvideolibrary.s3-us-west-1.amazonaws.com/20minhbhfullbody/playlist.m3u8",
      },
      {
        thumbnailUrl:
          "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhittabsarms.jpg?alt=media&token=cbdc0488-3010-4601-9ab8-2a2334476d23",
        category: "Workouts",
        videoDescription:
          "Sculpt & shape your arms and abs while burning serious calories",
        videoName: "20 Minute Hot Body HIIT - Arms & Abs",
        subcategory: "HIIT Workouts",
        videoUrl:
          "https://lsfvideolibrary.s3-us-west-1.amazonaws.com/20minhbharmsabs/playlist.m3u8",
      },
    ],
  };
  componentDidMount() {
    this._didFocus = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        this.setState({ showVideos: true });
      }
    );
    if (this.state.videoList.length === 0) {
      this._retrieveVideoData();
      // let ref = firebase.database().ref("featuredCategoryVideos");
      // ref.set({0:{imageUrl:"1"}});
    }

    this._retrieveShopItemData();
    var minutes = [];
    var hours = [];

    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        hours.push({ value: i });
      }
      minutes.push({ value: i });
    }
    this.setState({
      hoursList: hours,
      minutesList: minutes,
    });
  }

  _retrieveShopItemData = async () => {
    let ref = firebase.database().ref("shopItems");
    ref.once("value").then((snapshot) => {
      this.setState({
        shopList: snapshot.val(),
      });
    });
  };

  _retrieveVideoData = async () => {
    console.log("_retrieveVideoData");
    const { secondaryType } = this.props;
    let category = secondaryType.replace("Cardio", "Workouts");

    let ref = firebase.database().ref("videos");
    let title = "";
    ref
      .orderByChild("subcategory")
      .limitToFirst(20)
      .equalTo(category)
      .once("value")
      .then((snapshot) => {
        const fbObject = snapshot.val();
        const newArr = Object.values(fbObject);
        const shuffled = newArr.sort(() => 0.5 - Math.random());

        // var randVideo1 = newArr[Math.floor(Math.random() * newArr.length)];
        // var randVideo2 = newArr[Math.floor(Math.random() * newArr.length)];
        // var randVideo3 = newArr[Math.floor(Math.random() * newArr.length)];
        // var randVideo4 = newArr[Math.floor(Math.random() * newArr.length)];

        // var newArr1 = new Array();

        // newArr1.push(randVideo1);
        // newArr1.push(randVideo2);
        // newArr1.push(randVideo3);
        // newArr1.push(randVideo4);

        let newArr1 = shuffled.slice(0, 4);
        console.log("Check 3");

        this.setState({
          videoList: newArr1.reverse(),
        });
      });
  };

  componentWillUnmount() {
    this._didFocus.remove();
  }
  _rendeYourSweatMustHave() {
    return <YourSweatMustHave />;
  }
  _renderGears() {
    return (
      <View
        style={{
          width: "100%",
          height: GEAR_ITEM_HEIGHT + 40,
          marginBottom: 65,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 40,
          paddingHorizontal: 20,
          backgroundColor: "#fff",
          marginBottom: height > 736 ? 90 : 50,
        }}
      >
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: 20,
                height: "100%",
                backgroundColor: "transparent",
              }}
            />
          )}
          style={{ width: "100%", backgroundColor: "#fff", padding: 0 }}
          data={this.state.shopList}
          renderItem={this._renderGearItems}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
  _renderGearItems = ({ item }) => {
    console.log("_renderGearItems called");
    return (
      <TouchableOpacity
        style={{ fleX: 1, justifyContent: "center", alignItems: "center" }}
        onPress={() => this._shopItemClicked(item)}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "column",
            justifyContent: "center",
            width: GEAR_ITEM_HEIGHT,
          }}
        >
          <View
            style={{
              width: GEAR_ITEM_HEIGHT,
              height: GEAR_ITEM_HEIGHT,
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: colorNew.boxGrey,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <ImageBackground
              style={[
                {
                  width: "100%",
                  height: "100%",
                  backgroundColor: colorNew.boxGrey,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              source={{ uri: item.imgUrl }}
            ></ImageBackground>
          </View>
          <Text
            style={[
              styles.gearTitleText,
              {
                color: "#000",
                fontSize: 10,
                fontWeight: "700",
                textAlign: "left",
                paddingLeft: 5,
              },
            ]}
          >
            {item.title.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  _renderShopItemModal() {
    const { showShopItem, currentShopItem } = this.state;
    const containerWidth = width * 0.75;
    const innerContainerWidth = containerWidth;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (!this.state.showShopItem) return null;

    let uri;

    if (currentShopItem != undefined && currentShopItem != null) {
      uri = { uri: currentShopItem.imgUrl };
    } else {
      uri = { uri: null };
    }
    return (
      <View
        style={{
          ...styles.modalContainerShop,
          position: "absolute",
          marginTop: -20,
          overflow: "hidden",
        }}
      >
        <View style={{ ...styles.windowShop, overflow: "hidden" }}>
          <View
            style={{
              ...styles.dialogueShop,
              height: 510,
              overflow: "hidden",
              borderRadius: 10,
              width: "75%",
            }}
          >
            <View
              style={{
                width: innerContainerWidth,
                height: innerContainerWidth,
                marginTop: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.lightGrey,
                overflow: "hidden",
              }}
            >
              <ImageBackground
                imageStyle={{ resizeMode: "cover" }}
                style={{
                  width: innerContainerWidth,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 0,
                }}
                source={uri}
              ></ImageBackground>
            </View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={{
                ...styles.modalHeaderText,
                color: "#000",
                fontWeight: "bold",
                marginTop: 20,
                marginBottom: 0,
                fontSize: 25,
                lineHeight: 30,
                height: 30,
                marginRight: 5,
                marginLeft: 5,
              }}
            >
              {currentShopItem.title}
            </Text>
            <Text
              numberOfLines={3}
              allowFontScaling={false}
              style={{
                ...styles.shopItemHeaderText,
                color: "#b2b2b2",
                fontWeight: "normal",
                marginTop: 20,
                marginBottom: 5,
                fontSize: 10,
                lineHeight: 18,
                marginRight: 10,
                marginLeft: 10,
              }}
            >
              {currentShopItem.description}
            </Text>
            <View
              style={{
                width: containerWidth,
                height: 40,
                marginLeft: 15,
                marginTop: 0,
                justifyContent: "center",
                alignItems: "flex-start",
                position: "absolute",
              }}
            >
              <View
                style={{
                  width: "100%",
                  marginRight: 16,
                  flex: 1,
                  top: 0,
                  marginBottom: 0,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 35,
                    height: 35,
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.hideShopItemModal()}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      top: 0,
                      resizeMode: "contain",
                      marginBottom: 0,
                      tintColor: "#000",
                    }}
                    source={cancel_round_cross}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: "85%",
                height: 45,
                marginTop: 20,
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0,
                backgroundColor: colorNew.mediumPink,
                borderColor: colorNew.mediumPink,
                borderRadius: 30,
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={colors}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 30,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => Linking.openURL(currentShopItem.shopItemUrl)}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.modelButtonText,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#fff",
                      marginTop: 10,
                      height: 30,
                      marginRight: 5,
                      marginLeft: 10,
                    }}
                  >
                    Shop now
                  </Text>
                  <View
                    style={{
                      width: 50,
                      height: 45,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowShopNow
                      animatedView={{
                        width: 50,
                        height: 45,
                        top: 0,
                        margin: 0,
                      }}
                    />
                    {/*<Image style={{width: 12,height:11,resizeMode: 'contain'}} source={icon_shop_now_arrow} />*/}
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
    );
  }
  hideShopItemModal() {
    console.log("hideSweatStarterModal");
    this.setState({
      showShopItem: false,
      currentShopItem: null,
    });
  }
  _shopItemClicked(item) {
    console.log("_essentialClicked");
    this.setState({
      showShopItem: true,
      currentShopItem: item,
    });
  }
  selectTodaysAbsMove() {
    console.log("selectTodaysAbsMove");
    this.setState({ selectTodayMove: true });
  }
  selectTodaysCardio() {
    console.log("selectTodaysCardio");
    this.setState({ selectTodayCardio: true });
  }
  renderAnimatedView() {
    console.log("Vishal - renderAnimatedView called");
    // if (this.props.workout.isCompleted) {
    if (this.state.selectTodayMove) {
      return (
        <AnimatedCheckmark
          animatedView={{ height: "100%", top: 0, margin: 0, width: 40 }}
        />
      );
    } else {
      AsyncStorage.getItem("absOrCardioComplete", (err, result) => {
        console.log(err);
        console.log(result);
        if (result == null) {
        } else {
          if (result == "abs" && this.state.selectTodayMove == false) {
            this.setState({
              selectTodayMove: true,
            });
          } else if (
            result == "cardio" &&
            this.state.selectTodayCardio == false
          ) {
            this.setState({
              selectTodayCardio: true,
            });
          }
        }
      });
      return (
        <TouchableOpacity onPress={this.selectTodaysAbsMove.bind(this)}>
          <Image
            source={grey_bg_check_mark}
            resizeMode="cover"
            style={{ width: 17, height: 17, marginTop: 5 }}
          />
        </TouchableOpacity>
      );
    }
  }
  renderAnimatedView1() {
    console.log("Vishal - renderAnimatedView1 called");
    if (this.state.selectTodayCardio) {
      return (
        <AnimatedCheckmark
          animatedView={{ height: "100%", top: 0, margin: 0, width: 40 }}
        />
      );
    } else {
      return (
        <TouchableOpacity onPress={this.selectTodaysCardio.bind(this)}>
          <Image
            source={grey_bg_check_mark}
            resizeMode="cover"
            style={{ width: 17, height: 17, marginTop: 5 }}
          />
        </TouchableOpacity>
      );
    }
  }
  renderCardioButtons() {
    console.log("renderCardioButtons called");
    const {
      onSweatSoloPress,
      onVideoLibraryPress,
      onCompletionPress,
      onSkipPress,
      onOutsideWorkoutPress,
    } = this.props;
    const { mainTitle, circuitName, rounds } = this.props;
    const { btnStyle, subTitleNew } = styles;
    const colors = [colorNew.cardioBG, colorNew.cardioBG];
    const colors1 = [color.mediumPink, colorNew.lightPink];
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={colors}
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 60,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "70%",
              height: 60,
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              allowFontScaling={false}
              style={{ ...subTitleNew, color: "#000" }}
            >
              Today's Cardio
            </Text>
            <View
              style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              {this.renderAnimatedView1()}
            </View>
          </View>
          <View
            style={{
              width: "20%",
              height: 60,
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, justifyContent: "space-around" }}
              activeOpacity={0.9}
              onPress={() =>
                EventRegister.emit("paywallEvent", onVideoLibraryPress)
              }
            >
              <Text
                allowFontScaling={false}
                style={{
                  ...subTitleNew,
                  fontSize: 12,
                  fontWeight: "400",
                  color: "#000",
                }}
              >
                SEE MORE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10, flex: 1 }}>
          <FlatList
            numColumns={2}
            data={this.state.videoList}
            renderItem={this.renderGridItem}
            contentContainerStyle={styles.gridcontainer}
            keyExtractor={(item, index) => item + index}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <LargeButton
            buttonViewStyle={{ backgroundColor: colorNew.cardioButtonBG }}
            onPress={() => EventRegister.emit("paywallEvent", onSweatSoloPress)}
          >
            <Text>Cardio Timer</Text>
          </LargeButton>
        </View>
        <View style={{ marginTop: 22 }}>
          <LargeButton
            onPress={() =>
              EventRegister.emit("paywallEvent", onOutsideWorkoutPress)
            }
          >
            <Text>Outside Workout</Text>
          </LargeButton>
        </View>
        <View style={{ marginTop: 22, marginBottom: 22 }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={colors1}
            style={styles.linearGradient}
          >
            <TouchableOpacity
              onPress={() =>
                EventRegister.emit(
                  "paywallEvent",
                  this.addDataForItem.bind(this)
                )
              }
              style={styles.logButton}
            >
              <View>
                <Text allowFontScaling={false} style={styles.whiteButtonText}>
                  Log Cardio
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  onButtonPressed = (item) => {
    console.log("onButtonPressed", item);
    const { videoUrl, thumbnailUrl, videoName, videoDescription, duration } =
      item;
    this.setState(
      { videoUrl, thumbnailUrl, videoName, videoDescription, duration },
      () => {
        this.props.openVideoModal(
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
          duration
        );
      }
    );
  };

  renderGridItem = ({ item }) => {
    let itemWidth = (width * 0.95 - 42) / 2;
    return (
      <View
        style={{
          backgroundColor: "gridcontainer",
          width: (width * 0.95) / 2,
          height: itemWidth * 1.1 + 30,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "space-around", padding: 10 }}
          activeOpacity={0.9}
          onPress={() =>
            EventRegister.emit("paywallEvent", () => this.onButtonPressed(item))
          }
        >
          <View
            style={{
              width: itemWidth,
              backgroundColor: "#ddd",
              height: itemWidth * itemRatio,
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{ uri: item.thumbnailUrl }}
              resizeMode="cover"
            />
          </View>
          <Text
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.7}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.gridText}
          >
            {item.videoName}
          </Text>
          <Text
            allowFontScaling={false}
            adjustsFontSizeToFit={false}
            minimumFontScale={0.7}
            numberOfLines={2}
            ellipsizeMode={"tail"}
            style={styles.subTitleTextPink}
          >
            {item.duration} min
            <Text
              allowFontScaling={false}
              adjustsFontSizeToFit={false}
              minimumFontScale={0.7}
              numberOfLines={2}
              ellipsizeMode={"tail"}
              style={styles.subTitleText}
            >
              {" "}
              | {item.videoDescription}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  addDataForItem() {
    this.setState({
      showLogTimeModal: true,
    });
  }
  hideLogTimeModal() {
    console.log("hideLogTimeModal");
    if (this.state.hoursSelected == 0 && this.state.minuteSelected == 0) {
      Alert.alert(
        "",
        "Please select the time you spent to complete this workout."
      );
      return;
    }

    var timeString = "";
    if (this.state.hoursSelected > 0 && this.state.minuteSelected > 0) {
      timeString =
        this.state.hoursSelected +
        (this.state.hoursSelected > 1 ? " Hours " : " Hour ") +
        this.state.minuteSelected +
        " Minutes";
    } else if (this.state.hoursSelected > 0 && this.state.minuteSelected == 0) {
      timeString =
        this.state.hoursSelected +
        (this.state.hoursSelected > 1 ? " Hours" : " Hour");
    } else if (this.state.hoursSelected == 0 && this.state.minuteSelected > 0) {
      timeString = this.state.minuteSelected + " Minutes";
    }
    this.setState({
      showLogTimeModal: false,
    });
    setTimeout(() => {
      this.props.onCompletionPress(timeString);
    }, 500);
  }
  _renderLogTimeModal() {
    const { showLogTimeModal } = this.state;
    const { time, weight, distance } = this.state;
    if (!this.state.showLogTimeModal) return null;
    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showLogTimeModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            this.hideInfo, console.log("Dialogue Closed");
          }}
        >
          <View style={styles.window}>
            <View style={styles.dialogue}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    height: 10,
                    zIndex: 0,
                    width: 30,
                    marginRight: 20,
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                ></View>
              </View>

              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                GREAT JOB!
              </Text>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                How long was your workout?
              </Text>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  marginRight: "10%",
                }}
              >
                <Text allowFontScaling={false} style={styles.lableText}>
                  Time:{" "}
                </Text>
                <View
                  style={{
                    ...styles.sectionStyle,
                    marginTop: -20,
                    margin: 2,
                    width: width * 0.15,
                    borderBottomColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <Dropdown
                    label=""
                    containerStyle={{ width: 45 }}
                    onChangeText={(value, index, data) => {
                      this.setState({ hoursSelected: value });
                    }}
                    value={this.state.hoursSelected}
                    data={this.state.hoursList}
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={{ ...styles.lableText, marginLeft: "1%" }}
                >
                  hours
                </Text>
                <View
                  style={{
                    ...styles.sectionStyle,
                    marginTop: -20,
                    margin: 2,
                    width: width * 0.15,
                    borderBottomColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <Dropdown
                    label=""
                    containerStyle={{ width: 45 }}
                    onChangeText={(value, index, data) => {
                      this.setState({ minuteSelected: value });
                    }}
                    value={this.state.minuteSelected}
                    data={this.state.minutesList}
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={{ ...styles.lableText, marginLeft: "1%" }}
                >
                  minutes
                </Text>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity onPress={this.hideLogTimeModal.bind(this)}>
                  <Text allowFontScaling={false} style={styles.button1Text}>
                    COMPLETE
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({
                    showLogTimeModal: false,
                  });
                }}
                style={{ position: "absolute", right: 20, top: 20 }}
              >
                <Image source={closeButton} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  render() {
    console.log("render in Combodetail called");
    const { mainTitle, circuitName, rounds } = this.props;
    const { btnStyle, subTitleNew } = styles;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    const { videoUrl, thumbnailUrl, videoName, videoDescription, duration } =
      this.state;
    console.log("render called in Combodetail");
    return (
      <View style={{ width: width, height: height }}>
        <ScrollView
          style={{ backgroundColor: "#fff" }}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          {this._renderHeader()}
          <View style={styles.container}>
            <View
              style={{
                width: "100%",
                height: 60,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text
                allowFontScaling={false}
                style={{ ...subTitleNew, color: "#000" }}
              >
                Today's Abs Moves
              </Text>
              <View
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                {this.renderAnimatedView()}
              </View>
            </View>
            {this._renderExcerciseDetail()}
            <LargeGradientButton
              onPress={() =>
                EventRegister.emit("paywallEvent", this._onLargeButtonPressed)
              }
              containerStyle={{ btnStyle, marginTop: 2 }}
            >
              Start My Workout
            </LargeGradientButton>
            {this._renderVideoBtn()}
            {this.renderCardioButtons()}
            <View style={{ width: "100%", marginTop: 50 }}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={colors}
                style={{
                  flex: 1,
                  width: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text allowFontScaling={false} style={subTitleNew}>
                    Choose Your Music
                  </Text>
                </View>
                {this._renderMusicButtons()}
                <View style={{ width: "100%", height: 20 }} />
              </LinearGradient>
            </View>
            <Text
              allowFontScaling={false}
              style={{ ...subTitleNew, marginLeft: 0, color: "#000" }}
            >
              {"What You'll Need"}
            </Text>
            {this._renderGears()}
            {this._renderLogTimeModal()}
            {this.props.renderVideoModal(
              videoUrl,
              thumbnailUrl,
              videoName,
              videoDescription,
              duration
            )}
          </View>
        </ScrollView>
        {this._renderShopItemModal()}
      </View>
    );
  }
  _onLargeButtonPressed = () => {
    const { onLargeBtnPressed } = this.props;
    onLargeBtnPressed();
  };
  renderOld() {
    return (
      <ScrollView style={{ backgroundColor: "#fff" }} horizontal={false}>
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.mainTitle}>
            {mainTitle}
          </Text>
          <Image style={{ marginTop: 5 }} source={require("./images/1.png")} />
          <Text allowFontScaling={false} style={styles.circuitName}>
            {circuitName ? circuitName.toUpperCase() : ""}
          </Text>
          <Text allowFontScaling={false} style={styles.circuitName}>
            Complete {rounds} rounds of moves below
          </Text>
          {this._renderVideoGrid()}
          {this._renderButtons()}
        </View>
      </ScrollView>
    );
  }
  _renderVideoBtn() {
    console.log("_renderVideoBtn called");
    const { onVideoLibraryPress } = this.props;
    const { btnStyle } = styles;
    // if (onVideoBtnPressed) {
    return (
      <LargeButton
        buttonViewStyle={{ backgroundColor: colorNew.cardioButtonBG }}
        onPress={() => EventRegister.emit("paywallEvent", onVideoLibraryPress)}
        containerStyle={{ ...btnStyle, marginTop: 2 }}
      >
        Choose Video Instead
      </LargeButton>
    );
    // }

    // return null;
  }
  _renderItem = ({ item, index }) => {
    const { workoutTitle, time, level } = this.props;
    const {
      excerciseDetailContainer,
      title,
      info,
      rowContainer,
      cardExcerciseTitle,
    } = styles;
    return (
      <View style={styles.mainContainer}>
        <View
          style={[
            Platform.OS === "ios"
              ? styles.itemContainer
              : styles.itemContainerAndroid,
            {
              padding: index != 0 ? 10 : 0,
              backgroundColor:
                index != 0 ? colorNew.cardBGPink : colorNew.bgGrey,
            },
          ]}
        >
          {
            /*index == 0 ? <Text style={{...cardExcerciseTitle}}>{workoutTitle}</Text> : this.renderDetailForCircuit(index)*/
            index == 0
              ? this.renderFirstSlide(index)
              : this.renderDetailForCircuit(index)
          }
        </View>
      </View>
    );
  };
  renderFirstSlide = (index) => {
    const { workoutTitle, workoutImage } = this.props;
    const {
      excerciseDetailContainer,
      title,
      info,
      rowContainer,
      cardExcerciseTitle,
      cardCircuitHeader,
      cardCircuitTitle,
      cardCircuitTitlePink,
    } = styles;

    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 10,
        }}
      >
        <ImageBackground
          style={[
            {
              width: "100%",
              height: "100%",
              backgroundColor: colorNew.bgGrey,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          source={{ uri: workoutImage }}
        >
          <Text style={{ ...cardExcerciseTitle }}>{workoutTitle}</Text>
        </ImageBackground>
      </View>
    );
  };
  renderTextForCircuit(data) {
    const text = [];
    const { cardCircuitTitlePink } = styles;
    for (let i = 0; i < data.length; i++) {
      let newData = data[i];
      // Try avoiding the use of index as a key, it has to be unique!
      text.push(<Text style={cardCircuitTitlePink}>{newData.exercise}</Text>);
    }
    return text;
  }
  renderDetailForCircuit = (index) => {
    const { workoutTitle, time, level, primaryTag, secondaryTag } = this.props;

    var weekData = [];
    if (index == 1) {
      weekData = primaryTag;
    } else if (index == 2) {
      weekData = secondaryTag;
    }

    const {
      excerciseDetailContainer,
      title,
      info,
      rowContainer,
      cardExcerciseTitle,
      cardCircuitHeader,
      cardCircuitTitle,
      cardCircuitTitlePink,
    } = styles;
    return (
      <View
        style={{
          width: "80%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ width: "100%", height: "100%" }}>
          <ScrollView
            contentContainerStyle={{
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Text style={cardCircuitHeader}>Workout{"\n"}Overview</Text>
            <View style={{ width: "100%", marginTop: 20 }}>
              <Text style={cardCircuitTitle}>CIRCUIT {index}</Text>
            </View>
            <View style={{ width: "100%", marginTop: 20 }}>
              {weekData != undefined && weekData.length > 0
                ? this.renderTextForCircuit(weekData)
                : null}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  _renderExcerciseDetail() {
    const { excerciseDetailContainer, title, info, rowContainer } = styles;
    const { workoutTitle, time, level } = this.props;
    const infoText = time === "none" ? level : `Approx ${time} | ${level}`;

    return (
      <View style={excerciseDetailContainer}>
        <View
          style={{
            width: "100%",
            height: cardContainerHeight,
            backgroundColor: "#fff",
            marginTop: 20,
          }}
        >
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            data={this.state.entries}
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
              this.setState({ slider1ActiveSlide: index })
            }
          />
          <Pagination
            dotsLength={this.state.entries.length}
            activeDotIndex={this.state.slider1ActiveSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.paginationDotInactive}
            dotColor="#f08fa3"
            inactiveDotColor="#000"
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this._slider1Ref}
            tappableDots={!!this._slider1Ref}
          />
        </View>
      </View>
    );
  }
  _renderHeader() {
    const { headerContainer, title, info, rowContainer } = styles;
    const { workoutTitle, time, level, mainTitle } = this.props;
    const infoText = time === "none" ? level : `Approx ${time} | ${level}`;

    return (
      <View style={headerContainer}>
        <View style={{ ...rowContainer, width: "100%", marginTop: 60 }}>
          <Text allowFontScaling={false} style={title}>
            {mainTitle}
          </Text>
        </View>
        <View style={{ ...rowContainer, width: "100%", marginBottom: 10 }}>
          <Text allowFontScaling={false} style={info}>
            {infoText}
          </Text>
        </View>
      </View>
    );
  }
  _renderVideoGrid() {
    const { exercises } = this.props;

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-around",
          width: "100%",
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <View style={styles.workoutContainer}>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  bottom: 0,
                  left: -10,
                  overflow: "hidden",
                }}
              >
                {this.state.showVideos ? (
                  <Video
                    style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                    source={{ uri: exercises[0].videoUrl }}
                    repeat={true}
                    resizeMode="cover"
                  />
                ) : null}
              </View>
            </View>
            <Text
              allowFontScaling={false}
              numberOfLines={3}
              style={styles.workoutText}
            >
              {exercises[0].exercise}
              {"\n"}
              {exercises[3].reps}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <View style={styles.workoutContainer}>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  bottom: 0,
                  left: -10,
                  overflow: "hidden",
                }}
              >
                {this.state.showVideos ? (
                  <Video
                    style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                    source={{ uri: exercises[1].videoUrl }}
                    repeat={true}
                    resizeMode="cover"
                  />
                ) : null}
              </View>
            </View>
            <Text allowFontScaling={false} style={styles.workoutText}>
              {exercises[1].exercise}
              {"\n"}
              {exercises[3].reps}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 25,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <View style={styles.workoutContainer}>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  bottom: 0,
                  left: -10,
                  overflow: "hidden",
                }}
              >
                {this.state.showVideos ? (
                  <Video
                    style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                    source={{ uri: exercises[2].videoUrl }}
                    repeat={true}
                    resizeMode="cover"
                  />
                ) : null}
              </View>
            </View>
            <Text allowFontScaling={false} style={styles.workoutText}>
              {exercises[2].exercise}
              {"\n"}
              {exercises[3].reps}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <View style={styles.workoutContainer}>
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  bottom: 0,
                  left: -10,
                  overflow: "hidden",
                }}
              >
                {this.state.showVideos ? (
                  <Video
                    style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                    source={{ uri: exercises[3].videoUrl }}
                    repeat={true}
                    resizeMode="cover"
                  />
                ) : null}
              </View>
            </View>
            <Text allowFontScaling={false} style={styles.workoutText}>
              {exercises[3].exercise}
              {"\n"}
              {exercises[3].reps}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  _renderButtons() {
    const { onSweatSoloPress, onCompletionPress, onVideoLibraryPress } =
      this.props;

    return (
      <View
        style={{
          flexDirection: "column",
          marginTop: 10,
          width: "100%",
          height: height,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text style={styles.instructions}>SWIPE UP TO CONTINUE</Text>
        <Image style={{ marginTop: 60 }} source={require("./images/2.png")} />
        <Text allowFontScaling={false} style={styles.circuitName}>
          +{this.props.time ? this.props.time.toUpperCase() : "30 MINUTES"}{" "}
          {this.props.secondaryType
            ? this.props.secondaryType.toUpperCase()
            : ""}
        </Text>
        {this._renderMusicButtons()}
        <View style={{ width: 315, margin: 10 }}>
          <TouchableHighlight
            style={styles.buttonView}
            onPress={() => EventRegister.emit("paywallEvent", onSweatSoloPress)}
            underlayColor={"#ee90af"}
          >
            <Text allowFontScaling={false} style={styles.buttonText}>
              SWEAT SOLO
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{ width: 315, margin: 10 }}>
          <TouchableHighlight
            style={styles.buttonView}
            onPress={onVideoLibraryPress}
            underlayColor={"#ee90af"}
          >
            <Text allowFontScaling={false} style={styles.buttonText}>
              CHOOSE VIDEO
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{ width: 315, margin: 10 }}>
          <TouchableOpacity
            onPress={() =>
              EventRegister.emit("paywallEvent", onCompletionPress)
            }
            style={styles.completeButton}
          >
            <View>
              <Text allowFontScaling={false} style={styles.smallButtonText}>
                COMPLETE WORKOUT
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this._renderSkipBtn()}
      </View>
    );
  }

  _renderSkipBtn() {
    const { onSkipPress } = this.props;
    if (onSkipPress) {
      return (
        <View style={{ width: 315, marginTop: 60 }}>
          <TouchableOpacity
            onPress={() => EventRegister.emit("paywallEvent", onSkipPress)}
            style={styles.completeButton}
          >
            <View>
              <Text allowFontScaling={false} style={styles.smallButtonText}>
                SKIP WORKOUT
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  _renderMusicButtons() {
    return <ConnectedMusicButtonsWhite />;
  }
}

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  gridText: {
    width: "96%",
    height: 16,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 16,
    paddingLeft: 5,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000",
    marginTop: 10,
  },
  subTitleText: {
    width: "96%",
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    paddingLeft: 5,
    textAlign: "left",
    color: "#000",
    marginTop: 2,
  },
  subTitleTextPink: {
    width: "96%",
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontStyle: "normal",
    lineHeight: 15,
    paddingLeft: 5,
    letterSpacing: 0,
    textAlign: "left",
    color: colorNew.darkPink,
    marginTop: 2,
  },
  gridcontainer: {
    width: width,
    marginTop: 2,
    backgroundColor: "transparent",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  logButton: {
    width: width * 0.7,
    height: 48,
    borderRadius: 100,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    width: width * 0.8,
    height: 48,
    borderRadius: 100,
    backgroundColor: "color.mediumPink",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
    paddingRight: 12,
    margin: 0,
  },
  btnStyle: {
    marginTop: 20,
  },
  subTitle: {
    width: "100%",
    height: 34,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    marginLeft: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
    marginTop: 5,
    marginBottom: 5,
  },
  tinyButtonText: {
    width: 105,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1.5,
    textAlign: "center",
    color: "#fff",
  },
  completeButton: {
    width: 150,
    height: 48,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  gearTitleText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 10,
  },
  itemContainerAndroid: {
    width: ITEM_WIDTH - 10,
    height: ITEM_HEIGHT - 20,
    marginTop: -20,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorNew.bgGrey,
  },
  itemContainer: {
    width: ITEM_WIDTH - 10,
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
    backgroundColor: colorNew.bgGrey,
  },
  cardExcerciseTitle: {
    width: "90%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    position: "absolute",
    bottom: 30,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
  },
  info: {
    width: width,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
  },
  mainContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    width: "100%",
    height: 28,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 10,
  },
  excerciseDetailContainer: {
    marginTop: 0,
    backgroundColor: color.white,
    alignItems: "center",
  },
  headerContainer: {
    marginTop: 0,
    backgroundColor: colorNew.darkPink,
    alignItems: "center",
  },
  subTitleNew: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: "10%",
    fontFamily: "SF Pro Text",
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
  },
  mainTitle: {
    width: 174,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 20,
  },
  circuitName: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 5,
  },
  workoutContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 135.4,
    height: 135.4,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  buttonView: {
    height: 48,
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
    marginLeft: 5,
  },
  buttonText: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginLeft: 0,
  },
  workoutText: {
    width: 108,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: "#333",
    marginTop: 10,
    flex: 1,
  },
  completeButton: {
    width: 315,
    height: 48,
    borderColor: color.hotPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
  },
  smallButtonText: {
    width: 315,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.hotPink,
  },
  carouselContainer: {
    marginTop: 0,
    marginBottom: -10,
  },
  whiteButtonText: {
    width: 315,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  cardCircuitTitle: {
    width: "90%",
    height: 16,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
  },
  cardCircuitTitlePink: {
    width: "90%",
    height: 16,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    marginTop: 5,
    color: colorNew.mediumPink,
  },
  cardCircuitHeader: {
    width: "90%",
    height: 60,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
  },
  info: {
    width: width,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
  },
  modalContainer: {
    flex: 1,
  },
  modalContainerShop: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 0,
    height: height,
    width: width,
  },
  windowShop: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bfbfbf80",
    height: "100%",
    width: "100%",
  },
  dialogueShop: {
    width: "90%",
    height: 440,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  window: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(148,148,148,0.5)",
  },
  dialogue: {
    width: "90%",
    height: Platform.OS === "ios" ? 310 : 280,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  modalHeaderText: {
    width: "100%",
    height: "15%",
    marginTop: 0,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  lableText: {
    marginLeft: "10%",
    marginTop: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#8E8D95",
  },
  sectionStyle: {
    marginTop: height * 0.002,
    width: 45,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
    paddingLeft: 5,
  },
  buttonView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 30,
    backgroundColor: color.white,
    borderRadius: 100,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
  },
  button1Text: {
    height: 20,
    marginBottom: 5,
    marginTop: 5,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1.5,
    textAlign: "center",
    color: color.mediumPink,
  },
  instructions: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.hotPink,
    textAlign: "center",
    margin: 5,
  },
};
