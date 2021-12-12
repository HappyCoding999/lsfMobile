import React, { Component } from "react";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import doneCongratsBubble from "../../../animations/doneCongratsBubble.json";
import doneCongratsConfetti from "../../../animations/doneCongratsConfetti.json";
import doneCongratsDone from "../../../animations/doneCongratsDone.json";
import { Platform } from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";

const { width, height } = Dimensions.get("window");

export class DoneCongratsButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: false,
    };

    this.beginAnimation.bind(this);
  }

  onButtonPressed = () => {
    if (typeof this.props.onButtonPressed == "function") {
      this.props.onButtonPressed();
    }
  };

  beginAnimation = () => {
    this.animation.play();
    setTimeout(() => {
      this.animationConfetti.play();
    }, 300);
    this.setState({ animated: true });
  };

  onAnimationEnded = () => {
    if (typeof this.props.onAnimationEnded == "function") {
      this.props.onAnimationEnded();
    }
  };

  componentDidUpdate(prevProps) {
    const { showAnimated: prevShowAnimated } = prevProps;
    const { showAnimated } = this.props;

    if (
      (!prevShowAnimated || prevShowAnimated == false) &&
      showAnimated == true
    ) {
      this.animation.play();
    } else if (
      prevShowAnimated == true &&
      (!showAnimated || showAnimated == false)
    ) {
      this.animation.reset();
    }
  }
  render() {
    const animatedViewStyle = {
      ...styles.animatedView,
      ...this.props.animatedView,
    };
    const { animated } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.animationContainer,
            { bottom: moderateScale(50, 0.2) },
          ]}
          pointerEvents={!animated ? "none" : "auto"}
        >
          <LottieView
            ref={(animation) => {
              this.animationConfetti = animation;
            }}
            loop={false}
            style={animatedViewStyle}
            progress={this.props.progress}
            source={doneCongratsConfetti}
          />
        </View>
        <View
          style={[styles.animationContainer]}
          pointerEvents={!animated ? "none" : "auto"}
        >
          <LottieView
            ref={(animation) => {
              this.animation = animation;
            }}
            loop={false}
            style={animatedViewStyle}
            progress={this.props.progress}
            source={doneCongratsBubble}
            onAnimationFinish={this.onAnimationEnded}
          />
          <TouchableOpacity
            style={{ position: "absolute", height, width, top: 0, left: 0 }}
            onPress={this.props.onDonePressed}
          />
        </View>
        <View
          style={{
            height: 55,
            width: "100%",
            alignItems: "center",
            marginBottom: Platform.select({ ios: -20, android: 15 }),
            justifyContent: "center",
          }}
        >
          {!animated && (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.onButtonPressed}
            >
              <Text allowFontScaling={false} style={styles.buttonTextStyle}>
                Complete My Account
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 55,
  },
  animationContainer: {
    flex: 1,
    position: "absolute",
    zIndex: 0,
    bottom: Platform.select({
      ios: -18,
      android: 0,
    }),
  },
  animatedView: {
    height: moderateScale(400, 0.2),
  },
  doneAnimatedView: {
    width: 200,
    paddingLeft: 10,
    marginTop: Platform.select({
      ios: 40,
      android: 50,
    }),
    marginLeft: Platform.select({
      ios: -2,
      android: -14,
    }),
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 7,
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextStyle: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
});
