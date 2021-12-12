import React from "react";
import { Image,View } from "react-native";


export default () => {
  const source = require('./../RootNavigator/images/iconBackArrowWhite.png');

  return (
  	<View style={{margin: 10,marginLeft: 5,width:50,height:50,justifyContent:"center",alignItems:"center"}}>
    <Image
      source={source}
      style={{backgroundColor:"transperant"}}
    />
    </View>
  );
}