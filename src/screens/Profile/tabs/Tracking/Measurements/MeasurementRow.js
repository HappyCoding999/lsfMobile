import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color, colorNew } from "../../../../../modules/styles/theme";

export default class extends Component {
  render() {
    const { date, month, year, editPress, deletePress, dataIndex } = this.props;
    console.log(month);
    const { container, dateContainer, monthText, dateText, text } = styles;
    // const dateToDisplay = month.toUppercase()+ ',' + date + ','
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={container}>
          <Text allowFontScaling={false} style={{ ...dateText, width: "65%" }}>
            {month ? month.toUpperCase() : ""} {date}, {year}
          </Text>
          <View
            style={{
              width: "35%",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={() => this.props.editPress(dataIndex)}>
              <Text allowFontScaling={false} style={text}>
                EDIT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.deletePress}>
              <Text allowFontScaling={false} style={text}>
                DELETE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: "80%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {this._renderMeasurements()}
        </View>
        {this._renderPhotoRow()}
      </View>
    );
  }

  _renderMeasurements() {
    const { weight, waist, arms, hips, thighs, weightUnit } = this.props;
    const { rowContainer, text } = styles;

    return (
      <View>
        <View style={rowContainer}>
          <Text allowFontScaling={false} style={text}>
            Current Weight:{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            {Math.abs(weight)} {weightUnit}
          </Text>
        </View>
        <View style={rowContainer}>
          <Text allowFontScaling={false} style={text}>
            Mesurements:{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            Waist:{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            {Math.abs(waist)}",{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            Arms:{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            {Math.abs(arms)}",{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            Hips:{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            {Math.abs(hips)}",{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            Thighs:{" "}
          </Text>
          <Text allowFontScaling={false} style={text}>
            {Math.abs(thighs)}"
          </Text>
        </View>
      </View>
    );
  }

  _renderPhotoRow() {
    const { photoURIs } = this.props;
    const { photoRowContainer, photoContainer } = styles;
    const [uri_1, uri_2, uri_3] = photoURIs;

    return (
      <View style={photoRowContainer}>
        <View style={photoContainer}>
          {uri_1 == "" ? null : (
            <TouchableOpacity onPress={() => this.props.onPhotoPress(uri_1)}>
              <Image
                resizeMode="contain"
                source={{ uri: uri_1 }}
                style={{ height: "100%", width: "100%" }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={photoContainer}>
          {uri_2 == "" ? null : (
            <TouchableOpacity onPress={() => this.props.onPhotoPress(uri_2)}>
              <Image
                resizeMode="contain"
                source={{ uri: uri_2 }}
                style={{ height: "100%", width: "100%" }}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={photoContainer}>
          {uri_3 == "" ? null : (
            <TouchableOpacity onPress={() => this.props.onPhotoPress(uri_3)}>
              <Image
                resizeMode="contain"
                source={{ uri: uri_3 }}
                style={{ height: "100%", width: "100%" }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: "80%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 15,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    width: "100%",
    marginLeft: 0,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  photoRowContainer: {
    marginTop: 10,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: color.darkGrey,
  },
  arrow: {
    transform: [{ rotateX: "0deg" }],
  },
  monthText: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
  },
  photoContainer: {
    height: 70,
    width: 70,
    borderWidth: 1.5,
    borderColor: color.darkGrey,
    backgroundColor: colorNew.bgGrey,
  },

  dateText: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    marginLeft: 0,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: color.black,
  },
};
