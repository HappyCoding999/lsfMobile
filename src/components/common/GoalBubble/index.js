import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color } from "../../../modules/styles/theme";

class GoalBubble extends Component {
    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
        this._onLayout = this._onLayout.bind(this);
        this.viewWidth = 0;
        this.state = {
            active: false
        };
    }

    render() {
        const { word } = this.props;
        const { circleOpacity, circleWidth } = this.state;
        const { container, text, circle } = styles;
        const circleStyle = {
            ...circle,
            opacity: circleOpacity,
            width: circleWidth
        };
        let imageHeightWidth = 11;
        return (
            <TouchableOpacity
                style={this.state.active ? styles.bubbleChoiceSelected : styles.bubbleChoiceDefault}
                onPress={this._onPress} activeOpacity={1}>
                <View style={container} onLayout={this._onLayout}>
                {
                  this.state.active ? <Image resizeMode="contain" source={require('./images/check_mark_.png')} style={{width: imageHeightWidth,
    height: imageHeightWidth}}/> : <Image resizeMode="contain" source={require('./images/uncheck_mark_.png')} style={{width: imageHeightWidth,
    height: imageHeightWidth}}/> 
                }
                <Text allowFontScaling={false} style={styles.bubbleText}>{word}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _onPress() {
        const { word } = this.props;
        this.props.action(word)
        this.setState({
            active: !this.state.active
        });
    }

    _onLayout({ nativeEvent }) {
        this.viewWidth = nativeEvent.layout.width * 1.3;
    }
}

const styles = {
    container: {
        marginLeft:5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    circle: {
        top: -5,
        position: "absolute",
    },
    bubbleText: {
        width: '150%',
        height: 20,
        marginLeft:5,
        fontFamily: "SF Pro Text",
        fontSize: 11,
        fontWeight: "300",
        fontStyle: "normal",
        lineHeight: 20,
        color: color.hotPink,
        textAlign: 'left'
    },
    bubbleChoiceSelected: {
        width: '51%',
        height: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    bubbleChoiceDefault: {
        width: '51%',
        height: 30,
        backgroundColor: "transparent",
        borderRadius: 44,
        justifyContent: "center",
        alignItems: "center",
    }
};

export { GoalBubble };