import React from "react";
import { Image, View, Text } from "react-native";
import { color as colors } from "../../modules/styles/theme";

const styles = {
  container: {
    width: 169,
    height: 75,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 75,
    letterSpacing: 0,
    textAlign: "center",
    color: colors.hotPink,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.3)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 12,
    shadowOpacity: 1,
    elevation: 3
  }
};

const Card = props => {
  const { containerStyle, children } = props;
  const container = { ...styles.container, ...containerStyle };

  return (
    <View style={container}>
      {children}  
    </View>
  );
};

export { Card };