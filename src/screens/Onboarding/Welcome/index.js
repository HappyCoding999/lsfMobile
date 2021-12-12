import React, { Component } from "react";
import Login from "../Login";
import Features from "../Features";
import SignUp from "../SignUp";
import Welcome from "./Welcome";
import { createStackNavigator } from "react-navigation";
import { Image, View } from "react-native";
import NewEntry from "../../Profile/tabs/Tracking/NewEntry";
import Forgot from "../Forgot";
import OnboardingForms from "../SignUp/OnboardingForms";
import HowItWorksScreen from "./HowItWorksScreen";

class HeaderBackImageWhite extends Component {
  render() {
    const source = require("./../SignUp/images/iconBackArrowWhite.png");
    return (
      <Image
        source={source}
        style={{ backgroundColor: "transparent", marginLeft: 13 }}
      />
    );
  }
}

class HeaderBackImagePink extends Component {
  render() {
    const source = require("../Welcome/images/iconBackArrow.png");
    return (
      <Image
        source={source}
        style={{ backgroundColor: "transparent", marginLeft: 13 }}
      />
    );
  }
}

export default class extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authSuccess } = this.props;

    const StackNavigator = createStackNavigator({
      Welcome: {
        screen: Welcome,
        navigationOptions: {
          header: null,
        },
      },
      SignUp: {
        screen: SignUp,
        navigationOptions: () => ({
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerTitle: "",
          headerTitleAllowFontScaling: false,
        }),
      },
      OnboardingForms: {
        screen: (screenProps) => (
          <OnboardingForms onSignupSuccess={authSuccess} {...screenProps} />
        ),
        navigationOptions: () => ({
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerTitle: "",
          headerTitleAllowFontScaling: false,
        }),
      },
      NewEntry: {
        screen: NewEntry,
      },
      Login: {
        screen: (screenProps) => (
          <Login onLoginSuccess={authSuccess} {...screenProps} />
        ),
        navigationOptions: () => ({
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerTitle: "",
          headerTitleAllowFontScaling: false,
        }),
      },
      Features: {
        screen: (screenProps) => <Features {...screenProps} />,
        navigationOptions: () => ({
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImageWhite />,
          headerBackTitle: null,
          headerTitle: "",
          headerTitleAllowFontScaling: false,
        }),
      },
      Forgot: {
        screen: Forgot,
        navigationOptions: () => ({
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <HeaderBackImagePink />,
          headerBackTitle: null,
          headerTitle: "RECOVER PASSWORD",
          headerTitleAllowFontScaling: false,
        }),
      },
      HowItWorks: {
        screen: (screenProps) => (
          <HowItWorksScreen visible={true} {...screenProps} />
        ),
        navigationOptions: () => ({
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerBackImage: <View />,
          headerBackTitle: null,
          headerTitle: "",
          headerTitleAllowFontScaling: false,
        }),
      },
    });

    return <StackNavigator />;
  }
}
