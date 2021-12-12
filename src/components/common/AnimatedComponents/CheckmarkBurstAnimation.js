import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import checkmarkBurst from '../../../animations/checkmarkBurst.json';

export class CheckmarkBurstAnimation extends Component {

   constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { showAnimated } = this.props
    if(showAnimated) {
      this.animation.play();
    }
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
            source={checkmarkBurst}
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
    width: 100,
    height: 100,
    marginBottom: 24,
    marginLeft: 1,
  }
});
