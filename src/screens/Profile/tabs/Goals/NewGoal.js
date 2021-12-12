import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import plus from "./../Tracking/Measurements/images/addButton.png";
import { color } from "../../../../modules/styles/theme";

export default props => {
  const { text, onPress } = props;
  const { container, addButton, textStyle } = styles;

  return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => EventRegister.emit("paywallEvent", onPress)}>
      <View style={container}>
        <View style={addButton}>
          <Image source={plus} />
        </View>
      <Text allowFontScaling={false} style={textStyle}>
        {text}
      </Text>
      </View>
      </TouchableOpacity>
  )
};


const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 120,
    width: 335,
    borderRadius: 4,
    backgroundColor: "#fff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    elevation: 3,
    padding: 20,
    marginLeft: 10,
    maringRight: 8
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: color.mediumPink
  },
  textStyle: {
    width: 141,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    color: color.mediumPink,
    marginTop: 2
  }
};