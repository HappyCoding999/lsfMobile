import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import screenThreeAnimation from '../../../animations/screenThreeAnimation.json';
import { Platform } from 'react-native';

export class ScreenThreeAnimation extends Component {

   constructor(props) {
    super(props);
  }

  slideIn = () => {
    this.animation.play(174, 210)
  }

  slideOut = () => {
    this.animation.play(250, 270)
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
          source={screenThreeAnimation}
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