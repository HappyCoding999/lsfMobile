import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import screenTwoAnimation from '../../../animations/screenTwoAnimation.json';
import { Platform } from 'react-native';

export class ScreenTwoAnimation extends Component {

   constructor(props) {
    super(props);
  }

  slideIn = () => {
    this.animation.play(90, 120)
  }

  slideOut = () => {
    this.animation.play(170, 190)
  }
  
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <LottieView
          ref={animation => {
              this.animation = animation;
          }}
          loop={false}
          speed={.5}
          style={[styles.animatedViewStyle, this.props.animatedViewStyle]}
          source={screenTwoAnimation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  animatedViewStyle: {
    width: '100%',
  }
});