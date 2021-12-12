import React, { Component } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import spinPlus from '../../../animations/spinPlus.json';

export class SpinPlus extends Component {

   constructor(props) {
    super(props);
    this.state = {
      onPressedEvent: undefined
    }
  }

  onPlusPressed = (onPressedEvent) => {
    console.log('event', onPressedEvent?.nativeEvent?.locationX)
    this.animation.play();
    this.setState({ onPressedEvent })
  }

  sendOnPress = () => {
    if(!this.props.onPress) {
      return
    }
    const { onPressedEvent } = this.state
      
    this.props.onPress(onPressedEvent)
  }

  render() {
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onPlusPressed}>
          <LottieView
            ref={animation => {
              this.animation = animation;
            }}
            loop={false}
            style={animatedViewStyle}
            progress={this.props.progress}
            source={spinPlus}
            onAnimationFinish={this.sendOnPress}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
  },
  animatedView: {
    height: 50,
    width: 50,
    marginLeft: -2
  }
});
