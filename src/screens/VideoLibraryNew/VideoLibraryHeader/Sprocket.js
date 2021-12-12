import React from "react";
import { View, Image, TouchableOpacity } from "react-native";

export default props => {
  const { onPress } = props;

  return (
    <View style={{alignItems: "center",justifyContent: "center",margin:20,width:20,height:20,backgroundColor:"#808185",borderColor: "#000",borderWidth: 1}}>

      <TouchableOpacity onPress={onPress}>
      </TouchableOpacity>
    </View>
  );
}