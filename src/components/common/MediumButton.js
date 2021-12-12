import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight,Dimensions } from 'react-native';
import { color } from '../../modules/styles/theme';

const { width } = Dimensions.get("window");

const MediumButton = (props) => {
    const containerStyle = {...buttonStyle.container, ...props.containerStyle};
    return (
        <View style = {containerStyle}>
            <TouchableHighlight 
                style = {buttonStyle.buttonView}
                onPress= {props.onPress}
                underlayColor = {'#ee90af'}>
                    <Text allowFontScaling={false} style = {buttonStyle.text}>
                      {props.children}
                    </Text>
            </TouchableHighlight>
      </View>
    )
  }

const buttonStyle = StyleSheet.create({
    container: {
      flex: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonView:{
      width: width * 0.7,
      height: 48,
      borderRadius: 100,
      backgroundColor: color.mediumPink,
      shadowColor: "rgba(0, 0, 0, 0.1)",
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 15,
      shadowOpacity: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      width: width * 0.7,
      height: 14,
      fontFamily: "SF Pro Text",
      fontSize: 14,
      fontWeight: "bold",
      fontStyle: "normal",
      lineHeight: 14,
      letterSpacing: 1,
      textAlign: "center",
      color: "#ffffff"
    }
  
  })

  export { MediumButton };