import React, { Component } from "react";
import { Modal, View, Text } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../../../components/common";
import Completion from "./Completion";
import { color, colorNew } from "../../../../modules/styles/theme";
import { getWorkoutEndscreens } from "../../../../DataStore";
import { getLatestChallenge } from "../../../../DataStore";

let endScreens = {};
getWorkoutEndscreens().then((screens) => {
  endScreens = screens;
});

export default class extends Component {
  state = {
    visible: false,
    challengeSelfieFrame: null,
  };

  componentDidMount() {
    getLatestChallenge().then((latestChallenge) => {
      this.setState({
        challengeSelfieFrame: latestChallenge.challengeSelfieFrame,
      });
    });
  }

  render() {
    const { title, shift, visible, endScreen, day, challengeActive } =
      this.props;
    const { challengeSelfieFrame } = this.state;

    const headerProps = {
      closeButtonType: "pink",
      headerText: title,
      onClose: shift,
      endScreen: endScreen ? endScreen : null,
      day: day,
      challengeActive: challengeActive,
      challengeSelfieFrame: challengeSelfieFrame,
      headerTextStyle: {
        height: 24,
        fontFamily: "SF Pro Text",
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 1,
        textAlign: "center",
        color: color.textColor,
        width: 220,
      },
    };

    const WrappedCompletion = plainModalHeaderWrapper(Completion);

    return (
      <Modal onRequestClose={() => ""} visible={visible} animationType="none">
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <WrappedCompletion
            endScreens={endScreens}
            headerProps={headerProps}
            onCancelPress={shift}
            {...this.props}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}
