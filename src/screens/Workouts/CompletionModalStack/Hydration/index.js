import React from "react";
import { connect } from "react-redux";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../../../components/common";
import Hydration from "./Hydration";
import { saveBottleCount } from "../../../../actions";

const WrappedHydration = plainModalHeaderWrapper(Hydration);

const HydrationWrapper = props => {

  const { onClose, visible } = props;
  const headerProps = {
    headerText: "",
    onClose,
    closeButtonType: "pink",
    containerViewStyle: {
      backgroundColor: "white"
    }
  };

  const onLogPress = count => {
    if (count === 0){
      alert("Nothing to log")
      return
    }

    props.saveBottleCount(count);

    onClose();
  }

  const passedProps = {
    ...props,
    onLogPress
  };

  return (
    <Modal onRequestClose={() => ""} visible={visible}>
      <SafeAreaView style={{flex: 1}} forceInset={{top: "always", bottom: "always"}}>
        <WrappedHydration headerProps={headerProps} {...passedProps} />
      </SafeAreaView>
    </Modal>
  );
};

export default connect(null, { saveBottleCount })(HydrationWrapper);