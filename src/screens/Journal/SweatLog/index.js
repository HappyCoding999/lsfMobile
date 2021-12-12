import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import whiteLSFModalHeaderWrapper from "../../../components/common/ModalHeaderWrapper/WhiteLSFModalHeaderWrapper";
import SweatLog from "./SweatLog";
import { logo_white_love_seat_fitness } from "../../../images";

const WrappedSweatLog = whiteLSFModalHeaderWrapper(SweatLog);
const headerProps = {
  closeButtonType: "white",
  headerTitle: (
    <Image
      style={{ width: "100%", top: 0 }}
      resizeMode="contain"
      source={logo_white_love_seat_fitness}
    />
  ),
  containerViewStyle: {
    backgroundColor: "transparent",
    zIndex: 1,
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
    color: "white",
    width: 220,
  },
};
export default class extends Component {
  render() {
    console.log("render JournalWrapper in SweatLog ==> vishal");
    const {
      visible,
      onClose,
      headerProps,
      needToDisplayInModal,
      logButtonPressed,
    } = this.props;
    console.log("headerProps");
    const SweatLogHeaderProps = {
      ...headerProps,
      onClose,
    };
    console.log("render JournalWrapper123");
    return (
      <SweatLog
        logButtonPressed={logButtonPressed}
        navigation={this.props.navigation}
        headerProps={this.props.headerProps}
        needToDisplayInModal={needToDisplayInModal}
      />
    );
  }
}
