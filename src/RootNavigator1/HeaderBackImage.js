import React from "react";
import { Image } from "react-native";


export default () => {
  const source = require('./../RootNavigator/images/iconBackArrow.png');

  return (
    <Image
      source={source}
      style={{backgroundColor:"transparent", marginLeft: 13}}
    />
  );
}