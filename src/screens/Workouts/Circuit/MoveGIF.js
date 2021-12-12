import React from "react";
import { View, Text } from "react-native";
import { Card } from "../../../components/common";
import { color as colors } from "../../../modules/styles/theme";

export default props => {
  const { number, name, instructions, gifUrl } = props;

  const { 
    container, 
    cardContainer, 
    infoContainer, 
    sticker, 
    text,
    numberStyle
  } = styles;

  return (
    <View style={container}>
      <Card containerStyle={cardContainer}>
        <View style={sticker}>
          <Text allowFontScaling={false} style={numberStyle}>{number}</Text>
        </View>
        <Text>{gifUrl}</Text>
      </Card>
      <View style={infoContainer}>
        <Text allowFontScaling={false} style={text}>{name}</Text>
        <Text allowFontScaling={false} style={text}>{instructions}</Text>
      </View>
    </View>
  );
};

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardContainer: {
    height: 135.4,
    width: 135.4,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10
  },
  sticker: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: colors.mediumPink,
    borderRadius: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  gif: {
    height: 120,
    width: 120
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: colors.black
  },
  numberStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  }
};