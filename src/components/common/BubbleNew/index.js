import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity,Dimensions } from "react-native";
import { color } from "../../../modules/styles/theme";
const { height, width } = Dimensions.get("window");
const devider = 4.8;


export default class BubbleNew extends Component {
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
            <View style={this.state.active ? buttonStyles.bubbleChoiceSelected : buttonStyles.bubbleChoiceDefault}>
              <Image style={{width:"70%",height:"70%"}} resizeMode="contain" source={imagesource} />
              <Text allowFontScaling={false} style={buttonStyles.bubbleText}>{title}</Text>
            </View>
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
    if (title == "ADD YOUR\nOWN") {

    }
    else
    {
      this.setState({
        active: !this.state.active
      });      
    }
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
    width: (width/devider) - 10,
    width: (width/devider) - 10,
    borderRadius: ((width/devider) - 10)/2,
    backgroundColor: "#f6bbb9",
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.hotPink,
    borderWidth: 2,
  },
  circle: {
    width: (width/devider) - 10,
    height: (width/devider) - 10,
    borderRadius: ((width/devider) - 10)/2,
    backgroundColor: "#f6bbb9",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    width: (width/devider) - 10,
    height: (width/devider) - 10,
    fontFamily: "SF Pro Text",
    fontSize: 12,
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
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    position: "absolute",
    letterSpacing: 0.5,
    color: color.black,
    textAlign: "center",
    marginTop: 5
  },
  bubbleChoiceSelected: {
    width: (width/devider) - 6,
    height: (width/devider) - 6,
    borderRadius: ((width/devider) - 6)/2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.hotPink,
    borderWidth: 2,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 3
  },
  bubbleChoiceDefault: {
    width: (width/devider) - 6,
    height: (width/devider) - 6,
    borderRadius: ((width/devider) - 6)/2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 3
  }
};