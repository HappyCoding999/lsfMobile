import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { color,colorNew } from '../../modules/styles/theme';
import LinearGradient from "react-native-linear-gradient";


const LargeGradientButton = (props) => {
    const containerStyle = {...buttonStyle.container, ...props.containerStyle};
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    return (
        <View style = {containerStyle}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={colors}
          style={buttonStyle.linearGradient}>
            <TouchableHighlight 
                style = {buttonStyle.buttonView}
                onPress= {props.onPress}
                underlayColor = {'#ee90af'}>
                    <Text allowFontScaling={false} style = {buttonStyle.text}>
                      {props.children}
                    </Text>
            </TouchableHighlight>
          </LinearGradient>
      </View>
    )
  }

const buttonStyle = StyleSheet.create({
    container: {
      flex: 0,
      justifyContent: 'center',
      alignItems: 'center'
    },
    linearGradient: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    paddingRight: 12,
    margin: 20
  },
    buttonView:{
      width: 315,
      height: 48,
      borderRadius: 100,
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
      width: 315,
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

  export { LargeGradientButton };