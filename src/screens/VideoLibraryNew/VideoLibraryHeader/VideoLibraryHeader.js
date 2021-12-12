import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  ImageBackground,
  InteractionManager,
} from "react-native";
import { connect } from "react-redux";
import { color, colorNew } from "../../../modules/styles/theme";
import {
  TransparentHeader,
  GoalViewForHeader,
} from "../../../components/common";
import firebase from "react-native-firebase";
import Carousel from "../../../components/common/Carousel";
import { Pagination } from "react-native-snap-carousel";

var ImagePicker = require("react-native-image-picker");

const { height, width } = Dimensions.get("window");
const itemRatio = 125 / 160;
const SLIDER_WIDTH = width;
const ITEM_WIDTH = SLIDER_WIDTH;

const SLIDER_1_FIRST_ITEM = 1;

// const HEADER_EXPANDED_HEIGHT = (width * 300) / 414;
// const HEADER_COLLAPSED_HEIGHT = 60;

// var changingHeight = new Animated.Value(0);

// export default class extends Component {
class VideoLibraryHeader extends Component {
  state = {
    newImage: null,
    showGoalView: false,
    selectedVideo: "",
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
  componentDidMount() {
    console.log("componentDidMount in VideoLibraryHeader");
    console.log("componentDidMount Device height");
    console.log(height);
    console.log(this.state.currentCategory);

    InteractionManager.runAfterInteractions(() => {
      firebase
        .database()
        .ref("videoHeaders")
        .once("value")
        .then((snapshot) => {
          const fbObject = snapshot.val();
          const newArr = Object.values(fbObject);
          console.log("VideoLibraryHeader newArr");
          console.log(newArr);
          this.setState({
            entries: newArr,
          });
        })
        .catch((err) => console.log(err.stack));
    });

    console.log("componentDidMount VideoLibraryHeader");
  }

  _checkVideoPaywall = (item) => {
    console.log("_checkVideoPaywall");
    console.log(item);
    const { isFree, videoUrl, thumbnailUrl, videoName, videoDescription } =
      item;
    // if (item.isFree) {
    this.setState({
      selectedVideo: videoUrl,
      thumbnailUrl,
      videoName,
      videoDescription,
    });
    setTimeout(() => {
      this._showVideoFullScreen(
        videoUrl,
        thumbnailUrl,
        videoName,
        videoDescription
      )();
    }, 500);
    // return this._showVideoFullScreen(item.videoUrl)();
    // } else {
    //   return EventRegister.emit("paywallEvent", this._showVideoFullScreen(item.videoUrl));
    // }
  };

  _showVideoFullScreen =
    (videoUrl, thumbnailUrl, videoName, videoDescription) => () => {
      console.log("_showVideoFullScreen");
      const { openVideoModal } = this.props;
      this.setState(
        {
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
        },
        () =>
          openVideoModal(videoUrl, thumbnailUrl, videoName, videoDescription)
      );
    };
  _renderCarousel = ({ item, index }) => {
    const { container, nameStyle, subtitleStyle } = styles;
    return (
      <TouchableHighlight
        onPress={() => this._checkVideoPaywall(item)}
        underlayColor={color.lightGrey}
      >
        <ImageBackground
          style={styles.itemContainer}
          source={{ uri: item.thumbnailUrl }}
          resizeMode="cover"
        >
          <View style={{ width: width, paddingLeft: 18, marginBottom: 15 }}>
            <Text allowFontScaling={false} numberOfLines={2} style={nameStyle}>
              {item.title}
            </Text>
            <Text allowFontScaling={false} style={subtitleStyle}>
              {item.subtitle}
            </Text>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    );
  };
  _navigationLeftButtonPressed() {
    // this.props.navigation.navigate('Profile')
    this.props.navigation.navigate("Settings", {
      backToScreen: "VideoLibraryNew",
      mainNav: this.props.navigation,
    });
  }
  _navigationRightButtonPressed() {
    console.log("_navigationRightButtonPressed");
    let showGoalView = !this.state.showGoalView;
    this.setState({ showGoalView });
  }
  renderGoalView() {
    const { showGoalView } = this.state;
    if (showGoalView) {
      return (
        <View
          style={{
            overflow: "hidden",
            width: "100%",
            flex: 1,
            marginTop: 64 - 10,
            position: "absolute",
            paddingBottom: 15,
          }}
        >
          <View
            style={[
              this.shadowBottom(5),
              {
                width: "100%",
                backgroundColor: colorNew.lightPink,
                justifyContent: "flex-end",
              },
            ]}
          >
            <GoalViewForHeader screenProps={this.props} />
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
  renderHeader() {
    return (
      <View
        style={[
          {
            width: "100%",
            height: 64,
            position: "absolute",
            justifyContent: "flex-end",
            marginTop: -28,
          },
        ]}
      >
        <TransparentHeader
          onLeftPress={this._navigationLeftButtonPressed.bind(this)}
          onRightPress={this._navigationRightButtonPressed.bind(this)}
        />
      </View>
    );
  }
  render() {
    const { name, userName, userLevel, avatar, membership, video_height } =
      this.props;
    const { newImage, slider1ActiveSlide } = this.state;
    const { container, nameStyle, subtitleStyle } = styles;

    const { selectedVideo, thumbnailUrl, videoName, videoDescription } =
      this.state;

    // if (video_height === undefined || video_height === null) {
    // } else {
    //   changingHeight = video_height.interpolate({
    //     inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    //     outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    //     extrapolate: "clamp",
    //   });
    // }

    // changingHeight = video_height.interpolate({
    //   inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    //   outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    //   extrapolate: "clamp",
    // });

    return (
      <View style={[container]}>
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
          autoplayInterval={5000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
        <View
          style={{
            width: width,
            position: "absolute",
            paddingLeft: width * 0.7,
            justifyContent: "flex-end",
            marginTop: (width * 300) / 414 - 40,
          }}
        >
          <Pagination
            dotsLength={3}
            activeDotIndex={slider1ActiveSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.paginationDotInactive}
            dotColor="#f08fa3"
            inactiveDotColor="#fff"
            inactiveDotOpacity={1}
            inactiveDotScale={1}
            carouselRef={this._slider1Ref}
            tappableDots={!!this._slider1Ref}
          />
        </View>
        {/* {this.renderHeader()} */}
        {this.renderGoalView()}
        {this.props.renderVideoModal(
          selectedVideo,
          thumbnailUrl,
          videoName,
          videoDescription
        )}
      </View>
    );
  }

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
  onPressHandler = () => this.props.onLevelPress();

  uploadImage = (path, mime = "application/octet-stream") => {
    return new Promise((resolve, reject) => {
      const sessionId = new Date().getTime();
      const imageRef = firebase
        .storage()
        .ref("profileimages/")
        .child(sessionId + ".png");

      return imageRef
        .put(path, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
          console.log("Error uploading image: ", error);
        });
    });
  };

  selectPhotoTapped() {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    ImagePicker.showImagePicker(null, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        // const source = { uri: response.uri };
        this.setState({ newImage: response.uri });

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.uploadImage(response.uri)
          .then((url) => {
            const currentUser = firebase.auth().currentUser;
            firebase
              .database()
              .ref("users/" + currentUser.uid + "/avatar")
              .set(url)
              .then(() => {});
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }
}

const mapStateToProps = ({ appData }) => ({
  video_height: appData.video_height,
});

export default connect(mapStateToProps)(VideoLibraryHeader);

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    // top: 0,
    height: (width * 300) / 414,
    backgroundColor: colorNew.white,
  },
  carouselContainer: {
    marginTop: -64,
    height: (width * 300) / 414 + 64,
    backgroundColor: "#FFF",
    marginBottom: 0,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: (width * 300) / 414 + 64,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colorNew.bgGrey,
  },
  settingContainer: {
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  subtitleStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "left",
    fontStyle: "normal",
    color: color.white,
    marginTop: 2,
  },
  paginationContainer: {
    paddingVertical: 8,
    paddingBottom: 5,
  },
  paginationDot: {
    marginTop: 0,
    marginBottom: 5,
    width: 8,
    height: 8,
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: colorNew.white,
    marginHorizontal: 1,
  },
  paginationDotInactive: {
    marginTop: 0,
    marginBottom: 5,
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  nameStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "bold",
    width: "60%",
    fontSize: 36,
    textAlign: "left",
    fontStyle: "normal",
    color: color.white,
    marginTop: 10,
  },
};
