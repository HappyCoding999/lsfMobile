import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import {
  modalOverlayWrapper,
  Incrementer,
  LargeButton,
} from "../../../../components/common";
import { color } from "../../../../modules/styles/theme";
import closeButton from "../images/iconCircleclose.png";

const NewGoal = (props) => {
  const {
    onClose,
    onSave,
    onGoalWeightChange,
    onCurrentWeightChange,
    onStartingWeightChange,
    currentWeight,
    startingWeight,
    goalWeight,
  } = props;

  const { container, header, subtitle, imgContainer } = styles;
  const { height, width } = Dimensions.get("window");
  const containerStyle = {
    ...container,
    width: 0.9 * width,
    height: 0.8 * height,
  };
  const imgContainerStyle = {
    ...imgContainer,
    top: -15,
    left: 0.8 * width,
  };

  return (
    <View style={containerStyle}>
      <Text allowFontScaling={false} style={header}>
        Update your stats:{" "}
      </Text>
      <Text allowFontScaling={false} style={subtitle}>
        Starting weight in pounds:{" "}
      </Text>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
        <Incrementer
          width={200}
          onCountChange={onStartingWeightChange}
          initialCount={startingWeight}
        />
      </View>
      <Text allowFontScaling={false} style={subtitle}>
        Current weight in pounds:{" "}
      </Text>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
        <Incrementer
          width={200}
          onCountChange={onCurrentWeightChange}
          initialCount={currentWeight}
        />
      </View>
      <Text allowFontScaling={false} style={subtitle}>
        Goal weight in pounds:{" "}
      </Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Incrementer
          width={200}
          onCountChange={onGoalWeightChange}
          initialCount={goalWeight}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <LargeButton onPress={onSave}>SAVE GOAL</LargeButton>
      </View>

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
    backgroundColor: "white",
  },
  imgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  header: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 15,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
    marginBottom: 20,
  },
  content: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
  },
  item: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
  },
};

export default modalOverlayWrapper(NewGoal);
