import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import pageIndicators from '../../../animations/hiwPageIndicators.json';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Platform } from 'react-native';

const ANIMATION = {
  OneToTwo: [145, 165],
  TwoToThree: [265, 285],
  ThreeToFour: [380, 400]
}
const ANIMATION_REVERSE = {
  TwoToThree: [165, 145],
  ThreeTwoTwo: [285, 265],
  FourToThree: [400, 380]
}

export class HIWPageIndicators extends Component {

   constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    const { pageNumber: prevPageNumber } = prevProps
    const { pageNumber } = this.props

    if(pageNumber > prevPageNumber) {
      this.nextPageIndicator(pageNumber)
    }

    if(pageNumber < prevPageNumber) {
      this.prevPageIndicator(pageNumber)
    }
  }

  nextPageIndicator = (pageNumber) => {
    console.log('nextPageIndicator  target page', pageNumber)

    switch(pageNumber) {
      case 1:
        this.animation.play(0, 1)
        break;
      case 2:
        this.animation.play(...ANIMATION.OneToTwo)
        break;
      case 3:
        this.animation.play(...ANIMATION.TwoToThree)
        break;
      case 4:
        this.animation.play(...ANIMATION.ThreeToFour)
        break;
    }
  }

  prevPageIndicator = (pageNumber) => {
    console.log('prevPageIndicator target page', pageNumber)

    switch(pageNumber) {
      case 1:
        this.animation.play(...ANIMATION_REVERSE.TwoToThree)
        break;
      case 2:
        this.animation.play(...ANIMATION_REVERSE.ThreeTwoTwo)
        break;
      case 3:
        this.animation.play(...ANIMATION_REVERSE.FourToThree)
        break;
    }
  }

  render() {
    const { pageNumber } = this.props
    console.log('pageNumber', pageNumber)
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={styles.container}>
        <View>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            loop={false}
            style={animatedViewStyle}
            cacheStrategy={'none'}
            source={pageIndicators}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: moderateScale(45),
    overflow: 'hidden',
  },
  animatedView: {
    width: '100%',
    position: 'absolute',
    height: 150,
    top: moderateScale(Platform.select({
      ios: -19,
      android: -35
    }))
  }
});
