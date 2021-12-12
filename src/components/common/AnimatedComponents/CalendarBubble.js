import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated,Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import calendarBubble from '../../../animations/calendarBubble.json';

export class CalendarBubble extends Component {

   constructor(props) {
    super(props);
    this.state = {
      progress: 0
    }
  }

  animate = () => {
    try {
      this.animation.play()
    } catch (e) {}
  }

  reset = () => {
    try {
      this.setState({ progress: 0 })
      this.animation.reset()
    } catch (e) {}
  }
  onAnimationFinish = () => {
    console.log('onAnimationFinish')
    this.setState({ progress: 1 })
  }

  render() {
    const { completedWorkouts } = this.props
    const { progress } = this.state
    // console.log('day progress', progress)
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={[styles.container, this.props.style]}>
        {completedWorkouts && 
          <View>
            <LottieView
              ref={animation => {
                this.animation = animation;
              }}
              loop={false}
              progress={progress}
              style={animatedViewStyle}
              source={calendarBubble}
              onAnimationFinish={this.onAnimationFinish}
            />
          </View>
        }
        <View style={{ height: 80, width: 80, alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
          {this.props.children}
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
    height: 80,
    width: 80,
  }
});
