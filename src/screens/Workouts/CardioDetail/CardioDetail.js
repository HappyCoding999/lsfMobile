import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { color } from "../../../modules/styles/theme"
import { LargeButton } from "../../../components/common";
import { EventRegister } from "react-native-event-listeners";
import { ConnectedMusicButtons } from "../../../components/common";

export default class extends Component {
  render() {
    const { onSweatSoloPress, onVideoLibraryPress, onCompletionPress, onSkipPress } = this.props;

    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.mainTitle}>{this.props.mainTitle}</Text>
        <Image style={{ marginTop: 30 }} source={require("./images/illustrationSneaker.png")} />
        <Text allowFontScaling={false} style={styles.secondTitle}>{this.props.secondTitle.toUpperCase()} {this.props.type.toUpperCase()}</Text>
        <ConnectedMusicButtons />
        <View style={{ flexDirection: "column", alignItems: 'center' }}>
          <View style={{ marginTop: 22 }}>
            <LargeButton
              onPress={() => EventRegister.emit("paywallEvent", onSweatSoloPress)}>
              <Text>SWEAT SOLO</Text>
            </LargeButton>
          </View>
          <View style={{ marginTop: 22 }}>
            <LargeButton
              onPress={onVideoLibraryPress}>
              <Text>CHOOSE VIDEO</Text>
            </LargeButton>
          </View>
          <View style={{ marginTop: 22 }}>
            <TouchableOpacity
              onPress={() => EventRegister.emit("paywallEvent", onCompletionPress)}
              style={styles.completeButton}>
              <View>
                <Text allowFontScaling={false} style={styles.smallButtonText}>COMPLETE WORKOUT</Text>
              </View>
            </TouchableOpacity>
          </View>
          {this._renderSkipBtn()}
        </View>
      </View>
    );
  }

  _renderSkipBtn() {
    const { onSkipPress } = this.props;
    if (onSkipPress) {
      return (
        <View style={{ marginTop: 22 }}>
          <TouchableOpacity
            onPress={() => EventRegister.emit("paywallEvent", onSkipPress)}
            style={styles.completeButton}>
            <View>
              <Text allowFontScaling={false} style={styles.smallButtonText}>SKIP WORKOUT</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  mainTitle: {
    width: 190,
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
  secondTitle: {
    width: 315,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
    textAlign: "center",
    marginTop: 25
  },
  completeButton: {
    width: 315,
    height: 48,
    borderColor: color.mediumPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
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
    color: color.mediumPink
  },

}
