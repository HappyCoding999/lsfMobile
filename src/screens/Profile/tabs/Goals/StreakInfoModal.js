import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { modalOverlayWrapper } from "../../../../components/common";
import { color } from "../../../../modules/styles/theme";
import closeButton from "../../images/iconCircleclose.png";

const msg = "Your Sweat Streaks show you how many consecutive days you have worked out or self cared. It also tracks your total weeks in LSF The App!";

const StreakInfoModal = props => {
  const { onClose } = props;
  const { container, imgContainer, subtitle } = styles;
  const { height, width } = Dimensions.get("window");
  const containerStyle = {
    ...container,
    width: (0.9 * width),
    height: (0.5 * height)
  };
  const imgContainerStyle = {
    ...imgContainer,
    top: -15,
    left: (0.8 * width)
  }

  return (
    <View style={containerStyle}>
      <Text allowFontScaling={false} style={subtitle}>
        {msg} 
      </Text>
      <View style={imgContainerStyle}>
        <TouchableOpacity activeOpacity={1} onPress={onClose}>
          <Image source={closeButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  imgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1
  },
  subtitle: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
    textAlign: "center",
    padding: 20,
    marginBottom: 20
  }
};

export default modalOverlayWrapper(StreakInfoModal);