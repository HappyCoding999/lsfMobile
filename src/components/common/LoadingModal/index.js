import React from "react";
import { View, Image, ActivityIndicator, Text, Modal } from "react-native";
import lsfLogo from "./images/lsfLoadingLogo.png";
import { color } from "../../../modules/styles/theme";

export const LSFSpinner = () => (
  <ActivityIndicator
    animating={true}
    color={color.lightPink}
    size={"large"}
  />
);


export const LoadingComponent = () => {
  return (
    <View style={{ width: "100%", flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", flexDirection: "column" }}>
      <Image style={{ marginBottom: 20, height: 62, width: 62, resizeMode: 'contain' }} source={lsfLogo} />
      <LSFSpinner />
      <Text style={styles.modalText}>LOADING ...</Text>
    </View>
  );
};

export const LoadingModal = props => {
  const { visible } = props;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      backgroundColor="#fff"
      onRequestClose={() => ""}
    >
      <LoadingComponent />
    </Modal>
  );
};

// export const LoadingModal = props => {
//   const { visible } = props;

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       backgroundColor="#fff"
//       onRequestClose={() => ""}
//     >
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", flexDirection: "column" }}>
//         <Image style={{ marginBottom: 20 }} source={pineapple} />
//         <ActivityIndicator
//           animating={true}
//           color={color.lightPink}
//           size={"large"}
//         />
//         <Text style={styles.modalText}>LOADING ...</Text>
//       </View>
//     </Modal>
//   );
// };

const styles = {
  modalText: {
    width: "80%",
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.lightPink,
    textAlign: "center",
    marginTop: 20
  }
};