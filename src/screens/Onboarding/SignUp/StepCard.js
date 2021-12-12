import React, { Component } from "react";
import { Dimensions, View, Animated, Text, Easing} from "react-native";
import { color } from "../../../modules/styles/theme";

const { width } = Dimensions.get('window');

export class StepCard extends Component {

  constructor(props) {
    super(props)
    const { currentStep, stepNumber } = props
    const cardIsActive = currentStep == stepNumber

    this.state = {
      stepNumber: props.stepNumber,
      showCard: cardIsActive
    }
    
    this.scale = new Animated.Value(cardIsActive ? 1 : .9)
    this.opacity = new Animated.Value(cardIsActive ? 1 : 0)
  }

  componentDidUpdate(prevProps) {
    const { currentStep: prevCurrentStep } = prevProps
    const { currentStep } = this.props
    const { stepNumber } = this.state

    if(prevCurrentStep == stepNumber && currentStep != stepNumber) {
      console.log(stepNumber, 'animateHide')
      this.animateHide()
    }

    if(prevCurrentStep != stepNumber && currentStep == stepNumber) {
      console.log(stepNumber, 'animateShow')
      this.animateShow()
    }
  }

  animateShow = () => {
    this.setState({ showCard: true })

    Animated.parallel([
      Animated.timing(this.scale, {
        toValue: 1,
        duration: 200,
        delay: 300,
        easing: Easing.ease
      }),
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 200,
        delay: 300,
        easing: Easing.ease
      })
    ]).start(() => {
      this.scale = new Animated.Value(1)
      this.opacity = new Animated.Value(1)
    })
  }

  animateHide = () => {
    Animated.parallel([
      Animated.timing(this.scale, {
        toValue: 0.9,
        duration: 250,
        delay: 150,
        easing: Easing.ease
      }),
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 250,
        delay: 150,
        easing: Easing.ease
      })
    ]).start(() => {
      this.scale = new Animated.Value(.9)
      this.opacity = new Animated.Value(0)
      this.setState({ showCard: false })
    })
  }

  render() {
    const { primaryText, secondaryText, children } = this.props
    const { currentStep } = this.props
    const { stepNumber, showCard } = this.state

    const pointerEvents = stepNumber == currentStep ? 'auto' : 'auto'
    const scale = this.scale
    const opacity = this.opacity

    if(!showCard) {
        return <View />
    }
    console.log('width: width, ', { width: width, })
    
    return(
      <Animated.View style={{ top: 0, left: -(width / 2), alignItems: "center", width: width, position: 'absolute', transform: [{ scale }], opacity }} pointerEvents={pointerEvents}>
        <Text allowFontScaling={false} style={styles.primaryText}>{primaryText}</Text>
        <Text allowFontScaling={false} style={styles.secondaryText}>{secondaryText}</Text>
        {children}
      </Animated.View>
    )
  }
}

const styles = {
  primaryText: {
    flex: 0,
    width: "90%",
    height: 30,
    fontFamily: "SF Pro Display Bold",
    // fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white
  },
  secondaryText: {
    flex: 0,
    width: "90%",
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    marginTop:5,
    color: color.white
  },
}