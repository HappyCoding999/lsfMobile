import React, { Component } from "react";
import {
  InteractionManager,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  Linking,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import { color, colorNew } from "../../../../../modules/styles/theme";
import {
  videos_library_hiit,
  videos_library_liss,
  videos_library_miss,
  videos_library_bootcamp,
  videos_library_targeted,
  videos_library_yoga,
  videos_library_streching,
  videos_library_how_to,
  videos_library_targeted4,
} from "../../../../../images";
import firebase from "react-native-firebase";
import { EventRegister } from "react-native-event-listeners";
import { SELECTED_TAB_INDEX } from "../../../../../actions/types";
import VideoLibraryHeader from "../../../VideoLibraryHeader/VideoLibraryHeader";
import { AsyncStorage } from "react-native";
import { howToMeasurements } from "../../../../../utils/videoData";
import LinearGradient from "react-native-linear-gradient";
import { VIDEO_HEADER_HEIGHT } from "../../../../../actions/types";
import store from "../../../../../../configureStore";

const itemRatio = 125 / 160;
const { width, height } = Dimensions.get("window");
const gridHeight = width * 0.45 - 10;

const HEADER_EXPANDED_HEIGHT = (width * 300) / 414;
const HEADER_COLLAPSED_HEIGHT = 100;

class VideoLibrary extends Component {
  constructor(props) {
    super(props);

    this.renderGridItem = this.renderGridItem.bind(this);
    this.renderGridItemNew = this.renderGridItemNew.bind(this);

    this.state = {
      featured: null,
      hiit: null,
      miis: null,
      liis: null,
      videoUrl: null,
      menuArray: null,
      recoveryData: null,
      howtoData: null,
      youtubeData: null,
      currentCategory: props.category ? props.category : "",
      newCardio: null,
      isFromChooseVideoInstead: false,
      categories: null,
    };
  }

  componentWillUnmount() {
    console.log("componentWillUnmount called");
    this._didFocus.remove();
  }

  componentDidMount() {
    // console.log("componentDidMount in VideoLibrary");
    // console.log(this.state.currentCategory);

    // alert("selected_tab_index: " + this.props.screenProps.selected_tab_index);
    // this.props.change_tab_index(this.props.screenProps.selected_tab_index);

    this._didFocus = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        console.log(
          "Vishal - componentDidMount in VideoLibrary => _didFocus called"
        );
        console.log(payload);
        console.log("Vishal - checking for chooseVideoInstead in AsyncStorage");
      }
    );

    // AsyncStorage.setItem("selected_tab_index", "0").then(() => {});

    // this.scrollY = new Animated.Value(0);
    // this.changingHeight = this.scrollY.interpolate({
    //   inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    //   outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    //   extrapolate: "clamp",
    // });
    // this.props.changingHeight(this.changingHeight);
    // this.props.navigation.setParams({
    //   changingHeight: this.changingHeight,
    // });

    InteractionManager.runAfterInteractions(() => {
      if (this.state.currentCategory == "YOUTUBE".toUpperCase()) {
        firebase
          .database()
          .ref("youtube")
          .once("value")
          .then((snapshot) => {
            const fbObject = snapshot.val();
            const newArr = Object.values(fbObject);
            this.setState({
              youtubeData: newArr,
            });
          })
          .catch((err) => console.log(err.stack));
      } else if (
        this.state.currentCategory == "RECOVERY".toUpperCase() ||
        this.state.currentCategory == "How To".toUpperCase()
      ) {
        firebase
          .database()
          .ref("videos")
          .once("value")
          .then((snapshot) => {
            const fbObject = snapshot.val();
            const newArr = Object.values(fbObject);
            var menuArray = [];
            var tempData = [];

            var howtoArray = [];
            // console.log("Vishal this.state.currentCategory == RECOVERY");
            // console.log(newArr);
            menuArray = newArr.filter((obj) => obj.subcategory === "Warm Ups");
            tempData = newArr.filter((obj) => obj.subcategory === "Stretching");
            menuArray = [...menuArray, ...tempData];
            tempData = newArr.filter((obj) => obj.subcategory === "Yoga");
            menuArray = [...menuArray, ...tempData];
            tempData = [];
            howtoArray = newArr.filter(
              (obj) => obj.subcategory === "Education"
            );
            // console.log("Vishal menuArray == howtoArray");
            // console.log(howtoArray);
            this.setState({
              recoveryData: menuArray,
              howtoData: howtoArray,
            });

            //   .filter((e) =>
            //   e.level
            //     .toLowerCase()
            //     .includes(this.props.screenProps.level.toLowerCase())
            // )
          })
          .catch((err) => console.log(err.stack));
      } else {
        var menuArray = [];
        // menuArray = [{"title":"HIIT","img":videos_library_hiit,VideoSubCategory: "HIIT Workouts"},{"title":"LISS","img":videos_library_liss,VideoSubCategory: "LISS Workouts"},
        //   {"title":"MISS","img":videos_library_miss,VideoSubCategory: "MISS Workouts"},{"title":"Barre Bootcamp","img":videos_library_bootcamp,VideoSubCategory: "Quick Trouble Area Workouts"},
        //   {"title":"Targeted","img":videos_library_targeted,VideoSubCategory: "Quick Trouble Area Workouts"},{"title":"Yoga","img":videos_library_yoga,VideoSubCategory: "Yoga"}]
        menuArray = [
          {
            title: "HIIT",
            img: videos_library_hiit,
            VideoSubCategory: "HIIT Workouts",
            categoryDescription: "High Intensity Interval Training",
          },
          {
            title: "LISS",
            img: videos_library_liss,
            VideoSubCategory: "LISS Workouts",
            categoryDescription: "Low Intensity Interval Training",
          },
          {
            title: "MISS",
            img: videos_library_miss,
            VideoSubCategory: "MISS Workouts",
            categoryDescription: "Medium Intensity Interval Training",
          },
          {
            title: "Targeted",
            img: videos_library_targeted,
            VideoSubCategory: "Quick Trouble Area Workouts",
            categoryDescription: "Quick Trouble Area Workouts",
          },
          {
            title: "Yoga",
            img: videos_library_yoga,
            VideoSubCategory: "Yoga",
            categoryDescription: "Mix of high and low intensity yoga flows",
          },
          {
            title: "Warm Ups",
            img: videos_library_streching,
            VideoSubCategory: "Warm Ups",
            categoryDescription: "Warm Ups",
          },
        ];

        this.setState({
          menuArray: menuArray,
        });
      }
    });
  }
  _renderInviteFriend() {
    const { latestChallenge } = this.props.screenProps;
    const { challengeName } = latestChallenge;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          marginTop: gridHeight * 2.5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: width,
            height: 100,
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: colorNew.mediumPink,
          }}
        >
          <View
            style={{
              width: width * 0.65,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text allowFontScaling={false} style={styles.bottomTitleText}>
              {challengeName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: width * 0.35,
              height: 45,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: "90%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderColor: color.white,
                borderWidth: 1,
                borderRadius: 20,
              }}
              onPress={() =>
                this.props.navigation.navigate("ChallangeNavigator")
              }
            >
              <Text allowFontScaling={false} style={styles.bottomButtonText}>
                JOIN THE CHALLANGE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    console.log("render");
    const { challengeActive, latestChallenge, selected_tab_index } =
      this.props.screenProps;
    const { challengeName } = latestChallenge;

    let firstImageURL = this.state.featured
      ? this.state.featured[0].thumbnailImageUrl
      : "";
    let hiit = this.state.hiit ? this.state.hiit[0].thumbnailImageUrl : "";
    let liis = this.state.liis ? this.state.liis[0].thumbnailImageUrl : "";
    let miis = this.state.miis ? this.state.miis[0].thumbnailImageUrl : "";
    let newCardio = this.state.newCardio
      ? this.state.newCardio[0].thumbnailImageUrl
      : "";
    console.log(firstImageURL);

    if (
      this.state.menuArray != null ||
      this.state.recoveryData != null ||
      this.state.howtoData != null ||
      this.state.youtubeData != null
    ) {
      var dataArray = this.state.menuArray;
      if (this.state.currentCategory == "RECOVERY".toUpperCase()) {
        dataArray = this.state.recoveryData;
      } else if (this.state.currentCategory == "How To".toUpperCase()) {
        console.log("this.state.howtoData");
        console.log(this.state.howtoData);
        dataArray = this.state.howtoData;
      } else if (this.state.currentCategory == "youtube".toUpperCase()) {
        dataArray = this.state.youtubeData;
      }
      // console.log("Vishal : dataArray for category -> " + this.state.currentCategory)
      // console.log(dataArray);
      return (
        <View
          style={{ flex: 1 }}
          contentContainerStyle={{
            backgroundColor: "#fff",
            justifyContent: "flex-start",
            alignItems: "center",
            width: width,
          }}
        >
          <FlatList
            data={dataArray}
            numColumns={
              this.state.currentCategory != "Workouts".toUpperCase() ? 1 : 2
            }
            scrollEnabled={true}
            nestedScrollEnabled={true}
            // bounces={false}
            // onScroll={(event) => {
            //   store.dispatch({
            //     type: VIDEO_HEADER_HEIGHT,
            //     payload: event.nativeEvent.contentOffset.y,
            //   });
            // }}
            // onScroll={Animated.event(
            //   [
            //     {
            //       nativeEvent: {
            //         contentOffset: {
            //           y: this.scrollY,
            //         },
            //       },
            //     },
            //   ],
            //   {
            //     listener: (event) => {
            //       store.dispatch({
            //         type: VIDEO_HEADER_HEIGHT,
            //         payload: this.scrollY,
            //       });
            //     },
            //   }
            // )}
            // scrollEventThrottle={5}
            style={{
              width: "100%",
              backgroundColor: "#fff",
              padding: 0,
              marginBottom: 50,
            }}
            contentContainerStyle={{
              ...styles.gridcontainer,
              marginLeft:
                this.state.currentCategory != "Workouts".toUpperCase() ? 10 : 0,
            }}
            renderItem={
              this.state.currentCategory != "Workouts".toUpperCase()
                ? this.renderGridItemNew
                : this.renderGridItem
            }
            ListFooterComponent={this.render_footer}
            keyExtractor={(item, idx) => item + idx}
          />

          {this._renderVideoModal()}
        </View>
      );
    } else {
      return null;
    }
  }
  renderGridItem = ({ item, index }) => {
    // let itemWidth = (width * 0.44)
    let itemWidth =
      this.state.currentCategory == "Workouts".toUpperCase()
        ? width * 0.44
        : (width * 0.95 - 42) / 2;
    let itemHeight = itemWidth * itemRatio;

    let uri;
    var title = "";
    var desc = "";
    var duration = "-- min";
    if (
      this.state.currentCategory == "RECOVERY".toUpperCase() ||
      this.state.currentCategory == "How To".toUpperCase()
    ) {
      if (item && item.thumbnailUrl != undefined) {
        uri = { uri: item.thumbnailUrl };
      } else {
        uri = { uri: null };
      }
      title = item.videoName;
      desc = item.videoDescription;
      duration = item.duration + " min";
    } else if (this.state.currentCategory == "youtube".toUpperCase()) {
      // console.log("renderGridItem called");
      // console.log(item);
      if (item && item.thumbnailImageUrl != undefined) {
        uri = { uri: item.thumbnailImageUrl };
      } else {
        uri = { uri: null };
      }
      title = item.videoName;
      desc = item.categoryName;
    } else {
      if (item && item.img != undefined) {
        uri = item.img;
      } else {
        uri = { uri: null };
      }
    }

    if (
      this.state.currentCategory == "RECOVERY".toUpperCase() ||
      this.state.currentCategory == "How To".toUpperCase()
    ) {
      return (
        <View
          style={{
            backgroundColor: "#fff",
            width: (width * 0.95) / 2,
            height: itemWidth * 1.1 + 30,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: "space-around", padding: 10 }}
            activeOpacity={0.9}
            onPress={() =>
              EventRegister.emit("paywallEvent", () =>
                this._checkVideoPaywall(item)
              )
            }
          >
            <View
              style={[
                this.shadowBottom(5),
                {
                  width: itemWidth,
                  backgroundColor: "#ddd",
                  height: itemWidth * itemRatio,
                  borderRadius: 10,
                },
              ]}
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
                  source={uri}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.gridText}
            >
              {title}
            </Text>
            <Text
              allowFontScaling={false}
              adjustsFontSizeToFit={false}
              minimumFontScale={0.7}
              numberOfLines={2}
              ellipsizeMode={"tail"}
              style={styles.subTitleTextPink}
            >
              {duration}
              <Text
                allowFontScaling={false}
                adjustsFontSizeToFit={false}
                minimumFontScale={0.7}
                numberOfLines={2}
                ellipsizeMode={"tail"}
                style={styles.subTitleText}
              >
                {" "}
                | {desc}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.currentCategory == "youtube".toUpperCase()) {
      return (
        <View
          style={{
            backgroundColor: "#fff",
            width: (width * 0.95) / 2,
            height: itemWidth * 1.1 + 30,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: "space-around", padding: 10 }}
            activeOpacity={0.9}
            onPress={() => this._navigateToYoutube(item)}
          >
            <View
              style={[
                this.shadowBottom(5),
                {
                  width: itemWidth,
                  backgroundColor: "#ddd",
                  height: itemWidth * itemRatio,
                  borderRadius: 10,
                },
              ]}
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
                  source={uri}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text
              allowFontScaling={true}
              adjustsFontSizeToFit={false}
              minimumFontScale={0.7}
              numberOfLines={3}
              ellipsizeMode={"tail"}
              style={styles.youtubeTitleText}
            >
              {title}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: "#fff",
            width: itemWidth + 15,
            height: itemHeight * 1.5,
            marginLeft: 0,
            marginTop: 2,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              this.props.screenProps.navigation.navigate("VideoList", {
                videoListTitle: item.title,
                VideoSubCategory: item.VideoSubCategory,
                categoryDescription: item.categoryDescription,
                chooseVideoBtn: this.state.isFromChooseVideoInstead,
              })
            }
          >
            <View
              style={[
                this.shadowBottom(5),
                {
                  marginLeft: 20,
                  width: gridHeight,
                  height: gridHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                },
              ]}
            >
              <ImageBackground
                style={{
                  flexDirection: "column",
                  marginLeft: 0,
                  width: gridHeight,
                  height: gridHeight,
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  backgroundColor: "#a2a2a2",
                  borderRadius: 15,
                }}
                source={uri}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#00000030",
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.titleText,
                      margin: 10,
                      width: "90%",
                      textAlign: "left",
                    }}
                  >
                    {this.state.currentCategory == "RECOVERY".toUpperCase()
                      ? item.videoName
                      : item.title}
                  </Text>
                  {/*<View style={{width:"100%",height:44,bottom:0,backgroundColor:color.mediumPink,position:"absolute",justifyContent:"center",alignItems:"center"}}>
                    <Text allowFontScaling={false} adjustsFontSizeToFit={false} minimumFontScale={.70} numberOfLines={2} ellipsizeMode={"tail"} style={{...styles.titleText,textAlign: "center",fontSize: height <= 667 ? 13 : 15}}>{"View more"}</Text>
                  </View>  */}
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };
  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
  renderGridItemNew = ({ item, index }) => {
    let itemWidth = width * 0.9;
    const colors = ["#ffffff05", "#00000050"];
    let uri;
    var title = "";
    var desc = "";
    var duration = "-- min";
    console.log("renderGridItemNew");
    console.log(item);

    var one_day = 1000 * 60 * 60 * 24;
    // To set present_dates to two variables
    var date1 = new Date(item.uploadDate);
    var date2 = new Date();
    console.log(date1);
    console.log(date2);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / one_day;
    console.log("Difference_In_Days : " + Difference_In_Days);

    if (
      this.state.currentCategory == "RECOVERY".toUpperCase() ||
      this.state.currentCategory == "How To".toUpperCase()
    ) {
      if (item && item.thumbnailUrl != undefined) {
        uri = { uri: item.thumbnailUrl };
      } else {
        uri = { uri: null };
      }
      title = item.videoName;
      desc = item.videoDescription;
      duration = item.duration + " min";
    } else if (this.state.currentCategory == "youtube".toUpperCase()) {
      if (item && item.thumbnailImageUrl != undefined) {
        uri = { uri: item.thumbnailImageUrl };
      } else {
        uri = { uri: null };
      }
      title = item.videoName;
      desc = item.categoryName;
    }

    console.log(item);
    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: width * 0.95,
          height: itemWidth * itemRatio + 25,
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 10,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "space-around" }}
          activeOpacity={0.9}
          onPress={() =>
            this.state.currentCategory == "youtube".toUpperCase()
              ? this._navigateToYoutube(item)
              : this._checkVideoPaywall(item)
          }
        >
          <View
            style={[
              this.shadowBottom(5),
              {
                width: itemWidth,
                backgroundColor: "#ddd",
                height: itemWidth * itemRatio,
                borderRadius: 10,
              },
            ]}
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
              <ImageBackground
                style={{ width: "100%", height: "100%" }}
                source={uri}
                resizeMode="cover"
              >
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 0.95 }}
                  colors={colors}
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    backgroundColor: "transparent",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      marginBottom: 10,
                      justifyContent: "center",
                      alignItems: "space-around",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "70%", marginBottom: 10 }}>
                      <Text
                        allowFontScaling={true}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.7}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                        style={{
                          ...styles.gridText,
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        {title}
                      </Text>
                      {this.state.currentCategory == "youtube".toUpperCase() ? (
                        <Text
                          allowFontScaling={false}
                          adjustsFontSizeToFit={false}
                          minimumFontScale={0.7}
                          numberOfLines={2}
                          ellipsizeMode={"tail"}
                          style={{
                            ...styles.subTitleTextPink,
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          {desc}{" "}
                        </Text>
                      ) : (
                        <Text
                          allowFontScaling={false}
                          adjustsFontSizeToFit={false}
                          minimumFontScale={0.7}
                          numberOfLines={2}
                          ellipsizeMode={"tail"}
                          style={{
                            ...styles.subTitleTextPink,
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          {duration} |{" "}
                          <Text
                            allowFontScaling={false}
                            adjustsFontSizeToFit={false}
                            minimumFontScale={0.7}
                            numberOfLines={2}
                            ellipsizeMode={"tail"}
                            style={{
                              ...styles.subTitleText,
                              color: colorNew.mediumPink,
                            }}
                          >
                            {/* {this.props.screenProps.level} */}
                            {item.level}
                          </Text>
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        width: "25%",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: "85%",
                          backgroundColor: colorNew.darkPink,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 44,
                          borderRadius: 100,
                        }}
                        onPress={() => this._checkVideoPaywall(item)}
                      >
                        <Text
                          style={{
                            top: 1,
                            letterSpacing: 0,
                            fontFamily: "SF Pro Text",
                            fontSize: 13,
                            lineHeight: 22,
                            fontWeight: "bold",
                            fontStyle: "normal",
                            color: "white",
                          }}
                        >
                          {"START"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
                {Difference_In_Days <= 30 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                      position: "absolute",
                      borderRadius: 100,
                      borderWidth: 2,
                      borderColor: colorNew.mediumPink,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "SF Pro Text",
                        fontSize: 16,
                        lineHeight: 20,
                        fontWeight: "bold",
                        fontStyle: "normal",
                        color: colorNew.mediumPink,
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 3,
                        marginBottom: 3,
                      }}
                    >
                      {"New"}
                    </Text>
                  </View>
                ) : null}
              </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  render_footer = () => {
    const { challengeActive, latestChallenge } = this.props.screenProps;
    // return challengeActive ? this._renderInviteFriend() : null
    return this._renderInviteFriend();
  };
  _renderVideoModal = () => {
    console.log("_renderVideoModal");
    const { screenProps } = this.props;
    const { videoUrl, thumbnailUrl, videoName, videoDescription } = this.state;
    if (videoUrl != null) {
      // console.log(
      //   "_renderVideoModal this.state.videoUrl",
      //   videoUrl,
      //   thumbnailUrl,
      //   videoName,
      //   videoDescription
      // );
      return screenProps.renderVideoModal(
        videoUrl,
        thumbnailUrl,
        videoName,
        videoDescription
      );
    } else {
      const { videoUrl, thumbnailUrl, videoName, videoDescription } =
        howToMeasurements;

      return screenProps.renderVideoModal(
        videoUrl,
        thumbnailUrl,
        videoName,
        videoDescription
      );
    }
  };
  _navigateToYoutube = (item) => {
    var safari = item.videoUrl;
    var youtubeApp = item.videoUrl.replace("https://youtu.be/", "youtube://");

    Linking.canOpenURL(youtubeApp)
      .then((supported) => {
        if (supported) {
          Linking.openURL(youtubeApp);
        } else {
          Linking.openURL(safari);
        }
      })
      .catch((err) => console.log(err));
  };
  _checkVideoPaywall = (item) => {
    const { isFree, videoUrl, thumbnailUrl, videoName, videoDescription } =
      item;

    if (isFree) {
      return this._showVideoFullScreen(
        videoUrl,
        thumbnailUrl,
        videoName,
        videoDescription
      )();
    } else {
      return EventRegister.emit(
        "paywallEvent",
        this._showVideoFullScreen(
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription
        )
      );
    }
  };

  _showVideoFullScreen =
    (videoUrl, thumbnailUrl, videoName, videoDescription) => () => {
      const { screenProps } = this.props;
      console.log("_showVideoFullScreen called");
      console.log(videoUrl);
      // screenProps.renderVideoModal(videoUrl);
      // this.props.renderVideoModal(this.state.videoUrl)
      this.setState(
        {
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
        },
        () =>
          screenProps.openVideoModal(
            videoUrl,
            thumbnailUrl,
            videoName,
            videoDescription
          )
      );
    };
}

const styles = {
  bottomTitleText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: height <= 667 ? 16 : 18,
    fontWeight: "bold",
    fontStyle: "normal",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    paddingLeft: 15,
    letterSpacing: 0.5,
    textAlign: "left",
    color: color.white,
  },
  bottomButtonText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: height <= 667 ? 9 : 11,
    fontWeight: "bold",
    fontStyle: "normal",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    letterSpacing: 0.0,
    textAlign: "center",
    color: color.white,
  },
  gridcontainer: {
    width: width,
    marginTop: 10,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
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
  youtubeTitleText: {
    width: "96%",
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 16,
    paddingLeft: 5,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000",
    marginTop: 10,
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
    color: color.mediumPink,
    marginTop: 2,
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
    color: colorNew.bgGrey,
    marginTop: 2,
  },
  titleText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.white,
  },
};

const mapStateToProps = ({ appData }) => ({
  video_height: appData.video_height,
});

const mapDispatchToProps = (dispatch) => ({
  change_tab_index: (status) =>
    dispatch({
      type: SELECTED_TAB_INDEX,
      payload: status,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoLibrary);

// export { VideoLibrary };
