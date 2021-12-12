import React, { Component } from "react";
import { Animated, Easing } from "react-native";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import measurements from "../../../DataStore/ServiceWrappers/AchievementsServiceWrapper/measurementAchievements/measurements";
import { colorNew } from "../../../modules/styles/theme";
import MeasurementsForm from "./MeasurementsForm";
import SignUpForm from "./SignUpForm";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class OnboardingForms extends Component {
  constructor(props) {
    super(props);
    this.measurementFormTransition = new Animated.Value(0);
    this.signupFormTransition = new Animated.Value(0);

    this.state = {
      measurementProps: {},
      page: "SignUpForm",
    };
  }

  onShowMeasurementsForm = (measurementProps) => {
    this.setState({ measurementProps, page: "MeasurementsForm" });

    Animated.timing(this.signupFormTransition, {
      toValue: 1,
      duration: 250,
      easing: Easing.ease,
    }).start();
    Animated.timing(this.measurementFormTransition, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      delay: 150,
    }).start();
  };

  render() {
    const { containerStyle, formStyle } = styles;
    const { measurementProps, page } = this.state;

    const colors = [colorNew.darkPink, colorNew.lightPink];
    const measurementFormTransitionStyle = {
      opacity: this.measurementFormTransition.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this.measurementFormTransition.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
    };
    const signupFormTransitionStyle = {
      opacity: this.signupFormTransition.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      transform: [
        {
          scale: this.signupFormTransition.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.9],
          }),
        },
      ],
    };

    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={colors}
        style={containerStyle}
      >
        <Animated.View
          style={[formStyle, { ...measurementFormTransitionStyle }]}
          pointerEvents={page == "SignUpForm" ? "none" : "auto"}
        >
          <MeasurementsForm
            {...this.props}
            {...measurementProps}
            displaying={page == "MeasurementsForm"}
          />
        </Animated.View>
        <Animated.View
          style={[formStyle, { ...signupFormTransitionStyle }]}
          pointerEvents={page == "MeasurementsForm" ? "none" : "auto"}
        >
          <SignUpForm
            {...this.props}
            onShowMeasurementsForm={this.onShowMeasurementsForm}
          />
        </Animated.View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  formStyle: {
    flex: 1,
    position: "absolute",
  },
});
