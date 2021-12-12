import React, { Component } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../../../components/common";
import WhatsNext from "./WhatsNext";
import { color, colorNew } from "../../../../modules/styles/theme";

export default class extends Component {
  shouldComponentUpdate(newProps) {
    // const { visible } = this.props;
    return this.props.visible !== newProps.visible;
  }

  render() {
    const {
      headerText,
      shift,
      visible,
      onBonusChallengePressed,
      onJournalPressed,
      onTrophiePressed,
      onShopClicked,
      close,
      onStretchPressed,
    } = this.props;

    const headerProps = {
      headerText,
      onClose: shift,
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

    const WrappedWhatsNext = plainModalHeaderWrapper(WhatsNext);

    return (
      <Modal visible={visible} onRequestClose={() => ""}>
        <WhatsNext
          headerProps={headerProps}
          skipPressed={shift}
          onBonusChallengePressed={onBonusChallengePressed}
          onStretchPressed={onStretchPressed}
          onJournalPressed={onJournalPressed}
          onTrophiePressed={onTrophiePressed}
          onShopClicked={onShopClicked}
          close={close}
          screenProps={this.props.screenProps}
        />
      </Modal>
    );
  }
}
