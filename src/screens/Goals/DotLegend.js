import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { color } from "../../modules/styles/theme";

export class DotLegend extends Component {
    
    render() {
        const { calendarDetailViewContainer, dotStyle, calenderDetailText } = styles
        const { text, containerStyle, dotColor, dotStyle: propsDotStyle } = this.props
        
        return(
            <View style={[calendarDetailViewContainer, containerStyle ]}>
                <View style={[dotStyle, { backgroundColor: dotColor, borderColor: dotColor }, propsDotStyle]}>
                </View> 
                <Text allowFontScaling={false} style={calenderDetailText}>{text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    calendarDetailViewContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        height: "100%",
        width: "25%",
        paddingLeft:3,
        paddingRight:3
    },
    dotStyle: {
        alignItems: "center", 
        height: 20, 
        width: 20, 
        borderRadius: 10,
        borderWidth: 1,
    },
    calenderDetailText: {
      fontFamily: "SF Pro Text",
      fontWeight: "normal",
      fontSize: 8,
      lineHeight: 10,
      textAlign: "center",
      fontStyle: "normal",
      color: color.mediumGrey,
      paddingLeft: 5,
      paddingRight: 5,
    },
})