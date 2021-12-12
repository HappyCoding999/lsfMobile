import React from "react";
import { View, Modal } from "react-native";

const modalOverlayWrapper = ComposedComponent => props => {
  const { visible } = props;
  const { window } = styles;

  return (
    <Modal visible={visible}
      onRequestClose={() => ""} 
      transparent={true}
      animationType="fade"
    >
      <View style={window}>
        <ComposedComponent {...props} />
      </View>
    </Modal>
  );
};

const styles = {
  window: {
    backgroundColor: "#00000080",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
};

export { modalOverlayWrapper };