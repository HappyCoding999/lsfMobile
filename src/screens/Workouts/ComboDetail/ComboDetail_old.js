import React, { Component } from "react";
import { View, Image, Text, TouchableHighlight, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import Video from "react-native-video";
import { EventRegister } from "react-native-event-listeners";
import { color } from "../../../modules/styles/theme"
import { ConnectedMusicButtons } from "../../../components/common";

const { height } = Dimensions.get('window');

export default class extends Component {

  state = {
    showVideos: false
  }

  componentDidMount() {
    this._didFocus = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({ showVideos: true })
      }
    );
  }

  componentWillUnmount() {
    this._didFocus.remove();
  }

  render() {
    const { mainTitle, circuitName, rounds } = this.props;

    return (
      <ScrollView pagingEnabled={true} style={{ backgroundColor: "#fff" }} horizontal={false}>
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.mainTitle}>{mainTitle}</Text>
          <Image style={{ marginTop: 5 }} source={require("./images/1.png")} />
          <Text allowFontScaling={false} style={styles.circuitName}>{circuitName ? circuitName.toUpperCase() : ""}</Text>
          <Text allowFontScaling={false} style={styles.circuitName}>Complete {rounds} rounds of moves below</Text>
          {this._renderVideoGrid()}
          {this._renderButtons()}
        </View>
      </ScrollView>
    );
  }

  _renderVideoGrid() {
    const { exercises } = this.props;

    return (
      <View style={{ flexDirection: "column", justifyContent: "space-around", width: "100%", marginTop: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
            <View style={styles.workoutContainer}>
              <View style={{ position: "absolute", width: "100%", height: "100%", top: 0, bottom: 0, left: -10, overflow: "hidden" }}>
              {
                this.state.showVideos ?
                <Video
                  style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                  source={{ uri: exercises[0].videoUrl }}
                  repeat={true}
                  resizeMode="cover"
                />
                : null
              }
              </View>
            </View>
            <Text allowFontScaling={false} numberOfLines={3} style={styles.workoutText}>{exercises[0].exercise}{"\n"}{exercises[3].reps}</Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
            <View style={styles.workoutContainer}>
              <View style={{ position: "absolute", width: "100%", height: "100%", top: 0, bottom: 0, left: -10, overflow: "hidden" }}>
              {
                this.state.showVideos ?
                <Video
                  style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                  source={{ uri: exercises[1].videoUrl }}
                  repeat={true}
                  resizeMode="cover"
                />
                : null
              }
              </View>
            </View>
            <Text allowFontScaling={false} style={styles.workoutText}>{exercises[1].exercise}{"\n"}{exercises[3].reps}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 25 }}>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
            <View style={styles.workoutContainer}>
              <View style={{ position: "absolute", width: "100%", height: "100%", top: 0, bottom: 0, left: -10, overflow: "hidden" }}>
              {
                this.state.showVideos ?
                <Video
                  style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                  source={{ uri: exercises[2].videoUrl }}
                  repeat={true}
                  resizeMode="cover"
                />
                : null
              }
              </View>
            </View>
            <Text allowFontScaling={false} style={styles.workoutText}>{exercises[2].exercise}{"\n"}{exercises[3].reps}</Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
            <View style={styles.workoutContainer}>
              <View style={{ position: "absolute", width: "100%", height: "100%", top: 0, bottom: 0, left: -10, overflow: "hidden" }}>
              {
                this.state.showVideos ?
                <Video
                  style={{ height: 135 * 1.2, width: 135 * 1.2 }}
                  source={{ uri: exercises[3].videoUrl }}
                  repeat={true}
                  resizeMode="cover"
                />
                : null
              }
              </View>
            </View>
            <Text allowFontScaling={false} style={styles.workoutText}>{exercises[3].exercise}{"\n"}{exercises[3].reps}</Text>
          </View>
        </View>

      </View>
    );
  }

  _renderButtons() {
    const { onSweatSoloPress, onCompletionPress, onVideoLibraryPress } = this.props;

    return (
      <View style={{ flexDirection: "column", marginTop: 10, width: "100%", height: height, justifyContent: "flex-start", alignItems: "center" }}>
        <Text style={styles.instructions}>SWIPE UP TO CONTINUE</Text>
        <Image style={{ marginTop: 60 }} source={require("./images/2.png")} />
        <Text allowFontScaling={false} style={styles.circuitName}>+{this.props.time ? this.props.time.toUpperCase() : "30 MINUTES"} {this.props.secondaryType ? this.props.secondaryType.toUpperCase() : ""}</Text>
        {this._renderMusicButtons()}
        <View style={{ width: 315, margin: 10 }}>
          <TouchableHighlight
            style={styles.buttonView}
            onPress={() => EventRegister.emit("paywallEvent", onSweatSoloPress)}
            underlayColor={'#ee90af'}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              SWEAT SOLO
                      </Text>
          </TouchableHighlight>
        </View>
        <View style={{ width: 315, margin: 10 }}>
          <TouchableHighlight
            style={styles.buttonView}
            onPress={onVideoLibraryPress}
            underlayColor={'#ee90af'}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              CHOOSE VIDEO
                      </Text>
          </TouchableHighlight>
        </View>
        <View style={{ width: 315, margin: 10 }}>
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
    );
  }

  _renderSkipBtn() {
    const { onSkipPress } = this.props;
    if (onSkipPress) {
      return (
        <View style={{ width: 315, marginTop: 60 }}>
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


  _renderMusicButtons() {

    return <ConnectedMusicButtons />;
  }


}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white"
  },
  mainTitle: {
    width: 174,
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
  circuitName: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 5
  },
  workoutContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 135.4,
    height: 135.4,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 12,
    shadowOpacity: 1
  },
  buttonView: {
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: "center",
    marginLeft: 5
  },
  buttonText: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginLeft: 0,

  },
  workoutText: {
    width: 108,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: "#333",
    marginTop: 10,
    flex: 1
  },
  completeButton: {
    width: 315,
    height: 48,
    borderColor: color.hotPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute"
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
    color: color.hotPink
  },
  instructions: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.hotPink,
    textAlign: "center",
    margin: 5
  }
};



