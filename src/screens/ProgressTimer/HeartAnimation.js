import React, { Component } from "react";
import { View, Animated } from "react-native";
import { color,colorNew} from "../../modules/styles/theme"
export default class extends Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(1);
  }

  spring() {
    this.springValue.setValue(1.3)
    Animated.spring(
      this.springValue,
      {
        toValue: 1.2,
        delay: 800

      }
    ).start(() => { this.spring() })
  }

  componentDidMount() {
    this.spring()
  }

  render() {
    const { container } = styles;

    return (
      <View style={container}>
        <Animated.Image
          style={{ width: 200, height: 230,tintColor:colorNew.darkPink ,transform: [{ scale: this.springValue }] }}
          source={require("./images/iconHeart.png")}
        />
        {this._renderChild()}
      </View>
    );
  }

  _renderChild() {
    const { childContainerStyle } = this.props;

    if (childContainerStyle) {
      return (
        <View style={childContainerStyle}>
          {this.props.children}
        </View>
      );
    }

    return null;
  }

}

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
};



