import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated,Easing } from 'react-native';
// import KeyframesView from 'react-native-facebook-keyframes'
import LottieView from 'lottie-react-native';
import checkMarkAnimation from '../../../animations/CheckMarkAnimation.json';
// import checkMarkAnimation from '../../../animations/CheckMarkAnimation_grey.json';

export class AnimatedCheckmark extends Component {

   constructor(props) {
    super(props);
  }

  componentDidMount() 
  {
    this.animation.play()      
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
            source={checkMarkAnimation}
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
