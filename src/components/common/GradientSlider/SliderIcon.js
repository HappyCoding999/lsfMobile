import React, { Component } from "react";
import { Image } from "react-native";

export default class extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { source } = this.props;

    if (source) {
      return <Image source={source} />;
    }

    return null;
  }
}