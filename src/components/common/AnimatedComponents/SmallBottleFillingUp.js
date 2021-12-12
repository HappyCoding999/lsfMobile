import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated,Easing } from 'react-native';
// import KeyframesView from 'react-native-facebook-keyframes'
import LottieView from 'lottie-react-native';
import smallBottleAnimation from '../../../animations/smallBottleAnimation.json';

export class SmallBottleFillingUp extends Component {

   constructor(props) {
    super(props);
  }

  componentDidMount() 
  {
      setTimeout(() => {this.animation.play()}, 500)
            
  }
  render() {
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={styles.container}>
        <View>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            style={animatedViewStyle}
            loop={false}
            source={smallBottleAnimation}
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
    height: "99%"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff'
  }
});
