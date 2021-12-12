import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { color } from "../../../../modules/styles/theme";
import { LargeButton } from "../../../../components/common";
import Wave from "react-native-waveview"

class Hydration extends Component {

  state = {
    bottles: 0,
    bottlesCount: 0
  };

  increaseBottles = () => {
    if (this.state.bottlesCount === 4) {
      return;
    } else {
      this.setState({
        bottles: this.state.bottles + 30,
        bottlesCount: this.state.bottlesCount + 1
      });
      { this._waveRect && this._waveRect.setWaterHeight(this.state.bottles + 30) }
    }
  }

  decreaseBottles = () => {
    if (this.state.bottlesCount === 0) {
      return;
    } else {
      this.setState({
        bottles: this.state.bottles - 30,
        bottlesCount: this.state.bottlesCount - 1
      });
      { this._waveRect && this._waveRect.setWaterHeight(this.state.bottles - 30) }
    }

  }

  render() {

    const { bottles, bottlesCount } = this.state;
    const { onLogPress } = this.props;

    return (
      <View>
        <View style={{ justifyContent: "center", alignItems: "center", textAlign: "center", marginTop: 0, zIndex: 1 }}>
          <Image
            style={styles.h2O}
            source={require("./images/h2O.png")}
            resizeMode='center' />

        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text allowFontScaling={false} style={styles.trackText}>Track your water intake daily to make sure you hit your goal!</Text>

        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", textAlign: "center", marginTop: 45 }}>
          <View style={{ justifyContent: "center", alignItems: "center", width: 100 }}>
            <TouchableOpacity onPress={this.decreaseBottles}>
              <Image source={require("./images/stepperDown.png")} />
            </TouchableOpacity>
          </View>

          <Wave
            ref={ref => this._waveRect = ref}
            style={styles.wave}
            H={bottles}
            waveParams={[
              { A: 10, T: 180, fill: '#62c2ff' },
              { A: 15, T: 140, fill: '#0087dc' },
              { A: 20, T: 100, fill: '#1aa7ff' },
            ]}
            animated={true}
          />
          <ImageBackground
            style={{ width: 85, height: 186, justifyContent: "center", alignItems: "center" }}
            source={require("./images/illustrationLargewaterbottle.png")}>
            <Text adjustsFontSizeToFit={true} allowFontScaling={false} style={styles.waterBottleText}>{bottlesCount}</Text>
          </ImageBackground>

          <View style={{ justifyContent: "center", alignItems: "center", width: 100 }}>
            <TouchableOpacity onPress={this.increaseBottles}>
              <Image source={require("./images/stepperUp.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.btnView}>
          <LargeButton
            onPress={() => onLogPress(bottlesCount)}>
            <Text allowFontScaling={false} style={styles.btnText}>LOG {bottlesCount} BOTTLES</Text>
          </LargeButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  trackText: {
    width: 300,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    justifyContent: "center",
    alignContent: "center"
  },
  h2O: {
    width: "100%",
    height: 100,
    justifyContent: "center",
  },
  bottle: {
    width: 150,
    height: 345,
    justifyContent: "center"
  },
  btnView: {
    marginTop: 40
  },
  btnText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  waterBottleText: {
    width: 60,
    height: 64,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 63.8,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 5,
    position: "absolute",
    bottom: 0,
  },
  waterContainer: {
    flex: 1,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden"
  },
  wave: {
    width: 70,
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: "absolute",
    bottom: 5,
    height: "100%"
  },
})

export default Hydration;