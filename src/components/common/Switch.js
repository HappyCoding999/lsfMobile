import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { color } from "../../modules/styles/theme";

class Switch extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this.on = false;
    this.state = {
      togglerX: 0,
      leftWordColor: "white",
      rightWordColor: color.mediumPink
    }
  }

  render() {
    const {
      rightWordContainer,
      leftWordContainer,
    } = styles;

    const { width, leftLabel, rightLabel } = this.props;

    const container = { ...styles.container, width };

    const leftWordStyle = { ...styles.leftWord, color: this.state.leftWordColor };
    const rightWordStyle = { ...styles.rightWord, color: this.state.rightWordColor };

    return (
      <TouchableOpacity activeOpacity={1} onPress={this._onPress}>
        <View style={container}>
          <View style={leftWordContainer}>
            <Text allowFontScaling={false} style={leftWordStyle}>{leftLabel}</Text>
          </View>
          <View style={rightWordContainer}>
            <Text allowFontScaling={false} style={rightWordStyle}>{rightLabel}</Text>
          </View>
          {this._renderAnimatedView()}
        </View>
      </TouchableOpacity>
    );
  }

  _onPress() {
    const { newLeftWordColor, newRightWordColor } = this._changeWordColor();
    const { toValue } = this._getAnimConfig();
    const { onToggle, leftLabel, rightLabel } = this.props;

    if (onToggle) { onToggle(this.on ? rightLabel : leftLabel); }

    this.setState({
      leftWordColor: newLeftWordColor,
      rightWordColor: newRightWordColor,
      togglerX: toValue
    });
  }

  _getAnimConfig() {
    const { width } = this.props;

    if (this.on) {
      this.on = false;
      return { toValue: 0, duration: 30 };
    }

    this.on = true;

    return { toValue: width / 2, duration: 30 };
  }

  _changeWordColor() {
    const { leftWordColor, rightWordColor } = this.state;
    let newLeftWordColor, newRightWordColor;

    if (leftWordColor === "white") {
      newLeftWordColor = color.mediumPink;
    } else {
      newLeftWordColor = "white";
    }

    if (rightWordColor === color.mediumPink) {
      newRightWordColor = "white";
    } else {
      newRightWordColor = color.mediumPink;
    }

    return { newLeftWordColor, newRightWordColor };
  }

  _renderAnimatedView() {
    const { width, leftLabel, rightLabel } = this.props;
    const leftWordStyle = { ...styles.leftWord, color: this.state.leftWordColor };
    const rightWordStyle = { ...styles.rightWord, color: this.state.rightWordColor };
    const toggle = {
      ...styles.toggle,
      width: width / 2,
      borderRadius: width / 2 / 2,
      left: this.state.togglerX,
      justifyContent: "center",
      alignItems: "center"
    };

    if (Platform.OS === "ios") {
      return (
        <Animated.View style={toggle}>
          <Text style={this.on ? rightWordStyle : leftWordStyle}>{this.on ? rightLabel : leftLabel}</Text>
        </Animated.View>
      );
    }

    return  <Animated.View style={toggle} />;
  }
}

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    borderRadius: 30,
    borderColor: color.mediumPink,
    borderWidth: 2
  },
  leftWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10
  },
  leftWord: {
    marginLeft: 10,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#fff",

    zIndex: 1
  },
  rightWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  rightWord: {
    marginRight: 10,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    zIndex: 1
  },
  toggle: {
    height: 60,
    backgroundColor: color.mediumPink,
    position: "absolute",
    top: -2,
    zIndex: 0
  }
};

export { Switch };