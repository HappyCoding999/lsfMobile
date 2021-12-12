import React from "react";
import { View } from "react-native";

const Sticker = props => {
  const container = {...styles.container, ...props.style}
  return (
    <View style={container}>
      {props.children}
    </View>
  );
};

const styles = {
  container: {
    width: 90,
    height: 90,
    borderRadius: 45,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
}

export { Sticker };