import React, { Component } from 'react';
import { goals_icon } from '../../../images'
import { StyleSheet, View, Dimensions, Platform, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import howItWorksScreenAndroid from '../../../animations/howItWorksScreen.android.json';
import howItWorksScreeniOS from '../../../animations/howItWorksScreen.ios.json';
import { scale, verticalScale } from 'react-native-size-matters';

const { height, width } = Dimensions.get('window')

const ANIMATIONS = {
  One: [1, 145],
  Two: [145, 265],
  Three: [265, 380],
  Four: [380, 900],
}

export class HowItWorksSlides extends Component {

   constructor(props) {
    super(props);
    this.state = {
      showGoalsIcon: false
    }
  }

  componentDidMount() {
    this.setPage(1)
  }

  componentDidUpdate(prevProps) {
    const { pageNumber: prevPageNumber, visible: prevVisible } = prevProps
    const { pageNumber, visible } = this.props

    if(pageNumber != prevPageNumber) {
      this.setPage(pageNumber)
    }

    if(visible && !prevVisible) {
      this.setPage(1)
    }
  }

  setPage = (pageNumber) => {
    console.log('setPage  target page', pageNumber)

    this.setState({ showGoalsIcon: false })
    switch(pageNumber) {
      case 1:
        this.animation.play(...ANIMATIONS.One)
        break;
      case 2:
        this.animation.play(...ANIMATIONS.Two)
        break;
      case 3:
        this.animation.play(...ANIMATIONS.Three)
        break;
      case 4:
        this.animation.play(...ANIMATIONS.Four)
        setTimeout(() => {
          this.setState({ showGoalsIcon: true })
        }, 250)
        break;
    }
  }

  render() {
    const { pageNumber } = this.props
    const { showGoalsIcon } = this.state
    console.log('pageNumber', pageNumber)
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={styles.container}>
        <View>
          {showGoalsIcon &&
            <View style={styles.goalsIconContainer}>
              <View style={{ 
                  backgroundColor: 'white',
                  width: verticalScale(65),
                  height: verticalScale(65),
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowOffset: {
                    width: 0,
                    height: 0
                  },
                  shadowOpacity: .2,
                  shadowRadius: 5,
                }}>
                <Image style={{ width: 45, height: 65 }} source={goals_icon} />
              </View>
            </View>
          }
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            imageAssetsFolder={'howItWorksAnimation'}
            loop={false}
            style={animatedViewStyle}
            cacheStrategy={'none'}
            source={Platform.select({
              ios: howItWorksScreeniOS,
              android: howItWorksScreenAndroid
            })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height - verticalScale(60),
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  animatedView: {
    height,
    width,
    position: 'absolute',
    top: 0,
  },
  goalsIconContainer: {
    height: verticalScale(65),
    top: verticalScale(65),
    width: '100%',
    alignItems: 'center'
  }
});
