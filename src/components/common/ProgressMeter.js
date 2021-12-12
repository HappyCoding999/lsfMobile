import React from "react";
import { Text } from "react-native";
import ProgressCircle from "react-native-progress-circle";
import { color } from "../../modules/styles/theme";

export function PlainCircleMeter({ fill }) {
  if (fill > 1 || fill < 0) { 
    throw new Error("fill must be between 0 and 1 for a PlainCircleMeter");
  }

  const percent = Math.floor(fill * 100)

  const styles = {
    percentStyle: {
      fontFamily: "SF Pro Text",
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal",
      lineHeight: 15,
      letterSpacing: 0.5,
      textAlign: "center",
      color: color.black
    }
  };

  return (
    <ProgressCircle 
      percent={percent}
      radius={35}
      shadowColor="#d6e7ff"
      color={color.skyBlue}
      borderWidth={8}
      bgColor="white"
    >
      <Text allowFontScaling={false} style={styles.percentStyle}>{percent}%</Text>
    </ProgressCircle>
  );
}
