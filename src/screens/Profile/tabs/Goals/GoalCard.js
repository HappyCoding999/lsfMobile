import React from "react";
import { View, Text } from "react-native";
import { color } from "../../../../modules/styles/theme";

export default props => {
  const { progressComponent: Progress, stickerComponent: Sticker, title, subtitle } = props;

  const { 
    container, 
    textContainer,
    titleStyle,
    subtitleStyle,
    progressContainer,
    stickerContainer
  } = styles;

  return (
    <View style={container}>
      <View style={stickerContainer}>
        <Sticker />
      </View>
      <View style={textContainer}>
        <Text allowFontScaling={false} style={titleStyle}>{title}</Text>
        <Text allowFontScaling={false} style={subtitleStyle}>{subtitle}</Text>
      </View>
      { Progress ? 
        <View style={progressContainer}>
          <View style={{marginRight: 5}}>
            <Progress />
          </View> 
        </View>
        :
        <View style={progressContainer} />
      }
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    padding: 0,
    marginLeft: 10
  },
  stickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
    width: 70,
    height: 75
  },
  textContainer: {
    justifyContent: "center"
  },
  titleStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0.5,
    color: color.black
  },
  subtitleStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black 
  },
  progressContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end"
  }
};