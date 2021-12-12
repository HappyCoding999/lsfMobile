import React from 'react';
import ProgressPhotoBuilder from "./ProgressPhotoBuilder";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import whiteLSFModalHeaderWrapper from "../../components/common/ModalHeaderWrapper/WhiteLSFModalHeaderWrapper";

import { color,colorNew } from "../../modules/styles/theme";

const WrappedProgressPhotoBuilder = whiteLSFModalHeaderWrapper(ProgressPhotoBuilder);


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

export default props => {
  const { onClose, savePurchase } = props;
  const passedHeaderProps = {
    ...headerProps,
    onClose
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorNew.lightPink }} forceInset={{ top: "never" }}>
      <ProgressPhotoBuilder {...props} onClose={onClose}/>
    </SafeAreaView>
  );
}