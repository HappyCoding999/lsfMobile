import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import armFlex from '../../../animations/armFlex.json';

export class ArmFlex extends Component {

   constructor(props) {
    super(props);
  }

  animate = () => {
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
            loop={false}
            style={animatedViewStyle}
            source={armFlex}
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
  },
  animatedView: {
    width: 30,
    height: 30,
    marginRight: -10,
  }
});
