import React from 'react';
import BaseAnimatedComponent from './BaseAnimatedComponent'
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default class AnimatedComponent extends BaseAnimatedComponent {

   constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { showAnimated } = this.props
    if(showAnimated) {
      this.animate()
    }
  }
  
  animate = () => {
    if(!this.animation) {
      return
    }

    this.animation.play()
  }
  
  reset = () => {
    if(!this.animation) {
      return
    }
    
    this.animation.reset()
  }

  componentDidUpdate(prevProps) {
    const { showAnimated: prevShowAnimated } = prevProps
    const { showAnimated } = this.props

    if ((!prevShowAnimated || prevShowAnimated == false) && showAnimated == true) {
      this.animate();      
    } else if(prevShowAnimated == true && (!showAnimated || showAnimated == false)) {
      this.reset();
    }
  }
  
  render() {
    const { style, animatedViewStyle, source, ...props } = this.props
    return (
      <View style={[styles.container, this.props.style]}>
        <LottieView
          ref={animation => {
              this.animation = animation;
          }}
          loop={false}
          style={[styles.animatedViewStyle, this.props.animatedViewStyle]}
          source={source}
          {...props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedViewStyle: {
    height: '100%',
    width: '100%'
  }
});