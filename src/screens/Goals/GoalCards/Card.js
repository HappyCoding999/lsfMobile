import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { verticalScale } from 'react-native-size-matters'

export const Card = (props) => {
    const { container, contents, titleContainer, titleStyle } = styles
    console.log("Card");
    const { title, isForToday, containerStyle, contentContainerStyle, children, titleActionView } = props
    
    return(
        <View style={[container, containerStyle,{marginLeft : isForToday ? '5%' : 0, width: isForToday ? '90%' : '100%'}]}>
            <View style={titleContainer}>
                <Text style={titleStyle}>{title}</Text>
                {titleActionView && titleActionView()}
            </View>
            <View style={[contents, contentContainerStyle]}>
                {children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        width: '100%',
        shadowColor: 'black',
        shadowOffset: { 
            width: 0, 
            height: 5,
        },
        elevation: 8,
        shadowOpacity: 0.15,
        shadowRadius: 5,
        borderRadius: 15,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleStyle: {
        fontWeight: '600',
        fontSize: verticalScale(14),
        marginBottom: 5
    },
    contents: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    }
})