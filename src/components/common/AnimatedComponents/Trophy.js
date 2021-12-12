import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated,Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import trophy from '../../../animations/trophy.json';

export class Trophy extends Component {

   constructor(props) {
    super(props);
  }

  animate = () => {
    try {
      this.animation.play()
    } catch (e) {}
  }

  render() {
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={[styles.container, this.props.style]}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          loop={false}
          style={animatedViewStyle}
          source={trophy}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    height: 125,
    width: 125,
  }
});
