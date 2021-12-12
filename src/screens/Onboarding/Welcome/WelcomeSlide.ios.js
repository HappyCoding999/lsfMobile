import React, { Component } from "react";
import { Platform } from "react-native";
import { View, Animated, Easing, StyleSheet} from "react-native";
import { color } from "../../../modules/styles/theme";

export class WelcomeSlide extends Component {

  constructor(props) {
    super(props)
    const { currentSlide, slideNumber } = props
    const cardIsActive = currentSlide == slideNumber

    this.state = {
      slideNumber: props.slideNumber,
      showCard: cardIsActive
    }
    
    this.opacity = new Animated.Value(cardIsActive ? 1 : 0)
  }

  componentDidMount() {
    const { showCard } = this.state

    if(showCard) {
      this.backgroundAnimation.animate()
      this.screenAnimation.slideIn()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentSlide: prevCurrentSlide } = prevProps
    const { showCard: prevShowCard } = prevState
    const { currentSlide } = this.props
    const { slideNumber, showCard } = this.state

    if(!prevShowCard && showCard) {
      this.backgroundAnimation.animate()
      if(this.screenAnimation && this.screenAnimation.slideIn) {
        this.screenAnimation.slideIn()
      }
    }

    if(prevCurrentSlide == slideNumber && currentSlide != slideNumber) {
      console.log(slideNumber, 'animateHide')
      this.animateHide()
    }

    if(prevCurrentSlide != slideNumber && currentSlide == slideNumber) {
      console.log(slideNumber, 'animateShow')
      this.animateShow()
    }
  }

  animateShow = () => {
    this.setState({ showCard: true })

    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease
    }).start(() => {
      this.opacity = new Animated.Value(1)
    })
  }

  animateHide = () => {
    Animated.timing(this.opacity, {
      toValue: 0,
      duration: 350,
      easing: Easing.ease
    }).start(() => {
      this.opacity = new Animated.Value(0)
      this.backgroundAnimation.reset()
      this.setState({ showCard: false })
    })

    if(this.screenAnimation && this.screenAnimation.slideOut) {
      this.screenAnimation.slideOut()
    }
  }

  render() {
    const { backgroundAnimation: BackgroundAnimation, screenAnimation: ScreenAnimation, backgroundColor } = this.props
    const { showCard } = this.state
    const { container, backgroundAnimationStyle } = styles

    const opacity = this.opacity

    if(!showCard) {
        return <View />
    }
    
    return(
      <Animated.View style={[container, { opacity, backgroundColor }]} pointerEvents={'auto'}>
        <BackgroundAnimation ref={view => this.backgroundAnimation = view } style={backgroundAnimationStyle} />
        <ScreenAnimation ref={view => this.screenAnimation = view } /> 
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  backgroundAnimationStyle: {
    position: 'absolute',
    top: Platform.select({
      ios: 0,
      android: -75
    }),
  }
})