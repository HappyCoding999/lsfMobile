import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import star from "../../../animations/star.json";
import { Platform } from "react-native";
import { color } from "../../../modules/styles/theme";

const { width } = Dimensions.get("window");
export class JoinChallengeButton extends Component {
  constructor(props) {
    super(props);
  }

  onButtonPressed = () => {
    if (typeof this.props.onAnimating == "function") {
      this.props.onAnimating();
    }
    this.animation.play();
  };

  onAnimationEnded = () => {
    if (typeof this.props.onButtonPressed == "function") {
      this.props.onButtonPressed();
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
    return (
      <View style={styles.container}>
        <View style={{ height: 350, width: 350, overflow: "hidden" }}>
          <LottieView
            ref={(animation) => {
              this.animation = animation;
            }}
            loop={false}
            style={animatedViewStyle}
            progress={this.props.progress}
            source={star}
            onAnimationFinish={this.onAnimationEnded}
          />
        </View>
        <TouchableOpacity
          style={{
            width: "65%",
            height: 35,
            position: "absolute",
            bottom: 34,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={this.onButtonPressed}
        >
          <Text allowFontScaling={false} style={styles.buttonStyle}>
            Join The Challenge!
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  animatedView: {
    height: 800,
    width: 350,
    top: Platform.select({
      android: -130,
      ios: -88,
    }),
    position: "absolute",
  },
  buttonStyle: {
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
