import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color } from "../../../modules/styles/theme";

export default class Bubble extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this.viewWidth = 0;
    this.imageAvailable = false;
    this.state = {
      active: false
    };
  }

  render() {
    const { title, imagesource } = this.props;
    const { circleOpacity, circleWidth } = this.state;
    const { container, text, circle } = buttonStyles;
    const circleStyle = {
      ...circle,
      opacity: circleOpacity,
      width: circleWidth
    };

    return (<View style={{justifyContent: "center", flexDirection: "column", alignItems: "center"}}> 
      {this._renderBubble()} 
      </View>);

  }

  _renderBubble = () => {


    const { title, imagesource } = this.props;
    const { container, text, circle, circleSelected } = buttonStyles;



    if (imagesource !== title) {

      return (
        <TouchableOpacity
          onPress={this._onPress} activeOpacity={1}>
          <View style={container} onLayout={this._onLayout}>
            <Image style={this.state.active ? buttonStyles.bubbleChoiceSelected : buttonStyles.bubbleChoiceDefault} source={imagesource} />
            <Text allowFontScaling={false} style={buttonStyles.bubbleText}>{title}</Text>
          </View>
        </TouchableOpacity>
      );

    } else {

      return (
        <TouchableOpacity
          onPress={this._onPress} activeOpacity={1}>
          <View style={this.state.active ? circleSelected : circle}>
            <Text allowFontScaling={false} style={text}>{title}</Text>
          </View>
          <View style={container} onLayout={this._onLayout}>
            <Text allowFontScaling={false} style={buttonStyles.bubbleText}>{title.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      );

    }

  }

  _onPress= ()=> {
    const { title } = this.props;
    this.props.action(title)
    this.setState({
      active: !this.state.active
    });
  }

  _onLayout({ nativeEvent }) {
    this.viewWidth = nativeEvent.layout.width * 1.3;
  }
}

const buttonStyles = {
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  circleSelected: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f6bbb9",
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.hotPink,
    borderWidth: 2
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f6bbb9",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    width: 80,
    height: 40,
    fontFamily: "SF Pro Text",
    fontSize: 14.7,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 0.09,
    color: "#5f6aaf",
    textAlign: "center",
    marginTop: 10

  },
  bubbleText: {
    width: 88,
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.black,
    textAlign: "center",
    marginTop: 5
  },
  bubbleChoiceSelected: {
    width: 94,
    height: 94,
    backgroundColor: "#fff",
    borderRadius: 47,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.hotPink,
    borderWidth: 2
  },
  bubbleChoiceDefault: {
    width: 94,
    height: 94,
    backgroundColor: "#fff",
    borderRadius: 47,
    justifyContent: "center",
    alignItems: "center"
  }
};