import React, { Component } from "react";
import { View, Image, Animated, PanResponder } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SliderIcon from "./SliderIcon";

class GradientSlider extends Component {

  constructor(props) {
    super(props);

    this._onPanResponderMove = this._onPanResponderMove.bind(this);
    this._onPanResponderRelease = this._onPanResponderRelease.bind(this);
    this.colors = ["#FFCBE5", "#F74D91"];
    this.offset = 34
    this.initialThumbLeft = this._getInitialPos(props);

    this.pan = new Animated.Value(this.initialThumbLeft);

    const constrainedX = this.pan.interpolate({
      inputRange: [0, props.width],
      outputRange: [0, props.width - this.offset],
      extrapolate: "clamp"
    });

    this.panResponder = this._buildPanResponder();

    this.state = {
      componentX: constrainedX
    };
  }

  render() {
    const { container, linearGradient, draggableContainer } = styles;
    const linearGradientStyle = { ...linearGradient, width: this.props.width };
    const draggableContainerStyle = {
      ...draggableContainer,
      left: this.state.componentX
    };

    return (
      <View style={container}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={this.colors}
          style={linearGradientStyle}>

          {this._renderIcons()}

          <Animated.View
            {...this.panResponder.panHandlers}
            style={draggableContainerStyle}>

            <Image source={require("./images/sliderHandle.png")} />

          </Animated.View>

        </LinearGradient>
      </View>
    );
  }

  _getInitialPos(props) {
    const { initialPos, width } = props;
    if (initialPos) {
      return width * initialPos;
    }

    return (width / 2) - 15;
  }

  _renderIcons() {
    const { leftIcon, rightIcon} = this.props;
    const { iconContainer } = styles;
    let leftSource, rightSource

    if (leftIcon) {
      leftSource = getIconSource(leftIcon);
    }

    if (rightIcon) {
      rightSource = getIconSource(rightIcon);
    }

    return (
      <View style={iconContainer}>
        <SliderIcon source={leftSource} />
        <SliderIcon source={rightSource} />
      </View>
    );
  }

  _buildPanResponder() {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease
    });
  }

  _onPanResponderMove(_e, gestureState) {
    const { onMove, width, lock } = this.props;
    const sliderLocation = this.pan._value / (width - this.offset);

    if (lock === true) return;

    if (onMove) {
      onMove(this._normalizePos(sliderLocation));
    }

    this.pan.setValue(this.initialThumbLeft + gestureState.dx);
  }

  _onPanResponderRelease() {
    const { onRelease } = this.props
    
    if (onRelease) { onRelease(); }
    this.initialThumbLeft = this.pan._value;
  }

  _normalizePos(pos) {
    if (pos < 0) {
      return 0;
    } else if (pos > 1) {
      return 1;
    } else {
      return pos;
    }
  }
}

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  linearGradient: {
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 5,
    height: 36,
    width: "100%"
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5
  },
  draggableContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    top: -15,
    left: 0
  }
};

export { GradientSlider };

function getIconSource(type) {
  const source = {
    "sweat": require("./images/iconSweatdrops.png"),
    "nosweat": require("./images/iconNosweat.png"),
    "happy": require("./images/iconHappyface.png"),
    "sad": require("./images/iconSadface.png")
  }[type];

  if (source) {
    return source;
  }

  throw new Error(`${type} is not a valid type.  Please use sweat, nosweat, happy, or sad`);
}