import React, { Component } from "react";
import { View, Text, TouchableHighlight, Dimensions } from "react-native";
import Video from "react-native-video";
import { color as colors } from "../../../modules/styles/theme";

const {  width } = Dimensions.get('window');

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

    const { container } = styles;

    return (
      <View style={container}>
        {this._renderHeader()}
        {this._renderVids()}
      </View>
    )
  }

  _renderHeader() {
    const { number } = this.props;

    return (
      <View>
        <Text allowFontScaling={false} style={styles.header}>
          Circuit {number}
        </Text>
        <Text allowFontScaling={false} style={styles.subHeader}>
          Complete 2 rounds of moves below:
        </Text>
      </View>
    );
  }

  _renderVids() {
    const { exercises } = this.props;

    return (
      <View style={{ flexDirection: "column", justifyContent: "space-evenly", width: "100%", height: 500, marginTop: 0, backgroundColor: "#ffffff" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: width, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
            <TouchableHighlight
              onPress={() => console.log("")}
              underlayColor={'#ddd'}>
              <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
                <View style={styles.numberView}>
                  <Text allowFontScaling={false} style={styles.numberText}>1</Text>
                </View>
                <View style={styles.workoutContainer}>
                  <View style={styles.videoContainer}>
                  {
                    this.state.showVideos ?
                    <Video
                      style={{ height: '100%', width: '100%'}}
                      source={{ uri: exercises[0].videoUrl }}
                      repeat={true}
                      resizeMode={"cover"}
                    />
                    : null
                  }
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <Text allowFontScaling={false} numberOfLines={3} style={styles.workoutText}>{exercises[0].exercise}{"\n"}{exercises[0].reps}</Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
            <TouchableHighlight
              onPress={() => console.log("")}
              underlayColor={'#ddd'}>
              <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
                <View style={styles.numberView}>
                  <Text allowFontScaling={false} style={styles.numberText}>2</Text>
                </View>
                <View style={styles.workoutContainer}>
                  <View style={styles.videoContainer}>
                  {
                    this.state.showVideos ?
                    <Video
                      style={{ height: '100%', width: '100%'}}
                      source={{ uri: exercises[1].videoUrl }}
                      repeat={true}
                      resizeMode="cover"
                    />
                    : null
                  }
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <Text allowFontScaling={false} numberOfLines={3} style={styles.workoutText}>{exercises[1].exercise}{"\n"}{exercises[1].reps}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: width, backgroundColor: "#ffffff" }}>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
            <TouchableHighlight
              onPress={() => console.log("")}
              underlayColor={'#ddd'}>
              <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
                <View style={styles.numberView}>
                  <Text allowFontScaling={false} style={styles.numberText}>3</Text>
                </View>
                <View style={styles.workoutContainer}>
                  <View style={styles.videoContainer}>
                  {
                    this.state.showVideos ?
                    <Video
                      style={{ height: "100%", width: "100%"}}
                      source={{ uri: exercises[2].videoUrl }}
                      repeat={true}
                      resizeMode="cover"
                    />
                    : null
                  }
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <Text allowFontScaling={false} numberOfLines={3} style={styles.workoutText}>{exercises[2].exercise}{"\n"}{exercises[2].reps}</Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff" }}>
            <TouchableHighlight
              onPress={() => console.log("")}
              underlayColor={'#ddd'}>
              <View style={{ flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", backgroundColor: "#ffffff"}}>
                <View style={styles.numberView}>
                  <Text allowFontScaling={false} style={styles.numberText}>4</Text>
                </View>
                <View style={styles.workoutContainer}>
                  <View style={styles.videoContainer}>
                  {
                    this.state.showVideos ?
                    <Video
                      style={{ height: "100%", width: "100%"}}
                      source={{ uri: exercises[3].videoUrl }}
                      repeat={true}
                      resizeMode="cover"
                    />
                    : null
                  }
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            <Text allowFontScaling={false} numberOfLines={3} style={styles.workoutText}>{exercises[3].exercise}{"\n"}{exercises[3].reps}</Text>
          </View>
        </View>

      </View>
    );
  }
};

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  header: {
    marginTop: 16,
    fontFamily: "Northwell",
    fontSize: 64,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.hotPink
  },
  subHeader: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.black,
    marginTop: -20
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10
  },
  btn: {
    marginTop: 10,
    marginBottom: 10
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
  videoContainer: {
    position: "absolute", 
    width: 135.5, 
    height: 135.5, 
    top: 1, 
    bottom: 1, 
    left: 1, 
    right: 1, 
    overflow: "hidden"
  },
  numberView: {
    width: 30,
    height: 30,
    backgroundColor: colors.mediumPink,
    borderRadius: 15,
    justifyContent: "center",
    alignContent: "center",
    zIndex: 1,
    position: "absolute",
    marginTop: -15
  },
  numberText: {
    width: 30,
    height: 16,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 16,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  workoutText: {
    width: 108,
    height: 56,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: "#333",
    marginTop: 10
  }
};