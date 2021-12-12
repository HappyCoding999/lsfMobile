import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import Hydration from "../Hydration";
import HydrationTracker from "../../../HydrationTracker";
import { color, colorNew } from "../../../../modules/styles/theme";
import { cancel_round_cross, icon_back_arrow_pink } from "../../../../images";
import {
  icon_what_next_cup,
  icon_what_next_hydration,
  icon_what_next_streching,
} from "../../../../images";
import {
  icon_what_next_star,
  icon_what_next_calendar,
  icon_what_next_bag,
} from "../../../../images";

import LinearGradient from "react-native-linear-gradient";
const { height, width } = Dimensions.get("window");

export default class extends Component {
  state = {
    showHydrationModal: false,
  };

  render() {
    const {
      skipPressed,
      onBonusChallengePressed,
      onJournalPressed,
      onTrophiePressed,
      onShopClicked,
      close,
      onStretchPressed,
    } = this.props;
    const { showHydrationModal } = this.state;
    const {
      container,
      headerContainer,
      header,
      headerNew,
      rowContainer,
      text,
      textContainer,
      itemContainer,
      item,
      itemText,
    } = styles;
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    return (
      <View style={container}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={colors}
          style={styles.linearGradient}
        >
          <SafeAreaView
            style={{ flex: 1 }}
            forceInset={{ top: "always", bottom: "always" }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                justifyContent: "flex-start",
                alignItems: "center",
                width: width,
                backgroundColor: "transparent",
              }}
            >
              <View style={headerContainer}>
                <Text allowFontScaling={false} style={headerNew}>
                  WORKOUT COMPLETE!
                </Text>
              </View>
              <View
                style={{
                  ...headerContainer,
                  position: "absolute",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/*<TouchableOpacity style={{flex:1}} activeOpacity={1} onPress={close}>
                <View style={{width:"100%",height:44}}>
                  <Image style={{marginLeft:"15%",marginTop:10,width:20,height:20,tintColor:'#fff'}} source={icon_back_arrow_pink} />
                </View>
              </TouchableOpacity>*/}
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
                  <View style={{ width: "100%", height: 44 }}></View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={close}
                >
                  <View style={{ width: "100%", height: 44 }}>
                    <Image
                      style={{
                        marginLeft: "80%",
                        marginTop: 10,
                        width: 20,
                        height: 20,
                      }}
                      source={cancel_round_cross}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={headerContainer}>
                <Text allowFontScaling={false} style={header}>
                  What's next?
                </Text>
              </View>

              <View style={rowContainer}>
                <View style={itemContainer}>
                  <TouchableOpacity
                    onPress={this._openHyrdrationLog}
                    activeOpacity={1}
                    style={item}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <Text allowFontScaling={false} style={itemText}>
                        HYDRATION {"\n"} TRACKER
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 15,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                          source={icon_what_next_hydration}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={itemContainer}>
                  <TouchableOpacity
                    onPress={onStretchPressed}
                    activeOpacity={1}
                    style={item}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <Text allowFontScaling={false} style={itemText}>
                        STRETCHING {"\n"} VIDEOS
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 15,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                          source={icon_what_next_streching}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={rowContainer}>
                <View style={itemContainer}>
                  <TouchableOpacity
                    onPress={onBonusChallengePressed}
                    activeOpacity={1}
                    style={item}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <Text allowFontScaling={false} style={itemText}>
                        BONUS {"\n"} CHALLENGES
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 15,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                          source={icon_what_next_star}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={itemContainer}>
                  <TouchableOpacity
                    onPress={onJournalPressed}
                    activeOpacity={1}
                    style={item}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <Text allowFontScaling={false} style={itemText}>
                        CALENDAR {"\n"} + JOURNAL
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 15,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                          source={icon_what_next_calendar}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={rowContainer}>
                <View style={itemContainer}>
                  <TouchableOpacity
                    onPress={onTrophiePressed}
                    activeOpacity={1}
                    style={item}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <Text allowFontScaling={false} style={itemText}>
                        VIEW {"\n"} TROPHIES
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 15,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                          source={icon_what_next_cup}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={itemContainer}>
                  <TouchableOpacity
                    onPress={onShopClicked}
                    activeOpacity={1}
                    style={item}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        alignItems: "center",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <Text allowFontScaling={false} style={itemText}>
                        SHOP LSF {"\n"} SWAG
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: "40%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        marginBottom: 15,
                      }}
                    >
                      <View
                        style={{
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "contain",
                          }}
                          source={icon_what_next_bag}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <HydrationTracker
                screenProps={this.props.screenProps}
                visible={showHydrationModal}
                onClose={this._closeHydrationLog}
                animType="none"
              />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  _openStrechingVideos = () => {
    console.log("_openStrechingVideos");
  };

  _openBonusChallange = () => {
    console.log("_openBonusChallange");
  };

  _openJournal = () => {
    console.log("_openJournal");
  };

  _openViewTrophies = () => {
    console.log("_openViewTrophies");
  };

  _openShopLSF = () => {
    console.log("_openShopLSF");
  };

  _openHyrdrationLog = () => {
    this.setState({
      showHydrationModal: true,
    });
  };

  _closeHydrationLog = () => {
    this.setState({
      showHydrationModal: false,
    });
  };
}

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerNew: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 80,
  },
  itemText: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
  },
  header: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 25,
    marginBottom: 50,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
  },
  item: {
    width: (width * 0.85 - 60) / 2,
    height: (width * 0.85 - 60) / 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 15,
  },

  textContainer: {
    justifyContent: "center",
    flex: 1,
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
};
