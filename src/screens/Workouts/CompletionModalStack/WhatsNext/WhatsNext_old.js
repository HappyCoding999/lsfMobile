import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Hydration from "../Hydration";
import { color } from "../../../../modules/styles/theme";

export default class extends Component {

  state = {
    showHydrationModal: false
  };

  render() {
    const { 
      skipPressed, 
      onBonusChallengePressed,
      onStretchPressed
    } = this.props;
    const { showHydrationModal } = this.state;
    const { container, headerContainer, header, rowContainer, text, textContainer } = styles;

    return (
      <View style={container}> 

        <View style={headerContainer}>
          <Text allowFontScaling={false} style={header}>What's next?</Text>
        </View>

        <View style={rowContainer}>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={this._openHyrdrationLog} activeOpacity={1}>
              <Image style={{ width: 140, height: 140, resizeMode: 'contain' }} source={require("./images/hydrate.png")} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={onStretchPressed} activeOpacity={1}>
              <Image style={{ width: 140, height: 140 }} source={require("./images/stretch.png")} />
            </TouchableOpacity>
          </View>

        </View>

        <TouchableOpacity onPress={onBonusChallengePressed} activeOpacity={1} >
          <Image style={{ width: 140, height: 140 }} source={require("./images/bonusChallenge.png")}/>
        </TouchableOpacity>

        <View style={textContainer}>
          <TouchableOpacity activeOpacity={.5} onPress={skipPressed}>
            <Text allowFontScaling={false} style={text}>SKIP FOR NOW</Text>
          </TouchableOpacity>
        </View>

        <Hydration 
          visible={showHydrationModal}
          onClose={this._closeHydrationLog} 
        />

      </View>
    );
  }

  _openHyrdrationLog = () => {
    this.setState({
      showHydrationModal: true
    });
  };

  _closeHydrationLog = () => {
    this.setState({
      showHydrationModal: false
    });
  }
}

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center", 
    backgroundColor: "white",
    flex: 1
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flex: 1,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    marginTop: 25,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '90%',
    marginBottom: 5
  },
  textContainer: {
    justifyContent: "center",
    flex: 1
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink
  }
};
