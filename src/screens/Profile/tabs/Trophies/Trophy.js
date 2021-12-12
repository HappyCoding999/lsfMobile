import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import pineapple from "./images/illustrationPineapplechekmarkCopy.png";
import hiddenTrophy from './images/hiddenTrophy.png';

export default props => {
  const { width, height, uri, onPress, active } = props;
  const _onPress = () => {
    console.log("trophy pressed!")
    // if (active) {
      onPress();
    // }
  };
  // const source = active ? { uri } : hiddenTrophy;
  const source = uri ? { uri } : hiddenTrophy;;

  return (
    <View>
      <TouchableOpacity activeOpacity={1} onPress={() => EventRegister.emit("paywallEvent", _onPress)}>
        <Image source={source} style={{ width, height }} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};