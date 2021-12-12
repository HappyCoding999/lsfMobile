import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import progressLine from '../../../animations/progressLine.json';

export class CurrentStep extends Component {

   constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.showAnimated) {
      this.animation.play()
    }
  }

  componentDidUpdate(prevProps) {
    const { showAnimated: prevShowAnimated } = prevProps
    const { showAnimated } = this.props

    if ((!prevShowAnimated || prevShowAnimated == false) && showAnimated == true) {
      this.animation.play();      
    }
  }
  render() {
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    return (
      <View style={styles.container}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          loop={false}
          style={animatedViewStyle}
          progress={this.props.progress}
          source={progressLine}
          onAnimationFinish={this.props.onAnimationFinish}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    width: 96,
    height: 96,
  }
});
