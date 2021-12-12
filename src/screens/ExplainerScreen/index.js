import React, { Component } from "react";
import ExplainerScreen from "./ExplainerScreen";
import { Image, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { color } from "../../modules/styles/theme";
import { logo_white_love_seat_fitness} from "../../images";


const headerProps = {
  closeButtonType: "white",
  headerTitle: (
        <Image style={{ width: '100%',top:0}} resizeMode="contain" source={logo_white_love_seat_fitness} />
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
  const { onClose, visible, animType,safeAreaBG } = this.props;
  const safeBG = safeAreaBG == null ? "#fff" : safeAreaBG
  const passedHeaderProps = {
    ...headerProps,
    onClose
  }
    return (
      <Modal transparent onRequestClose={() => ""} visible={visible} animationType={animType || "slide"}>
        <ExplainerScreen headerProps={passedHeaderProps} onClose={onClose}/>
      </Modal>
    );
  }
}