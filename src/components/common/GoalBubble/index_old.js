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

        return (
            <TouchableOpacity
                style={this.state.active ? styles.bubbleChoiceSelected : styles.bubbleChoiceDefault}
                onPress={this._onPress} activeOpacity={1}>
                <View style={container} onLayout={this._onLayout}>
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
        justifyContent: "center",
        alignItems: "center"
    },
    circle: {
        top: -5,
        position: "absolute",
    },
    bubbleText: {
        width: 70,
        height: 30,
        fontFamily: "SF Pro Text",
        fontSize: 11,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 15,
        letterSpacing: 0.5,
        color: color.hotPink,
        textAlign: "center"
    },
    bubbleChoiceSelected: {
        width: 88,
        height: 88,
        backgroundColor: color.lightPink,
        borderRadius: 44,
        justifyContent: "center",
        alignItems: "center"
    },
    bubbleChoiceDefault: {
        width: 88,
        height: 88,
        backgroundColor: "#fff",
        borderRadius: 44,
        justifyContent: "center",
        alignItems: "center",
        borderColor: color.hotPink,
        borderWidth: 2
    }
};

export { GoalBubble };