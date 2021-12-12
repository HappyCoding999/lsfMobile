import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  ImageBackground,
  Linking,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import CircuitCard from "../CircuitCard";
import {
  LargeButton,
  Sticker,
  ConnectedMusicButtons,
  LargeGradientButton,
  ConnectedMusicButtonsWhite,
} from "../../../components/common";
import Spotify from "rn-spotify-sdk";
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
import firebase from "react-native-firebase";
import { MediumButtonAnimated } from "../../../components/common/AnimatedComponents/MediumButtonAnimated";
import Carousel from "../../../components/common/Carousel";
import { Pagination } from "react-native-snap-carousel";

import { cancel_round_cross } from "../../../images";
import { ArrowShopNow } from "../../../components/common/AnimatedComponents";

const { width, height } = Dimensions.get("window");
const cardContainerHeight = width * 0.87;
const SLIDER_WIDTH = width;
const ITEM_WIDTH = (height * 0.45 * 2.6) / 4; //Math.round(SLIDER_WIDTH * 0.53);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 4) / 3);
const SLIDER_1_FIRST_ITEM = 0;

const GEAR_ITEM_WIDTH = Math.round(width * 0.72);
const GEAR_ITEM_HEIGHT = (width * 1.5) / 5;

class CircuitOverview extends Component {
  state = {
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
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
    shopList: [],
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
      {
        title: "White Pocket Sunset",
        subtitle: "Lorem ipsum dolor sit amet et nuncat ",
        illustration: "https://i.imgur.com/MABUbpDl.jpg",
      },
    ],
    spotifyLoggedIn: false,
    showPlaylistModal: false,
    myMusicPressed: false,
  };

  musicChoice = "";

  componentDidMount() {
    this._retrieveShopItemData();
    Spotify.isLoggedInAsync()
      .then((result) => {
        this.setState({ spotifyLoggedIn: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  _retrieveShopItemData = async () => {
    let ref = firebase.database().ref("shopItems");
    ref.once("value").then((snapshot) => {
      //  var filteredGear = [];
      //  snapshot.val().map((item)=> {
      //   console.log('item to check');
      //   console.log(item.tag);
      //   if (item.tag === "BAND"){
      //     if (this.props.gear.includes("BAND") && filteredGear.includes("BAND") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (item.tag === "WEIGHT"){
      //     if (this.props.gear.includes("WEIGHT") && filteredGear.includes("WEIGHT") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (item.tag === "MAT"){
      //     if (this.props.gear.includes("MAT") && filteredGear.includes("MAT") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (item.tag === "STEP"){
      //     if (this.props.gear.includes("STEP") && filteredGear.includes("STEP") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      // })

      this.setState({
        shopList: snapshot.val(),
      });
    });
  };

  startMyWorkout = () => {
    console.log("startMyWorkout");
    EventRegister.emit("paywallEvent", this._onLargeButtonPressed);
  };

  render() {
    const { container, btnStyle, subTitle, subTitleNew } = styles;

    const { onSecondBtnPressed } = this.props;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    return (
      <View style={{ width: width, height: height }}>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          contentContainerStyle={container}
        >
          {this._renderHeader()}
          {this._renderExcerciseDetail()}

          <LargeGradientButton
            onPress={this.startMyWorkout}
            containerStyle={{ btnStyle, marginTop: 2 }}
          >
            Start My Workout
          </LargeGradientButton>
          {this._renderVideoBtn()}
          <View style={{ width: "100%", marginTop: 50 }}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={colors}
              style={styles.linearGradient}
            >
              <Text allowFontScaling={false} style={subTitleNew}>
                Choose your music!
              </Text>
              {this._renderMusicButtons()}
              <View style={{ width: "100%", height: 20 }} />
            </LinearGradient>
          </View>
          <Text
            allowFontScaling={false}
            style={{ ...subTitleNew, color: "#000" }}
          >
            What You'll Need
          </Text>
          {this._renderGears()}
        </ScrollView>
        {this._renderShopItemModal()}
      </View>
    );
  }

  _onLargeButtonPressed = () => {
    const { onLargeBtnPressed } = this.props;
    onLargeBtnPressed();
  };

  // _skipWorkoutPressed = () => {
  // };

  _renderSkipBtn() {
    const { onSecondBtnPressed } = this.props;
    const { btnStyle } = styles;
    if (onSecondBtnPressed) {
      return (
        <LargeButton
          onPress={() => EventRegister.emit("paywallEvent", onSecondBtnPressed)}
          containerStyle={btnStyle}
        >
          SKIP WORKOUT
        </LargeButton>
      );
    }

    return null;
  }
  _renderVideoBtn() {
    const { onVideoBtnPressed } = this.props;
    const { btnStyle } = styles;
    if (onVideoBtnPressed) {
      return (
        <LargeButton
          onPress={() => EventRegister.emit("paywallEvent", onVideoBtnPressed)}
          containerStyle={{ ...btnStyle, marginTop: 2 }}
        >
          Choose Video Instead
        </LargeButton>
      );
    }

    return null;
  }

  _renderHeader() {
    const { headerContainer, title, info, rowContainer } = styles;
    const { workoutTitle, time, level } = this.props;
    const infoText = time === "none" ? level : `Approx ${time} | ${level}`;

    return (
      <View style={headerContainer}>
        <View style={{ ...rowContainer, width: "100%", marginTop: 60 }}>
          <Text allowFontScaling={false} style={title}>
            {workoutTitle}
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
            {/*<View style={{width:"100%",marginTop:20}}>
              <Text style={cardCircuitTitlePink}>BRIDGE HIP LIFT</Text>
              <Text style={cardCircuitTitlePink}>SQUAT</Text>
              <Text style={cardCircuitTitlePink}>REVERSE LUNGE</Text>
              <Text style={cardCircuitTitlePink}>BUTT KICKER</Text>
            </View>
            <View style={{width:"100%",marginTop:20}}>
              <Text style={cardCircuitTitlePink}>WLAKING LUNGE</Text>
              <Text style={cardCircuitTitlePink}>GRAND PLIE SQUAT</Text>
              <Text style={cardCircuitTitlePink}>SINGLE LEG BRIDGE</Text>
              <Text style={cardCircuitTitlePink}>BURPEE</Text>
            </View>*/}
          </ScrollView>
        </View>
      </View>
    );
  };
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
  _renderExcerciseDetail() {
    const { excerciseDetailContainer, title, info, rowContainer } = styles;
    const { workoutTitle, time, level, workoutImage } = this.props;
    const infoText = time === "none" ? level : `Approx ${time} | ${level}`;

    return (
      <View style={excerciseDetailContainer}>
        <View
          style={{
            width: "100%",
            height: cardContainerHeight,
            backgroundColor: "#fff",
            marginTop: 25,
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
            autoplayInterval={1000}
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

  _renderCircuitCards() {
    const rowContainer = {
      ...styles.rowContainer,
      marginTop: 20,
      marginBottom: 10,
    };
    const { circuitCardPressed } = this.props;

    return (
      <View style={rowContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            EventRegister.emit("paywallEvent", () => circuitCardPressed(1))
          }
        >
          <CircuitCard imageSource={require("./images/1.png")} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            EventRegister.emit("paywallEvent", () => circuitCardPressed(2))
          }
        >
          <CircuitCard imageSource={require("./images/2.png")} />
        </TouchableOpacity>
      </View>
    );
  }
  _renderGears() {
    console.log("_renderGears");
    console.log(this.props.gear);
    console.log(this.state.shopList);
    var filteredGear = [];
    this.state.shopList.map((item) => {
      console.log("item to check");
      console.log(item);
      const { tag } = item;
      console.log(item);
      for (var i = tag.length - 1; i >= 0; i--) {
        let tagName = tag[i];
        if (
          filteredGear.includes(tagName) == false &&
          this.props.gear.includes(tagName)
        ) {
          filteredGear.push(item);
          break;
        }
      }
      //   tag.map((tagName)=> {
      //   if (tagName === "BAND"){
      //     if (this.props.gear.includes("BAND") && filteredGear.includes("BAND") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (tagName === "WEIGHT"){
      //     if (this.props.gear.includes("WEIGHT") && filteredGear.includes("WEIGHT") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (tagName === "MAT"){
      //     if (this.props.gear.includes("MAT") && filteredGear.includes("MAT") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (tagName === "STEP"){
      //     if (this.props.gear.includes("STEP") && filteredGear.includes("STEP") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      //   if (tagName === "ROLLER"){
      //     if (this.props.gear.includes("ROLLER") && filteredGear.includes("ROLLER") == false) {
      //       filteredGear.push(item)
      //     }
      //   }
      // })
    });
    console.log("filteredGear");
    console.log(filteredGear);
    const {
      nameStyle,
      levelStyle,
      weekStyle,
      titleText,
      selectedTrophyText,
      unselectedTrophyText,
      updateStatsText,
      whiteTitleText,
      goalEditText,
    } = styles;
    return (
      <View
        style={{
          width: "100%",
          height: GEAR_ITEM_HEIGHT + 40,
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
          data={filteredGear}
          renderItem={this._renderGearItems}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
  _renderGearItems = ({ item }) => {
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
                  width: GEAR_ITEM_HEIGHT,
                  height: GEAR_ITEM_HEIGHT,
                  backgroundColor: colorNew.boxGrey,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              source={{ uri: item.imgUrl }}
            ></ImageBackground>
          </View>
          {/*<View style={{width:GEAR_ITEM_HEIGHT,height:GEAR_ITEM_HEIGHT,alignItems: "center",flexDirection: "column",justifyContent: "center",backgroundColor:colorNew.boxGrey,borderRadius: 10}}>
              </View>*/}
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
          ...styles.modalContainer,
          position: "absolute",
          marginTop: -20,
          overflow: "hidden",
        }}
      >
        <View style={{ ...styles.window, overflow: "hidden" }}>
          <View
            style={{
              ...styles.dialogue,
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
                width: "100%",
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

  _renderStickers() {
    const rowContainer = { ...styles.rowContainer, width: "90%" };
    const { sticker, stickerLabel } = styles;

    const { gear } = this.props;
    const needsMat = gear.includes("MAT");
    const needsBand = gear.includes("BAND");
    const needsWeight = gear.includes("WEIGHT");
    const needsStep = gear.includes("STEP");

    return (
      <View style={rowContainer}>
        {needsMat ? (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image
                style={{ width: 90, height: 90 }}
                resizeMode={"cover"}
                source={require("./images/mat.png")}
              />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>
              MAT
            </Text>
          </View>
        ) : null}
        {needsBand ? (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image
                style={{ width: 90, height: 90 }}
                resizeMode={"cover"}
                source={require("./images/buttonDumbells.png")}
              />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>
              DUMBBELLS
            </Text>
          </View>
        ) : null}
        {needsWeight ? (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image
                style={{ width: 90, height: 90 }}
                resizeMode={"cover"}
                source={require("./images/buttonBootyband.png")}
              />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>
              BOOTY BAND
            </Text>
          </View>
        ) : null}
        {needsStep ? (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Sticker style={sticker}>
              <Image
                style={{ width: 90, height: 90 }}
                resizeMode={"cover"}
                source={require("./images/buttonStep.png")}
              />
            </Sticker>
            <Text allowFontScaling={false} style={stickerLabel}>
              STEP
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  _renderMusicButtons() {
    return <ConnectedMusicButtonsWhite />;
  }
}

const styles = {
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 0,
    height: height,
    width: width,
  },
  window: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bfbfbf80",
    height: "100%",
    width: "100%",
  },
  dialogue: {
    width: "90%",
    height: 440,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    width: width,
    backgroundColor: "white",
  },
  ImageBackgroundContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  linearGradient: {
    width: "100%",
    backgroundColor: "#ffffff",
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
  paginationContainer: {
    paddingVertical: 2,
    paddingBottom: 15,
  },
  paginationDot: {
    marginTop: 2,
    marginBottom: 2,
    width: 8,
    height: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colorNew.boxGrey,
    marginHorizontal: 0,
  },
  paginationDotInactive: {
    marginTop: 2,
    marginBottom: 2,
    width: 8,
    height: 8,
    borderWidth: 0,
    borderRadius: 4,
    marginHorizontal: 0,
  },
  itemContainerAndroid: {
    width: ITEM_WIDTH - 10,
    height: ITEM_HEIGHT,
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
  mainContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  carouselContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  headerContainer: {
    marginTop: 0,
    backgroundColor: colorNew.darkPink,
    alignItems: "center",
  },
  excerciseDetailContainer: {
    marginTop: 0,
    backgroundColor: color.white,
    alignItems: "center",
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
  btnStyle: {
    marginTop: 20,
  },
  stickerLabel: {
    width: 80,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
  },
  subTitle: {
    marginTop: 20,
    marginBottom: 20,
    fontFamily: "Northwell",
    fontSize: 38,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 75,
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    width: width,
  },
  subTitleNew: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: "10%",
    fontFamily: "SF Pro Text",
    fontSize: 26,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
    width: width,
  },
  sticker: {
    margin: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
  },
  musicBtn: {
    width: 150,
    height: 48,
    borderColor: color.mediumPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  smallButtonText: {
    width: 105,
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
};

export default CircuitOverview;
