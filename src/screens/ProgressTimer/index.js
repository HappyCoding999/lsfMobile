import React from "react";
import { Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../components/common";
import { color,colorNew} from "../../modules/styles/theme"
import ProgressTimer from "./ProgressTimer";

const WrappedProgressTimer = plainModalHeaderWrapper(ProgressTimer);


export default props => {
  const { visible, headerText, onClose } = props;
  const colors = ["#FFCBE5", "#F74D91"];
  const headerProps = {
    onClose,
    headerText,
    headerTextStyle: {
      fontFamily: "SF Pro Text",
      fontSize: 15,
      fontWeight: "bold",
      fontStyle: "normal",
      letterSpacing: 1,
      textAlign: "center",
      color: "#ffffff",
      width: 220
    },
    containerViewStyle: {
      backgroundColor: "transparent"
    },
    closeButtonType: "white",
  };


  return (
    <Modal visible={visible} onRequestClose={() => console.log("modal closed")}
      animationType="slide"
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colorNew.darkPink }}
        forceInset={{ top:"always", bottom: "never" }}
      >
      <WrappedProgressTimer headerProps={headerProps} {...props} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start"
  }
};
