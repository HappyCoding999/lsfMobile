import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  ImageBackground,
} from "react-native";
import { AsyncStorage } from "react-native";
import { color, colorNew } from "../../../../../modules/styles/theme";
import firebase from "react-native-firebase";
import { EventRegister } from "react-native-event-listeners";
import Carousel from "../../../../../components/common/Carousel";
import { Pagination } from "react-native-snap-carousel";

import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");
const itemRatio = 125 / 160;
const SLIDER_WIDTH = width;
const ITEM_WIDTH = SLIDER_WIDTH;

const SLIDER_1_FIRST_ITEM = 0;

export default class VideoList extends Component {
  state = {
    videoList: [],
    showVideoModal: false,
    videoUrl: "",
    showFavoriteModal: false,
    showDeleteModal: false,
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    entries: [
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
      {
        thumbnailUrl:
          "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F10minfinisher.jpg?alt=media&token=6238df3d-4471-481e-8f11-a53971d911e9",
        category: "Workouts",
        videoDescription: "Torch calories and every inch in just 10 minutes!",
        videoName: "10 Minute Full Body Finisher",
        subcategory: "HIIT Workouts",
        videoUrl:
          "https://lsfvideolibrary.s3-us-west-1.amazonaws.com/10minfinisher2020/playlist.m3u8",
      },
    ],
  };

  favoriteArray = [];
  itemRef = [];

  _onCloseButtonPressed = () => {
    this.setState({
      showFavoriteModal: false,
      showDeleteModal: false,
    });
  };

  async removeItem() {
    try {
      await AsyncStorage.removeItem("FAVORITE_VIDEOS");
      return true;
    } catch (exception) {
      return false;
    }
  }
  componentWillUnmount() {
    this._didFocus.remove();
  }

  componentDidUpdate(prevProps) {
    const { screenProps } = prevProps;

    if (screenProps.level != this.props.screenProps.level) {
      this._retrieveVideoData();
      this._retrieveFeaturedCategoryVideoData();
    }
  }

