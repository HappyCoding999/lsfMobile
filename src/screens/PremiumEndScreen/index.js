import React, { Component } from "react";
import PremiumEndScreen from "./PremiumEndScreen";
import { Image, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { color } from "../../modules/styles/theme";
import { logo_white_love_seat_fitness} from "../../images";
import { getWorkoutEndscreens,getWorkoutEndscreensSquare } from '../../DataStore'

let endScreens = {}
getWorkoutEndscreens().then(screens => {
  endScreens = screens;
});
let endScreensSquare = {}
getWorkoutEndscreensSquare().then(screens => {
  endScreensSquare = screens;
});
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
  const { onClose, visible, animType,safeAreaBG,shift,title,day } = this.props;
  const safeBG = safeAreaBG == null ? "#fff" : safeAreaBG
  const passedHeaderProps = {
    ...headerProps,
    shift,
    onClose,
    day,
    title
  }
    return (
      <Modal onRequestClose={() => ""} visible={visible} animationType={animType || "slide"}>
        <SafeAreaView style={{ flex: 1, backgroundColor: safeBG }} forceInset={{ top: "always" }}>
          <PremiumEndScreen endScreens={endScreens} endScreensSquare={endScreensSquare} headerProps={passedHeaderProps} onClose={shift}/>
        </SafeAreaView>
      </Modal>
    );
  }
}