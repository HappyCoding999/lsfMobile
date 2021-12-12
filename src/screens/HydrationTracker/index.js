import React, { Component } from "react";
import HydrationTracker from "./HydrationTracker";
import { Image, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import whiteLSFModalHeaderWrapper from "../../components/common/ModalHeaderWrapper/WhiteLSFModalHeaderWrapper";

import { color } from "../../modules/styles/theme";

const WrappedHydrationTracker = whiteLSFModalHeaderWrapper(HydrationTracker);


const headerProps = {
  closeButtonType: "white",
  headerTitle: (
        <Image style={{ width: '100%',top:0}} resizeMode="contain" source={require('./images/logo_white_love_seat_fitness.png')} />
      ),
  containerViewStyle: {
    backgroundColor: "transparent",
    zIndex: 1
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
    color: 'white',
    width: 220
  }
};

export default class extends Component {
  render() {
    const { onClose, visible, animType } = this.props;
  const passedHeaderProps = {
    ...headerProps,
    onClose
  }
    return (
      <Modal onRequestClose={() => ""} visible={visible} animationType={animType || "slide"}>
        <HydrationTracker screenProps={this.props.screenProps} headerProps={passedHeaderProps} onClose={onClose}/>
      </Modal>
    );
  }
}