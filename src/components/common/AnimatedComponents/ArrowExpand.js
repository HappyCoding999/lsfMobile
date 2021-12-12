import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import arrowExpand from '../../../animations/arrowExpand.json';

export class ArrowExpand extends Component {

   constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const { showAnimated: prevShowAnimated } = prevProps
    const { showAnimated } = this.props

    if ((!prevShowAnimated || prevShowAnimated == false) && showAnimated == true) {
      this.animation.play();      
    } else if(prevShowAnimated == true && (!showAnimated || showAnimated == false)) {
      this.animation.reset();
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
            progress={this.props.progress}
            source={arrowExpand}
            onAnimationFinish={this.props.onAnimationFinish}
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
    width: '100%',
    height: '100%',
  }
});
