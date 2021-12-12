import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import screenOneAnimation from '../../../animations/screenOneAnimation.json';
import { Platform } from 'react-native';

export class ScreenOneAnimation extends Component {

   constructor(props) {
    super(props);
  }

  slideIn = () => {
    this.animation.play()
  }

  slideOut = () => {
    this.animation.play(49, 1)
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
          source={screenOneAnimation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  animatedViewStyle: {
    width: '100%',
  }
});