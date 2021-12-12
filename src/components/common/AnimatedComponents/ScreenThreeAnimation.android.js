import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Platform } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('screen')

export class ScreenThreeAnimation extends Component {

   constructor(props) {
    super(props);
  }

  slideIn = () => {
    //this.animation.play(0, 25)
  }

  slideOut = () => {
    //this.animation.play(78, 90)
  }
  
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={{ width: '100%', height: '100%', marginTop: verticalScale(150), transform: [{ scale: moderateScale(.85) }] }}>
          <Image source={require('../../../animations/screenThreeAnimation.gif')} style={{ height: '70%', width: '100%' }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7CDD2',
    marginLeft: Platform.select({
      ios: 0,
    }),
  },
  animatedViewStyle: {
    height: '100%',
  }
});