import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import boltTransparent from '../../../animations/boltTransparent.json';

export class BoltAnimated extends Component {

   constructor(props) {
    super(props);
  }

  animate() {
    this.animation.play()
  }

  reset() {
    this.animation.reset()
  }
  
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <LottieView
          ref={animation => {
              this.animation = animation;
          }}
          loop={false}
          style={[styles.animatedViewStyle, this.props.animatedViewStyle]}
          source={boltTransparent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedViewStyle: {
    width: '100%',
    height: '100%',
  }
});