import React, { Component } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../../../components/common";
// import SweatLog from "./SweatLog";
import SweatLog from "../../../../screens/Journal/SweatLog";
import { color, colorNew } from "../../../../modules/styles/theme";

export default class extends Component {
  state = {
    visible: false,
  };

  render() {
    const { headerText, visible, logButtonPressed, shift, isForEdit } =
      this.props;
    const headerProps = {
      onClose: shift,
      isForEdit,
      workout: isForEdit ? [] : this.props.workout ? this.props.workout : [],
      sweatLog: isForEdit ? this.props.sweatLog : [],
      logButtonPressed,
      headerText,
      closeButtonType: "pink",
      containerViewStyle: {
        backgroundColor: "white",
      },
      headerTextStyle: {
        height: 24,
        fontFamily: "SF Pro Text",
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 1,
        textAlign: "center",
        color: color.hotPink,
        width: 220,
      },
    };

    const WrappedSweatLog = plainModalHeaderWrapper(SweatLog);
    /*<WrappedSweatLog headerProps={headerProps} logButtonPressed={logButtonPressed} />*/
    return (
      <Modal visible={visible} onRequestClose={() => ""}>
        <SweatLog
          headerProps={headerProps}
          logButtonPressed={logButtonPressed}
          needToDisplayInModal={true}
        />
      </Modal>
    );
  }
}
