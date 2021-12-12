import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper,TransparentHeader } from "../../components/common";
import SelfCareLog from "./SelfCareLog";
import { color,colorNew } from "../../modules/styles/theme";
import { skipWorkout } from "../../actions";

const WrappedSelfCareLog = plainModalHeaderWrapper(SelfCareLog);
const headerProps = {
  headerText: "SELF CARE",
  containerViewStyle: {
    backgroundColor: "transparent",
    height: 60
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
    color: "#fff",
    width: 220
  }
};


class SelfCareWrapper extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { visible, onClose, animType, onLogPressed, itemData, skipWorkout } = this.props;
    const wrappedSkipWorkout = () => skipWorkout(itemData)
      .then(onClose)

    const passedProps = {
      onLogPressed,
      onClose,
      onSkipPress: itemData && itemData.isToday ? wrappedSkipWorkout : null
    };

    return (
      <Modal visible={visible} onRequestClose={() => ""} animationType={animType || "slide"}>
        <SafeAreaView style={{flex: 1,backgroundColor:"#fff"}} forceInset={{ top: "never",bottom: 'never'}} >
          <SelfCareLog
            headerProps={{...headerProps, onClose}} 
            {...passedProps}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  skipWorkout
};

export default connect(null, mapDispatchToProps)(SelfCareWrapper);