import React, { Component } from "react";
import { View, Platform, Animated, Dimensions } from "react-native";
import Video from "react-native-video";
import LottieView from "lottie-react-native";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");
// import splashScreenAnimation from '../../../animations/splashScreenAnimation';
import splashScreenAnimation1 from "../../../animations/splashScreenAnimation1";
import { color, colorNew } from "../../../modules/styles/theme";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }
  componentDidMount() {
    if (Platform.OS === "ios") {
    } else {
      // setTimeout(() => {this.animation.play(0,130)}, 100);
      // setTimeout(() => {this.animation.play()}, 500);
    }
  }
  render() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    return (
      <View
        style={[
          styles.container,
          { width: width, backgroundColor: color.mediumPink },
        ]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={colors}
          style={styles.linearGradient}
        >
          {this.renderAnimation()}
        </LinearGradient>
      </View>
    );
  }
  animationFinished() {
    console.log("animationFinished called");
    // setTimeout(() => {this.props.onCompletion()}, 100);
    this.props.onCompletion();
  }
  renderAnimation() {
    const animatedViewStyle = {
      ...styles.animatedView,
      ...this.props.animatedView,
    };
    return (
      <LottieView
        ref={(animation) => {
          this.animation = animation;
        }}
        autoPlay
        resizeMode="cover"
        loop={false}
        style={animatedViewStyle}
        source={splashScreenAnimation1}
        onAnimationFinish={() => this.animationFinished()}
      />
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  animatedView: {
    width: "100%",
  },
};

export default Loading;
