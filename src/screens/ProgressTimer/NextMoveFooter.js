import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color,colorNew} from "../../modules/styles/theme"
import Video from "react-native-video"
import { next_white_subscrib } from "../../images";


export default class NextWorkOutFooter extends Component {

  render() {

    const { nextMove, onClose } = this.props

    return (
      <TouchableOpacity onPress={onClose}>
        <View style={{ width: "100%", flexDirection: "row",borderColor: colorNew.borderGrey,borderWidth: 0.5,borderRadius: 5,overflow: "hidden"}}>
        <View style={{ width: 90, height: 100, backgroundColor: "#ddd", marginLeft: 1,margintop: 1, overflow: "hidden", alignItems: "center"}}>
          <View style={{ width: 90, height: 100,marginLeft: 0, overflow: "hidden", alignItems: "center"}}>
            <Video
              style={{ height: 230, width: 260, position: "absolute", top: - 70, left: -80 }}
              source={{ uri: nextMove.videoUrl }}
              repeat={true}
              resizeMode="contain"
            />
          </View>
          </View>
          <View style={{ marginLeft: 24, marginTop: 35, flexDirection: "column" }}>
            <Text allowFontScaling={false} style={styles.mainText}>NEXT MOVE</Text>
            <Text allowFontScaling={false} style={styles.secondaryText}>{nextMove.exercise}</Text>
          </View>
          <Image style={{ margin: 20, marginTop: 40,marginRight:15,marginLeft:15,tintColor:colorNew.darkPink}} source={next_white_subscrib} />
        </View>
      </TouchableOpacity>

    );
  }

}

const styles = {
  mainText: {
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.1,
    color: "#000"
  },
  secondaryText: {
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "200",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#000"
  }

}
