import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import { color } from "../../../../../modules/styles/theme";

export default class extends Component {

  render() {
    const { date, month } = this.props;
    const { container, dateContainer, monthText, dateText } = styles;
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }} >
        <View style={container}>
          <View style={dateContainer}>
            <Text allowFontScaling={false} style={dateText}>{date}</Text>
            <Text allowFontScaling={false} style={monthText}>{month}</Text>
          </View>
          <View style={{ justifyContent: "flex-start", alignItems: "center" }}>
            {this._renderMeasurements()}
          </View>
        </View>
        {this._renderPhotoRow()}
      </View>
    );
  }

  _renderMeasurements() {
    const { weight, waist, arms, hips, thighs } = this.props
    const { rowContainer, text } = styles;

    return (
      <View>
        <View style={rowContainer}>
          <Text allowFontScaling={false} style={text}>Weight: </Text>
          <Text allowFontScaling={false} style={text}>{Math.abs(weight)} lbs </Text>
          <Text allowFontScaling={false} style={text}>Waist: </Text>
          <Text allowFontScaling={false} style={text}>{Math.abs(waist)} in </Text>
          <Text allowFontScaling={false} style={text}>Arms: </Text>
          <Text allowFontScaling={false} style={text}>{Math.abs(arms)} in </Text>
        </View>
        <View style={rowContainer}>
          <Text allowFontScaling={false} style={text}>Hips: </Text>
          <Text allowFontScaling={false} style={text}>{Math.abs(hips)} in </Text>
          <Text allowFontScaling={false} style={text}>Thighs: </Text>
          <Text allowFontScaling={false} style={text}>{Math.abs(thighs)} in </Text>
        </View>
      </View>
      );
  }

  _renderPhotoRow() {
    const { photoURIs } = this.props;
    const { rowContainer } = styles;
    const [uri_1, uri_2, uri_3] = photoURIs;

    return (
      <View style={rowContainer}>
        <Image resizeMode="contain" source={{uri: uri_1}} style={{height: 90, width: 90}} />
        <Image resizeMode="contain" source={{uri: uri_2}} style={{height: 90, width: 90}} />
        <Image resizeMode="contain" source={{uri: uri_3}} style={{height: 90, width: 90}} />
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 15
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  rowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black
  },
  arrow: {
    transform: [{ rotateX: '0deg' }]
  },
  monthText: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black
  },
  dateText: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  }
};