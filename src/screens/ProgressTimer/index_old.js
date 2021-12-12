import React from "react";
import { Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../components/common";
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
      <SafeAreaView style={{ flex: 0, backgroundColor: colors[0] }} forceInset={{ top: "always" }} />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors[1] }}
        forceInset={{ bottom: "always" }}
      >
        <LinearGradient colors={colors} style={styles.container}>
          <WrappedProgressTimer headerProps={headerProps} {...props} />
        </LinearGradient>
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
