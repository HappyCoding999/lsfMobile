import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { EventRegister } from "react-native-event-listeners";

export default props => {
  const { width, height, uri, onPress, active } = props;
  const _onPress = () => {
    onPress();
  };
  const source = uri;
  console.log("Photo source")
  console.log(source)
  return (
    <View style={{backgroundColor:"#fff"}}>
      <TouchableOpacity activeOpacity={1} onPress={_onPress}>
        <Image source={{uri:source}} style={{ width, height }} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};