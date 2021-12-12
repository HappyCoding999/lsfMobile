import React from "react";
import { Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../components/common";
import { color,colorNew} from "../../modules/styles/theme"
import ProgressTimer from "../ProgressTimer/ProgressTimer";
const WrappedProgressTimer = plainModalHeaderWrapper(ProgressTimer);

export default props => {
  const { visible, headerText, onClose } = props;
  const colors = ["#FFCBE5", "#F74D91"];
  const headerProps = {
      onClose,
      headerText: "",
      withInfo: false,
      closeButtonType: "pink",
      containerViewStyle: {zIndex:1, marginTop:18},
      headerTextStyle: {  
        width: 200,
        height: 24,
        fontFamily: "SF Pro Text",
        fontSize: 15,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 1,
        textAlign: "center",
        color: color.hotPink}
    };


  return (
    <Modal visible={visible} onRequestClose={() => console.log("modal closed")}
      animationType="slide"
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff" }}
        forceInset={{ bottom: "always" }}
      >
      <ProgressTimer headerProps={headerProps} {...props} />
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
