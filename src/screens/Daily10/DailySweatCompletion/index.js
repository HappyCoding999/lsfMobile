import React, { Component } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import DailySweatCompletion from "./DailySweatCompletion";
import { plainModalHeaderWrapper } from "../../../components/common";
import { color } from "../../../modules/styles/theme";

const WrappedDailySweatCompletion =
  plainModalHeaderWrapper(DailySweatCompletion);

const headerProps = {
  closeButtonType: "white",
  headerText: "LSF DAILY 10",
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
  state = {
    showSubscriptionsModal: false,
    showDailySweatCompletionModal: false,
  };

  render() {
    const { visible, onClose, animType, endScreen } = this.props;
    const { showSubscriptionsModal } = this.state;
    const dailySweatHeaderProps = {
      ...headerProps,
      onClose,
    };

    return (
      <Modal
        onRequestClose={() => ""}
        visible={visible}
        animationType={animType || "slide"}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "transparent" }}
          forceInset={{ top: "always" }}
        >
          <DailySweatCompletion
            headerProps={dailySweatHeaderProps}
            navigation={this.props.navigation}
            close={onClose}
            onButtonPress={this._openSubscriptionModal}
            endScreen={endScreen}
          />
        </SafeAreaView>
        {/* <Subscriptions visible={showSubscriptionsModal} onClose={this._closeSubscriptionModal} /> */}
      </Modal>
    );
  }

  _openSubscriptionModal = () => {
    this.setState({
      showSubscriptionsModal: true,
      showDailySweatCompletionModal: false,
    });
  };

  _closeSubscriptionModal = () => {
    this.setState({
      showSubscriptionsModal: false,
    });
  };
}
