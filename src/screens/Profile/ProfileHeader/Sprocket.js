import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

export default props => {
  const { onPress } = props;

  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Image style={{ marginLeft: 10 }} source={require("../images/iconSettings.png")} />
      </TouchableOpacity>
    </View>
  );
}