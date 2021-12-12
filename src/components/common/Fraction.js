import React, {Component} from "react";
import { View, Text } from "react-native";
import { color } from "../../modules/styles/theme";

export class Fraction extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { numerator, denominator } = this.props;
    const { container, text } = styles;

    let denomPosTop = 12;
    let denomPosLeft = 11;
    let numerPosTop = -10;
    let numerPosLeft = -14;
    let containerPaddingLeft = 0;

    if (denominator == 7)
    {
      denomPosTop = 14;
      denomPosLeft = 14;
    }

    if (numerator > 9)
    {
      numerPosTop = -10;
      numerPosLeft = -20;
      containerPaddingLeft = 10;
    }

    const containerStyle = {
      ...container,
      paddingLeft: containerPaddingLeft
    };

    const solidusStyle = {
      ...text,
      color: color.lightPink
    };

    const numeratorStyle = {
      ...text,
      color: color.lightPink,
      position: "absolute",
      top: numerPosTop,
      left: numerPosLeft 
    };

    const denominatorStyle = {
      ...text,
      color: color.hotPink,
      position: "absolute",
      top: denomPosTop,
      left: denomPosLeft
    };

    return (
      <View style={containerStyle}>
        <View>
          <Text allowFontScaling={false} style={solidusStyle}>/</Text>
          <Text allowFontScaling={false} style={numeratorStyle}>{numerator}</Text>
          <Text allowFontScaling={false} style={denominatorStyle}>{denominator}</Text>
        </View>
      </View>
    );
  }
};

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    width: 65
  },
  text: {
    fontFamily: "Sofia Pro",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    height: 40,
    width: 40,
    paddingTop: 0
  }
};