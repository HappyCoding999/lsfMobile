import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import trophyPerfectMonth from '../../../animations/trophyPerfectMonth.json';
import { Modal } from 'react-native';
import { BlurView } from "@react-native-community/blur";

const { height, width } = Dimensions.get('window')
export class TrophyPerfectMonth extends Component {

   constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    const { showAnimated: prevShowAnimated } = prevProps
    const { showAnimated } = this.props

    if ((!prevShowAnimated || prevShowAnimated == false) && showAnimated == true) {
      this.animation.play();      
    } else if(prevShowAnimated == true && (!showAnimated || showAnimated == false) && this.animation && this.animation.reset) {
      this.animation.reset();
    }
  }
  render() {
    const animatedViewStyle = {...styles.animatedView, ...this.props.animatedView};
    const { showAnimated } = this.props

    if(!showAnimated) {
      return <View />
    }
    
    return (
      <Modal
          animationType={'fade'}
          transparent={true}
          visible={true}>
          <View style={styles.container}>
          <BlurView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }}
            blurType="light"
            blurAmount={3}
            reducedTransparencyFallbackColor="white" />
            <View>
              <LottieView
                ref={animation => {
                  this.animation = animation;
                }}
                loop={false}
                style={animatedViewStyle}
                source={trophyPerfectMonth}
                onAnimationFinish={this.props.onAnimationFinish}
              />
              </View>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedView: {
    width,
    height,
    marginTop: -25
  }
});
