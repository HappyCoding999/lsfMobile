import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import pageIndicators from '../../../animations/pageIndicators.json';

const ANIMATE_FORWARD = {
  OneToTwo: [89, 105],
  TwoToThree: [173, 190]
}

const ANIMATE_BACKWARD = {
  TwoToOne: [340, 360],
  ThreeToTwo: [255, 275]
}

export class PageIndicators extends Component {

   constructor(props) {
    super(props);
    const { pageNumber } = props

    this.state = {
      progress: this.getPageProgress(pageNumber)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { pageNumber: prevPageNumber } = prevProps
    const { pageNumber } = this.props
    const { progress: prevProgress } = prevState

    if(pageNumber > prevPageNumber) {
      this.nextPageIndicator(pageNumber)
    }

    if(pageNumber < prevPageNumber) {
      this.prevPageIndicator(pageNumber)
    }

    const progress = this.getPageProgress(pageNumber)
    if(prevProgress != progress) {
      //this.setState({ progress })
    }
  }

  getPageProgress = (pageNumber) => {

    let progress = 0.01
    if(pageNumber == 2) {
      progress = 0.25
    }
    if(pageNumber == 3) {
      progress = 0.50
    }

    return progress

  }

  nextPageIndicator = (pageNumber) => {
    console.log('nextPageIndicator  target page', pageNumber)

    switch(pageNumber) {
      case 1:
        console.log('ANIMATE_FORWARD', 0, 1)
        this.animation.play(0, 1)
        break;
      case 2:
        console.log('ANIMATE_FORWARD', ANIMATE_FORWARD['OneToTwo'][0], ANIMATE_FORWARD['OneToTwo'][1])
        this.animation.play(ANIMATE_FORWARD['OneToTwo'][0], ANIMATE_FORWARD['OneToTwo'][1])
        break;
      case 3:
        console.log('ANIMATE_FORWARD', ANIMATE_FORWARD['TwoToThree'][0], ANIMATE_FORWARD['TwoToThree'][1])
        this.animation.play(ANIMATE_FORWARD['TwoToThree'][0], ANIMATE_FORWARD['TwoToThree'][1])
        break;
    }
  }

  prevPageIndicator = (pageNumber) => {
    console.log('prevPageIndicator target page', pageNumber)

    switch(pageNumber) {
      case 1:
        console.log('ANIMATE_BACKWARD', ANIMATE_BACKWARD['TwoToOne'][0], ANIMATE_BACKWARD['TwoToOne'][1])
        this.animation.play(ANIMATE_BACKWARD['TwoToOne'][0], ANIMATE_BACKWARD['TwoToOne'][1])
        break;
      case 2:
        console.log('ANIMATE_BACKWARD', ANIMATE_BACKWARD['ThreeToTwo'][0], ANIMATE_BACKWARD['ThreeToTwo'][1])
        this.animation.play(ANIMATE_BACKWARD['ThreeToTwo'][0], ANIMATE_BACKWARD['ThreeToTwo'][1])
        break;
      case 3:
        console.log('ANIMATE_BACKWARD', 173, 174)
        this.animation.play(173, 174)
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  animatedView: {
    width: 200,
    height: 30,
  }
});
