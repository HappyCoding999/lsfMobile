import React from "react";
import { Image, View, Text } from "react-native";
import { color } from "../../../modules/styles/theme";
import { Card } from "../../../components/common";

export default props => {
  const { imageSource } = props;
  const { text, container, imageContainer } = styles;
  return (
    <Card containerStyle={container}>
      <Text allowFontScaling={false} style={text}>Circuit</Text>
      <View style={imageContainer}>
        <Image source={imageSource} />
      </View>
    </Card>
  );
};

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 135,
    height: 88,
    margin: 10
  },
  text: {
    width: 66,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "center",
    color: color.hotPink
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
};