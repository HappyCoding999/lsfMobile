import React from 'react';
import Subscriptions from "./Subscriptions";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import plainModalHeaderWrapper from "../ModalHeaderWrapper/PlainModalHeaderWrapper";
import whiteLSFModalHeaderWrapper from "../ModalHeaderWrapper/WhiteLSFModalHeaderWrapper";
import { headerWrapper } from "../ModalHeaderWrapper";


import { color,colorNew } from "../../../modules/styles/theme";

const WrappedSubscriptions = whiteLSFModalHeaderWrapper(Subscriptions);


const headerProps = {
  closeButtonType: "white",
  headerTitle: (
        <Image style={{ width: '100%',top:0}} resizeMode="contain" source={require('./images/logo_white_love_seat_fitness.png')} />
      ),
  containerViewStyle: {
    backgroundColor: "transparent",
    zIndex: 1
  },
  headerTransparent: true,
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

export default props => {
  const { onClose, savePurchase,screenProps } = props;
  const passedHeaderProps = {
    ...headerProps,
    onClose
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} forceInset={{ top: "always" }}>
      <Subscriptions headerProps={passedHeaderProps} screenProps={screenProps} onClose={onClose} savePurchase={savePurchase}/>
    </SafeAreaView>
  );
}