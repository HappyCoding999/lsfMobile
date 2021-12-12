import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color } from "../../../modules/styles/theme";

class CircledWord extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this.viewWidth = 0;
    this.state = {
      circleOpacity: 0,
      circleWidth: undefined
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
      <TouchableOpacity onPress={this._onPress} activeOpacity={1}>
        <View style={container} onLayout={this._onLayout}>
          <Text allowFontScaling={false} style={text}>{word}</Text>        
          <Image resizeMode="stretch" style={circleStyle} source={require("./images/iconCircleditem.png")} />
        </View>
      </TouchableOpacity>
    );
  }

  _onPress() {
    const { onCircled } = this.props;

    if (onCircled) onCircled();
    this._toggleCircle();
  }

  _toggleCircle() {
    const newOpacity = this.state.circleOpacity === 1 ? 0 : 1;

    this.setState({
      circleOpacity: newOpacity,
      circleWidth: this.viewWidth
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
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "center",
    color: color.hotPink
  }
};

export { CircledWord };