  componentDidMount() {
    this._retrieveVideoData();
    this._retrieveFeaturedCategoryVideoData();
    this._didFocus = this.props.navigation.addListener(
      "didFocus",
      (payload) => {
        console.log("componentDidMount in VideoLibrary => _didFocus");
        console.log("payload : => " + Object.entries(payload));
        if (
          payload.action.params != undefined &&
          payload.action.params.chooseVideoBtn != undefined
        ) {
          if (payload.action.params.chooseVideoBtn) {
            console.log("componentDidMount in VideoLibrary => _didFocus 1");
          }
        }
        // this.setState({ showVideos: true })
      }
    );
    // firebase.database().ref('shopItems/' + 2).set({
    //   title:"Day Dreamer Journal",
    //   imgUrl: "https://cdn.shopify.com/s/files/1/1695/0003/products/JournalFinal3_edit_compact.jpg?v=1573779585",
    // });
    // firebase.database().ref('sweatySelfieImages/' + 0).set({
    // imgUrl: "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhbhfullbody.jpg?alt=media&token=29a854cf-56f3-40d5-843a-1694206c384d",
    // });
  }
  _retrieveFeaturedCategoryVideoData = async () => {
    const { videoListTitle, VideoSubCategory } =
      this.props.navigation.state.params;
    let title = VideoSubCategory;
    let refPath = "featuredCategoryVideos/" + videoListTitle;
    let ref = firebase.database().ref(refPath);
    console.log("_retrieveFeaturedCategoryVideoData");
    console.log(refPath);

    ref.once("value").then((snapshot) => {
      const fbObject = snapshot.val();
      const newArr = Object.values(fbObject);
      console.log("_retrieveFeaturedCategoryVideoData 1");
      console.log(newArr);
      this.setState({
        entries: newArr,
      });
    });
  };
  _retrieveVideoData = async () => {
    const { videoListTitle, VideoSubCategory } =
      this.props.navigation.state.params;
    let ref = firebase.database().ref("videos");
    let title = VideoSubCategory;

    // alert("-- " + title);

    ref
      .orderByChild("subcategory")
      .equalTo(title)
      .once("value")
      .then((snapshot) => {
        const fbObject = snapshot.val();
        const newArr = Object.values(fbObject);

        var list = newArr.reverse();

        this.setState({
          videoList: list,
          // videoList: list.filter((e) =>
          //   e.level
          //     .toLowerCase()
          //     .includes(this.props.screenProps.level.toLowerCase())
          // ),
        });
      });
  };
  renderGridItem = ({ item }) => {
    let itemWidth = (width * 0.95 - 42) / 2;
    console.log(item);
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
          onPress={() => this._checkVideoPaywall(item)}
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
              source={{
                uri: item.thumbnailUrl
                  ? item.thumbnailUrl
                  : item.thumbnailImageUrl,
              }}
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
            {item.duration ? item.duration + " min" : "-- min"}
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

  renderGridItemNew = ({ item }) => {
    let itemWidth = width * 0.9;
    const colors = ["#ffffff05", "#00000050"];
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

    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: width * 0.9,
          height: itemWidth * itemRatio + 25,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "space-around" }}
          activeOpacity={0.9}
          onPress={() => this._checkVideoPaywall(item)}
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
                source={{
                  uri: item.thumbnailUrl
                    ? item.thumbnailUrl
                    : item.thumbnailImageUrl,
                }}
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
                        {item.videoName}
                      </Text>
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
                        {item.duration ? item.duration + " min" : "-- min"} |{" "}
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
  _renderItem = ({ item, separators }) => {
    const isFavorite = this.favoriteArray.some(
      (video) => video.videoName === item.videoName
    );
    return (
      <TouchableHighlight
        onPress={() => this._checkVideoPaywall(item)}
        underlayColor={color.lightGrey}
      >
        <View style={styles.cellContainer}>
          <View style={styles.imageContainer}>
            {/*<Image
              style={{ width: width, height: width }}
              source={{ uri: item.thumbnailUrl }}
              resizeMode="cover" />*/}
          </View>
          <View
            style={{
              flexDirection: "column",
              marginTop: 20,
              width: width * 0.9,
            }}
          >
            <Text allowFontScaling={false} style={styles.primaryText}>
              {item.videoName}
            </Text>
            <Text allowFontScaling={false} style={styles.secondaryText}>
              {item.videoDescription}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  _renderCarousel = ({ item, index }) => {
    console.log("_renderCarousel");
    return (
      <TouchableHighlight
        onPress={() => this._checkVideoPaywall(item)}
        underlayColor={color.lightGrey}
      >
        <View style={styles.itemContainer}>
          <ImageBackground
            style={{
              flexDirection: "column",
              marginLeft: 20,
              marginRight: 20,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "flex-end",
              backgroundColor: "#a2a2a2",
            }}
            imageStyle={{ resizeMode: "cover" }}
            source={{ uri: item.thumbnailUrl }}
          >
            {/*<Text allowFontScaling={false} style={{...styles.topSubTitleText, bottom:50}}>{item.title}</Text>*/}
          </ImageBackground>
        </View>
      </TouchableHighlight>
    );
  };

  /*render() {
    const { videoUrl } = this.state;
    const { screenProps } = this.props;
    const { videoListTitle} = this.props.navigation.state.params

    return (      
      <ScrollView 
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
       style={{ flex: 1 }} contentContainerStyle={{backgroundColor: "#fff", justifyContent: "flex-start", alignItems: "center", width: width }}>
        <View style={styles.headerContainer}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={this.state.entries}
            loop={true}
            renderItem={this._renderCarousel}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            firstItem={SLIDER_1_FIRST_ITEM}
            containerCustomStyle={styles.carouselContainer}
            autoplay={true}
            autoplayDelay={1}
            autoplayInterval={3000}
            onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
          />
          <Text allowFontScaling={false} style={styles.topSubTitleText}>(HIIT video playing - may be a mash up of {"\n"} multiple HIIT moves/videos)</Text>
        </View>
        <Text allowFontScaling={false} style={styles.mainTitle}>{videoListTitle} + test</Text>
        <FlatList
          style={{ height: height, flexGrow: 0}}
          numColumns={2}
          data={this.state.videoList}
          renderItem={this.renderGridItem}
          contentContainerStyle={styles.gridcontainer}
          keyExtractor={(item, index) => item + index}
        />
      </ScrollView>
    );
  }*/
  Render_FlatList_Sticky_header = () => {
    const { videoListTitle, categoryDescription } =
      this.props.navigation.state.params;
    var Sticky_header_View = (
      <View>
        <View style={styles.headerContainer}>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            data={this.state.entries}
            loop={true}
            renderItem={this._renderCarousel}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            firstItem={SLIDER_1_FIRST_ITEM}
            containerCustomStyle={styles.carouselContainer}
            autoplay={true}
            autoplayDelay={1}
            autoplayInterval={3000}
            onSnapToItem={(index) =>
              this.setState({ slider1ActiveSlide: index })
            }
          />
          {/*<Text allowFontScaling={false} style={styles.topSubTitleText}>(HIIT video playing - may be a mash up of {"\n"} multiple HIIT moves/videos)</Text>*/}
        </View>
        <View>
          <Text allowFontScaling={false} style={styles.mainTitle}>
            {videoListTitle}
          </Text>
          {/*<Text allowFontScaling={false} style={{...styles.topSubTitleText,width: "100%",color: "#a2a2a2",paddingLeft:0,position: "relative",marginTop: -20,marginBottom:15}}>{categoryDescription}</Text>*/}
        </View>
      </View>
    );

    return Sticky_header_View;
  };
  render() {
    const { videoUrl, thumbnailUrl, videoName, videoDescription, duration } =
      this.state;
    const { screenProps } = this.props;
    const { videoListTitle } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <FlatList
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          ListHeaderComponent={this.Render_FlatList_Sticky_header}
          data={this.state.videoList}
          renderItem={this.renderGridItemNew}
          contentContainerStyle={styles.gridcontainer}
          keyExtractor={(item, index) => item + index}
        />
        {screenProps.renderVideoModal(
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
          duration
        )}
      </View>
    );
  }

  _checkVideoPaywall = (item) => {
    console.log("_checkVideoPaywall video list");
    console.log(item);
    const {
      isFree,
      videoUrl,
      thumbnailUrl,
      videoName,
      videoDescription,
      duration,
    } = item;
    // console.log('_checkVideoPaywall')
    if (isFree) {
      // console.log('_checkVideoPaywall isFree')
      return this._showVideoFullScreen(
        videoUrl,
        thumbnailUrl,
        videoName,
        videoDescription,
        duration
      );
    } else {
      // console.log('_checkVideoPaywall else')
      return EventRegister.emit(
        "paywallEvent",
        this._showVideoFullScreen(
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
          duration
        )
      );
    }
  };

  _showVideoFullScreen =
    (videoUrl, thumbnailUrl, videoName, videoDescription, duration) => () => {
      const { screenProps } = this.props;
      console.log("_showVideoFullScreen : ");
      console.log(duration);
      this.setState(
        {
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
          duration,
        },
        () =>
          screenProps.openVideoModal(
            videoUrl,
            thumbnailUrl,
            videoName,
            videoDescription,
            duration
          )
      );
    };
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  headerContainer: {
    width: "100%",
    top: -10,
    height: (width * 300) / 414 + 10,
    backgroundColor: "#b2b2b2",
  },
  cellContainer: {
    width: width,
    height: width + 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  imageContainer: {
    width: "100%",
    height: width,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
  },
  primaryText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
  },
  secondaryText: {
    width: "90%",
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
  },
  separator: {
    width: "80%",
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 24,
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
    height: 272,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalHeaderText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  modalBodyText: {
    width: 200,
    height: 110,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 12,
  },
  button1: {
    width: 140,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center",
  },
  button1Text: {
    width: 80,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
  button2: {
    width: 140,
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
    justifyContent: "center",
    alignItems: "center",
  },
  topSubTitleText: {
    width: "90%",
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontStyle: "normal",
    letterSpacing: 0,
    paddingLeft: 5,
    textAlign: "center",
    color: "#727272",
    position: "absolute",
    marginTop: height * 0.4 - 80,
  },
  mainTitle: {
    width: "100%",
    height: 42,
    fontFamily: "SF Pro Text",
    fontSize: 35,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 30,
    marginBottom: 30,
  },
  gridcontainer: {
    width: width,
    marginTop: 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
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
  carouselContainer: {
    marginTop: 0,
    height: "40%",
    marginBottom: 0,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorNew.bgGrey,
  },
  button2Text: {
    width: 73,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
    textAlign: "center",
  },
};
