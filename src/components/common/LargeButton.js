import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { color, colorNew } from "../../modules/styles/theme";

const LargeButton = (props) => {
  const containerStyle = { ...buttonStyle.container, ...props.containerStyle };
  const buttonViewStyle = {
    ...buttonStyle.buttonView,
    ...props.buttonViewStyle,
  };
  return (
    <View style={containerStyle}>
      <TouchableHighlight
        style={buttonViewStyle}
        onPress={props.onPress}
        underlayColor={colorNew.darkPink}
      >
        <Text allowFontScaling={false} style={buttonStyle.text}>
          {props.children}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const buttonStyle = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonView: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: colorNew.darkPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    width: 315,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
});

export { LargeButton };
