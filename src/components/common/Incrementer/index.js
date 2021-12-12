import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { color } from "../../../modules/styles/theme";
import plus from "./images/addButton.png";
import minus from "./images/minusButton.png";

export class Incrementer extends Component {
  constructor(props) {
    super(props);

    this._increment = this._increment.bind(this);
    this._decrement = this._decrement.bind(this);
    this._focus = this._focus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this.state = {
      count: props.initialCount,
      borderBottomColor: "transparent",
      focus: false
    };
  }

  render() {
    const { container, text, textBox } = styles;
    const { width } = this.props;
    const { borderBottomColor, count } = this.state;

    const textBoxStyle = {
      ...textBox,
      borderBottomColor: borderBottomColor
    };
    const containerStyle = {
      ...container, 
      width
    };

    const countToString = count.toString();

    return (
      <View style={containerStyle}>

        <TouchableOpacity activeOpacity={1} onPress={this._decrement}>
          <Image source={minus} />
        </TouchableOpacity>

        <View style={textBoxStyle}>
          <TextInput
            underlineColorAndroid="transparent"
            style={text}
            onFocus={this._focus}
            onChangeText={this._onChangeText}
            value={countToString}
            keyboardType="decimal-pad"
            onBlur={this._onBlur}
          />
        </View>

        <TouchableOpacity activeOpacity={1} onPress={this._increment}>
          <Image source={plus} />
        </TouchableOpacity>

      </View>
    );
  }

  _increment() {
    const { count, focus } = this.state;

    if (focus) { return; }
    const newCount = Math.floor(parseFloat(count) + 1);

    this.props.onCountChange(newCount > 999 ? 999 : newCount);

    this.setState({
      count: newCount > 999 ? 999 : newCount.toString()
    });
  }

  _decrement() {
    const { count, focus } = this.state;

    if (focus) { return; }
    const newCount = Math.ceil(parseFloat(count) - 1);

    this.props.onCountChange(newCount < 0 ? 0 : newCount);

    this.setState({
      count: newCount < 0 ? 0 : newCount.toString()
    });
  }

  _focus() {
    this.setState({
      borderBottomColor: color.mediumPink,
      focus: true
    });
  }

  _onBlur() {
    this.setState({
      borderBottomColor: "transparent",
      focus: false
    });
  }

  _onChangeText(count) {
    this.props.onCountChange(count);

    this.setState({
      count
    });
  }
}

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 38,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    lineHeight: 40,
    textAlign: "center",
    color: color.black
  },
  textBox: {
    borderBottomWidth: 5,
    justifyContent: "center",
    alignItems: "center"
  }
};