import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Video from "react-native-video"


export default class NextWorkOutFooter extends Component {

  render() {

    const { nextMove, onClose } = this.props

    return (
      <TouchableOpacity onPress={onClose}>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={{ width: 80, height: 80, backgroundColor: "#ddd", marginLeft: 24, overflow: "hidden" }}>
            <Video
              style={{ height: 220, width: 220, position: "absolute", top: - 75, left: -70 }}
              source={{ uri: nextMove.videoUrl }}
              repeat={true}
              resizeMode="contain"
            />
          </View>
          <View style={{ marginLeft: 24, marginTop: 20, flexDirection: "column" }}>
            <Text allowFontScaling={false} style={styles.mainText}>NEXT MOVE</Text>
            <Text allowFontScaling={false} style={styles.secondaryText}>{nextMove.exercise}</Text>
          </View>
          <Image style={{ marginLeft: 45, marginTop: 20 }} source={require("./images/carouselArrowRightWhite.png")} />
        </View>
      </TouchableOpacity>

    );
  }

}

const styles = {
  mainText: {
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: "#ffffff"
  },
  secondaryText: {
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff"
  }

}
