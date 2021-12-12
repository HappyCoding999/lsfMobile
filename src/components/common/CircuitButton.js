import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import theme, { color } from '../../modules/styles/theme';

const CircuitButton = (props) => {
    return (
        <View style={style.container}>
            <View style = {style.mask}>
                <TouchableHighlight 
                    onPress= {props.onPress}>
                    <Text>
                        {props.children}
                    </Text>
            </TouchableHighlight>
            </View>
        </View>
    )
  }

const style = StyleSheet.create({
    container: {
        width: 155,
        height: 108,
    },
    mask: {
        width: 135,
        height: 88,
        borderRadius: 4,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(207, 207, 207, 0.5)",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 12,
        shadowOpacity: 1
    }
  
  })

  export default CircuitButton;