import React, { Component } from "react";
import { View, ImageBackground, Image, Text, TouchableOpacity, Dimensions, Animated, ScrollView } from "react-native";
import { color } from "../../../modules/styles/theme";

const { width, height } = Dimensions.get('window');

const pages = [
  { page: 1 },
  { page: 2 }
];

class Welcome extends Component {

  renderFirstPage() {
    return (
      <View style={{ width: width }}>
        <ImageBackground
          style={{ width: width, height: height, resizeMode: 'contain' }}
          source={require("./images/welcome.png")}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 300 }}>
            <Text allowFontScaling={false} style={styles.primaryText}>Hey girl! Here to sweat?</Text>
            <Image source={require("./images/illustrationSwiggleline.png")} />
            <Text allowFontScaling={false} style={styles.secondaryText}>Our Love Sweat Fitness app is going to change the game.</Text>
          </View>
        </ImageBackground>
      </View>

    );
  }

  renderSecondPage() {
    return (
      <View style={{ width: width, alignItems: "center", justifyContent: "flex-start", flexDirection: "column", backgroundColor: "#fff" }}>
        <View style={{ marginTop: height * .06, alignItems: "center" }}>
          <Image source={require("./images/illustrationSneaker.png")} />
          <Text allowFontScaling={false} style={styles.largeText}>New workouts daily</Text>
          <Text allowFontScaling={false} style={styles.smallText}>Get access to hundreds of new workouts, exclusive full-length workout videos, and a step by step plan designed for your fitness level and goals.</Text>
        </View>
        <View style={{ marginTop: height * .03, alignItems: "center" }}>
          <Image source={require("./images/illustrationGoals.png")} />
          <Text allowFontScaling={false} style={styles.largeText}>Keep track of your goals</Text>
          <Text allowFontScaling={false} style={styles.smallText}>So you can crush them with incredible features like our hydration, weight-loss and measurement trackers, plus a daily fitness journal.</Text>
        </View>
        <View style={{ marginTop: height * .03, alignItems: "center" }}>
          <Image source={require("./images/illustrationStars.png")} />
          <Text allowFontScaling={false} style={styles.largeText}>The ultimate motivation</Text>
          <Text allowFontScaling={false} style={styles.smallText}>Join the LSF Community and get daily motivation, fun workout sweat jam playlists, exclusive bonus challenges and amazing achievement trophies to unlock good things, all within the app.</Text>
        </View>
      </View>
    );
  }

  render() {
    scrollX = new Animated.Value(0)
    let position = Animated.divide(this.scrollX, width);
    console.log("welcome render!")

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true} // animates ScrollView to nearest multiple of it's own width
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
            [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
          )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
          scrollEventThrottle={16}>
          {this.renderFirstPage()}
          {this.renderSecondPage()}
        </ScrollView>

        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "center", position: "absolute", top: height * .83 }}>
          {pages.map((_, i) => { // the _ just means we won't use that parameter
            let op = position.interpolate({
              inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
              outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
              // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
              // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
              extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
            });
            return (
              <Animated.View // we will animate the opacity of the dots later, so use Animated.View instead of View here
                key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                style={{ height: 8, width: 8, backgroundColor: color.lightPink, margin: 4, borderRadius: 5 }}
              />
            );
          })}

        </View>
        <View style={{ flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "space-evenly", position: "absolute", top: height * .89 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUp")}>
            <View style={styles.buttonView}>
              <Text allowFontScaling={false} style={styles.buttonText}>SIGN UP</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}>
            <View style={styles.buttonView}>
              <Text allowFontScaling={false} style={styles.buttonText}>LOG IN</Text>
            </View>
          </TouchableOpacity>
        </View>


      </View>
    );
  }

}

const styles = {

  primaryText: {
    width: 220,
    height: 24,
    fontFamily: "Sofia Pro",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff"
  },
  secondaryText: {
    width: 270,
    height: 44,
    fontFamily: "Sofia Pro",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff"
  },
  buttonView: {
    width: 150,
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
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    width: 62,
    height: 15,
    fontFamily: "Sofia Pro",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  largeText: {
    width: width,
    height: 24,
    fontFamily: "Sofia Pro",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 10
  },
  smallText: {
    width: width - width * .10,
    height: 90,
    fontFamily: "Sofia Pro",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  }
}

export default Welcome;