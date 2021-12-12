import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated,Easing } from 'react-native';
import LottieView from 'lottie-react-native';
// import KeyframesView from 'react-native-facebook-keyframes'
import bottleFillingUp from '../../../animations/bottleFillingUp.json';

export class BottleFillingUp extends Component {

   constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() 
  {
    var displayAnimation = (this.props.showAnimated == undefined) ? false : this.props.showAnimated;
    if (displayAnimation) 
    {
      this.animation.play();      
    }
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
            loop={false}
            style={animatedViewStyle}
            source={bottleFillingUp}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  animatedView: {
    width: 50,
    height: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff'
  }
});
