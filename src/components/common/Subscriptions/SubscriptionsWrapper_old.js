import React from 'react';
import Subscriptions from "./Subscriptions";
import { SafeAreaView } from "react-navigation";
import plainModalHeaderWrapper from "../ModalHeaderWrapper/PlainModalHeaderWrapper";
import { color } from "../../../modules/styles/theme";

const WrappedSubscriptions = plainModalHeaderWrapper(Subscriptions);

const headerProps = {
  closeButtonType: "white",
  headerText: "PREMIUM ACCESS",
  containerViewStyle: {
    backgroundColor: "#f493a7",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f493a7" }} forceInset={{ top: "always" }}>
      <WrappedSubscriptions headerProps={passedHeaderProps} onClose={onClose} savePurchase={savePurchase}/>
    </SafeAreaView>
  );
}