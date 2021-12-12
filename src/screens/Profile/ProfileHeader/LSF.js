import React from "react";
import { Image } from "react-native";

export default () => {

  return (
    <Image style={{ resizeMode: 'contain', width: 260, marginTop: 17, marginRight: 20 }} source={require("../images/lsfFullLogo.png")} />
  )
};