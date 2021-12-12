import React, { Component } from "react";
import { EventRegister } from "react-native-event-listeners";
import {
  InteractionManager,
  View,
  Text,
  Image,
  TouchableOpacity,
  SectionList,
  Dimensions,
  ImageBackground,
  FlatList,
  Modal,
  Platform,
} from "react-native";
import {
  getFeaturedChallenges,
  getBonusChallenges,
} from "../../../../DataStore";
import { LoadingComponent } from "../../../../components/common";
import { color, colorNew } from "../../../../modules/styles/theme";
import {
  logo_white_love_seat_fitness,
  icon_back_arrow_pink,
  ic_back_white,
} from "../../../../images";
import { WebView } from "react-native-webview";
import { Header } from "react-native-elements";
import moment from "moment";
import { last } from "lodash";

const { width, height } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";

class SweatChallenges extends Component {
  state = {
    featuredChallenges: null,
    bonusChallenges: null,
    showSignUpModal: false,
    featuredImageLink: null,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._fetchBonusChallenges();
    });
  }

  _fetchBonusChallenges() {
    getBonusChallenges().then((bonusChallenges) =>
      this.setState({ bonusChallenges })
    );
  }
  handleBack = () => {
    console.log("handleBack pressed");
    this.props.navigation.pop();
  };
  renderTransperantHeaderview() {
    return (
      <View
        style={{
          height: 84,
          width: "100%",
          marginTop: 0,
          position: "absolute",
          zIndex: 15,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: "#F597A9",
        }}
      >
        <TouchableOpacity
          style={{
            height: 44,
            width: 44,
            top: 25,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 5,
          }}
          onPress={this.handleBack}
        >
          <Image
            style={{ flex: 1, top: 0 }}
            resizeMode="contain"
            source={ic_back_white}
          />
        </TouchableOpacity>
        <Image
          style={{ flex: 1, top: 25, tintColor: colorNew.darkPink }}
          resizeMode="contain"
          source={logo_white_love_seat_fitness}
        />
        <View
          style={{
            height: 44,
            width: 44,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 5,
          }}
        ></View>
      </View>
    );
  }

  render() {
    const { bonusChallenges: challenges } = this.state;

    if (challenges === null) {
      return <LoadingComponent />;
    }

    if (challenges.length > 0) {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <SectionList
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 84,
              marginBottom: 64,
              backgroundColor: "#fff",
            }}
            showsVerticalScrollIndicator={false}
            sections={[{ title: "DAILY BONUS SWEATS", data: [challenges] }]}
            keyExtractor={(item, idx) => item + idx}
            renderSectionHeader={({ section }) => {
              if (section.title === "FEATURED CHALLENGE") {
                return (
                  <View style={styles.sectionHeader}>
                    <Image source={require("./images/timeTitleCopy.png")} />
                  </View>
                );
              } else if (section.title === "DAILY BONUS SWEATS") {
                return (
                  <View style={styles.sectionHeader}>
                    {/* <Image source={require("./images/timeTitleCopy2.png")} /> */}

                    <Text
                      style={{
                        color: color.white,
                        fontSize: 22,
                        fontWeight: "bold",
                        letterSpacing: 0.4,
                        marginTop: 20,
                        marginBottom: 30,
                      }}
                    >
                      Daily Bonus Sweats
                    </Text>
                  </View>
                );
              }
              return (
                <View
                  style={{ width: width, height: 50, backgroundColor: "white" }}
                />
              );
            }}
            renderItem={this._renderItem}
          />

          {this.renderSignUpModal()}
          {this.renderTransperantHeaderview()}
        </View>
      );
    }
  }

  renderSignUpModal() {
    return (
      <Modal
        animationType="slide"
        visible={this.state.showSignUpModal}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1 }}>
          <Header
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showSignUpModal: false });
                }}
              >
                <Image source={require("./images/iconXPink.png")} />
              </TouchableOpacity>
            }
            centerComponent={{ text: "", style: styles.headerTitle }}
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <WebView source={{ uri: this.state.featuredImageLink }} />
        </View>
      </Modal>
    );
  }

  _linkToChallengeDashOrWebview = (featured) => {
    // check to see if challenge is active
    const { challengeActive } = this.props.screenProps;

    // if there currently is a challenge, navigate to challenge dash otherwise link to a web view
    if (challengeActive) {
      return this.props.navigation.navigate("ChallengeDashboard");
    } else {
      this.setState({
        showSignUpModal: true,
      });
    }
  };

  _renderItem = ({ item, section }) => {
    const { bonusChallenges: challenges } = this.state;

    if (section.title === "FEATURED CHALLENGE") {
      // get the latest featured challenge from the db
      const featured = last(item);

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this._linkToChallengeDashOrWebview(featured)}
        >
          <View
            style={{
              width: width * 0.9,
              height: 250,
              backgroundColor: "white",
            }}
          >
            <Image
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              source={{ uri: featured.featuredImageUrl }}
            />
          </View>
        </TouchableOpacity>
      );
    } else
      return (
        <FlatList
          data={challenges}
          numColumns={2}
          contentContainerStyle={styles.gridcontainer}
          ListFooterComponent={<View style={{ width: "100%", height: 70 }} />}
          renderItem={this.renderGridItem}
          keyExtractor={(item, idx) => item + idx}
        />
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
  onButtonPressed = (workoutChallenge) => {
    const { exercisesInCircuit, title } = workoutChallenge;
    const tags = exercisesInCircuit.split(",").map((e) => parseInt(e));
    const passedProps = {
      ...workoutChallenge,
      tags,
    };

    this.props.navigation.navigate("BonusChallenge", passedProps);
  };

  renderGridItem = ({ item }) => {
    let itemWidth = width * 0.45 - 20;
    // const colors = ["#ffffff05", "#00000050"];
    const colors = ["rgba(207, 136, 150, 0.6)", "rgba(0,0,0,0.2)"];

    return (
      <TouchableOpacity
        style={[
          this.shadowBottom(5),
          {
            justifyContent: "space-around",
            padding: 0,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 5,
            marginBottom: 15,
            backgroundColor: "transparent",
          },
        ]}
        activeOpacity={0.9}
        onPress={() =>
          EventRegister.emit("paywallEvent", () => this.onButtonPressed(item))
        }
      >
        <View
          style={{
            width: itemWidth,
            backgroundColor: "transparent",
            // height: itemWidth * 0.53,
            height: itemWidth,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: itemWidth,
              backgroundColor: "#ddd",
              // height: itemWidth * 0.53,
              height: itemWidth,
              overflow: "hidden",
            }}
          >
            <ImageBackground
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              source={{ uri: item.featureImageUrl }}
            >
              <LinearGradient
                start={{ x: 0, y: 0.6 }}
                end={{ x: 0, y: 0.8 }}
                colors={colors}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  allowFontScaling={true}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  // numberOfLines={2}
                  ellipsizeMode={"tail"}
                  style={styles.gridText}
                >
                  {item.title.toUpperCase()}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}

const styles = {
  titleText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    textAlign: "center",
    color: color.lightPink,
    marginTop: 30,
    textShadowColor: color.hotPink,
  },
  thumbnailText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
    marginTop: 8,
  },
  sectionHeader: {
    width: width,
    height: Platform.OS == "android" ? 65 : 85,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fff",
    backgroundColor: "#F597A9",
    marginBottom: 20,
  },
  list: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "column",
    width: width,
    backgroundColor: "#ddd",
  },
  gridcontainer: {
    width: "100%",
    height: 500,
    backgroundColor: "#333",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  gridText: {
    // width: "96%",
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    // textAlign: "center",
    color: color.white,
    marginVertical: 8,
    marginLeft: 12,
    marginRight: 22,
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
};

export { SweatChallenges };
