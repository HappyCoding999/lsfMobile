import React from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../../../components/common";
import Selfie from "./Selfie";
import {color} from "../../../../modules/styles/theme"

const WrappedSelfie = plainModalHeaderWrapper(Selfie);

export default props => {
  const { visible, onClose } = props;
  const headerProps = {
    // headerText: "SHARE IT!",
    headerText: "SWEATY SELFIE!",
    closeButtonType: "pink",
    onClose,
    containerViewStyle: {
      backgroundColor: "white"
    },
    headerTextStyle:{
      height: 24,
      fontFamily: "SF Pro Text",
      fontSize: 15,
      fontWeight: "bold",
      fontStyle: "normal",
      lineHeight: 24,
      letterSpacing: 1,
      textAlign: "center",
      color: color.hotPink,
      width: 220

    }
  };

  return (
    <Modal onRequestClose={() => ""} visible={visible} animationType="slide">
      <SafeAreaView style={{flex: 1}} forceInset={{top: "always"}} >
        <Selfie headerProps={headerProps} {...props} />
      </SafeAreaView>
    </Modal>
  );
};