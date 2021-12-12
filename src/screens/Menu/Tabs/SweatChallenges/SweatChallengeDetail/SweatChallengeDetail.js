import React, { Component } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, Modal, SafeAreaView, FlatList, Dimensions, Linking } from "react-native";
import { color } from "../../../../../modules/styles/theme";
import Video from "react-native-video"
import { WebView } from "react-native-webview"

const { height, width } = Dimensions.get('window');

export default class SweatChallengeDetail extends Component {

  _onYoutubePressed = () => {
    const { youtubePlaylistUrl } = this.props

    Linking.canOpenURL(youtubePlaylistUrl).then(supported => {
      if (supported) {
        Linking.openURL(youtubePlaylistUrl)
      } else {
        Linking.openURL(youtubePlaylistUrl)
      }
    }).catch(err => console.log(err))
  }

  render() {

    const {
      challengeName,
      featuredImageUrl,
      highlightText,
      highlightBoxColor,
      daily10,
      onButtonPress,
      textColor,
      videos,
      youtubePlaylistUrl,
      youtubePlaylistId,
      youtubePlaylistImage
    } = this.props

    console.log("SweatChallengeDetail props: ", this.props);

    // const { daily10 } = this.state


    return (
      <View style={{ alignItems: "center", backgroundColor: "#fff", marginBottom: 300, height: "100%" }}>
        <View style={styles.headerImage}>
          <Image style={{ width: "100%", height: "100%" }} source={{ uri: featuredImageUrl }} />
        </View>
        <View style={{
          width: 302,
          height: 35,
          marginTop: -20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: highlightBoxColor
        }}>
          <Text allowFontScaling={false} style={[styles.bannerMessage, { color: textColor }]}>{highlightText}</Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          width={"100%"}
          directionalLockEnabled={true}
        >
          <View style={styles.heading}>
            <Image source={require("./images/lsfDaily10.png")} />
          </View>
          <View style={styles.scrollContainer}>
            <View style={styles.circleCell}>
              <View style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 60
              }}>
                {/* <Image style={{ width: 125, height: 125 }} source={{ url: daily10.move1ImageUrl }} /> */}
                <Video
                  style={{ height: 170, width: 155, top: -60, left: -25 }}
                  source={{ uri: daily10.move1ImageUrl }}
                  repeat={true}
                  resizeMode={"cover"}
                />
              </View>
            </View>
            <View style={styles.circleCell}>
              <View style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 60
              }}>
                {/* <Image style={{ width: 125, height: 125 }} source={{ uri: daily10.move2ImageUrl }} /> */}
                <Video
                  style={{ height: 170, width: 155, top: -60, left: -25 }}
                  source={{ uri: daily10.move2ImageUrl }}
                  repeat={true}
                  resizeMode={"cover"}
                />
              </View>
            </View>
            <View style={styles.circleCell}>
              <View style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 60
              }}>
                {/* <Image style={{ width: 125, height: 125 }} source={{ uri: daily10.move3ImageUrl }} /> */}
                <Video
                  style={{ height: 170, width: 155, top: -60, left: -25 }}
                  source={{ uri: daily10.move3ImageUrl }}
                  repeat={true}
                  resizeMode={"cover"}
                />
              </View>
            </View>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={onButtonPress}>
              <View style={styles.mainButton}>
                <Text allowFontScaling={false} style={styles.buttonText}>LET'S GET SWEATY</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.heading}>
            <Image source={require("./images/featured.png")} />
            <Image style={{ marginLeft: 5 }} source={require("./images/illustrationWatermelon.png")} />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => this._onYoutubePressed()}
              style={{ width: width, height: 400, marginBottom: 200 }}>
              <Image style={{ width: "100%", height: "100%" }} source={{ uri: youtubePlaylistImage }} />
            </TouchableOpacity>
          </View>
          <View style={styles.heading}>
            <Image source={require("./images/illustrationPineapple.png")} />
          </View>
        </ScrollView>

      </View>
    );
  }
}

const styles = {
  headerImage: {
    backgroundColor: color.lightGrey,
    width: "100%",
    height: 278
  },
  headerBanner: {
    width: 302,
    height: 35,
    marginTop: -20,
    alignItems: "center",
    justifyContent: "center"
  },
  bannerMessage: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#435e88"
  },
  heading: {
    width: "100%",
    height: 40,
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center"
  },
  scrollContainer: {
    flexDirection: "row",
    height: 160,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  circleCell: {
    width: 100,
    height: 100,
    borderRadius: 58.5,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowRadius: 16,
    shadowOpacity: 1
  },
  mainButton: {
    width: 280,
    height: 48,
    borderRadius: 100,
    backgroundColor: "#ffd7eb",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 10
  },
  buttonText: {
    width: 155,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  videoCell: {
    width: 335,
    height: 180,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 12,
    shadowOpacity: 1,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollContainer2: {
    flexDirection: "row",
    height: 400,
    marginTop: 20,
    marginLeft: 34,
    width: "100%",
    marginBottom: 200
  },


}
