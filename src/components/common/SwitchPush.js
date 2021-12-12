import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { color } from "../../modules/styles/theme";

class SwitchPush extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this.on = false;
    this.state = {
      togglerX: 0,
      leftWordColor: color.mediumPink,
      rightWordColor: "white"
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
          {this._renderAnimatedView()}
          {/*<View style={leftWordContainer}>
            <Text allowFontScaling={false} style={leftWordStyle}>{leftLabel}</Text>
          </View>
          <View style={rightWordContainer}>
            <Text allowFontScaling={false} style={rightWordStyle}>{rightLabel}</Text>
          </View>*/}
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

    return { toValue: (width / 2)-4, duration: 30 };
  }

  _changeWordColor() {
    const { leftWordColor, rightWordColor } = this.state;
    let newLeftWordColor, newRightWordColor;

    if (leftWordColor === "white") {
      newLeftWordColor = color.mediumPink;
    } else {
      newLeftWordColor = color.mediumPink;
    }

    if (rightWordColor === color.mediumPink) {
      newRightWordColor = color.mediumPink;
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
    height: 27,
    borderRadius: (27/2),
    backgroundColor:color.mediumPink,
    borderColor: color.mediumPink,
    borderWidth: 2
  },
  leftWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0
  },
  leftWord: {
    marginLeft: 0,
    fontFamily: "SF Pro Text",
    fontSize: 9,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    zIndex: 1
  },
  rightWordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10
  },
  rightWord: {
    marginRight: 0,
    fontFamily: "SF Pro Text",
    fontSize: 9,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "white",
    zIndex: 1
  },
  toggle: {
    height: 25,
    backgroundColor: color.white,
    position: "absolute",
    top: -1,
    zIndex: 0
  }
};

export { SwitchPush };