import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import brilliant from '../../../animations/brilliant.json';
import { Modal } from 'react-native';

const { height, width } = Dimensions.get('window')
export class BrilliantAnimation extends Component {

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
          animationType='none'
          transparent={true}
          visible={true}>
          <View style={styles.container}>
            <View>
              <LottieView
                ref={animation => {
                  this.animation = animation;
                }}
                loop={false}
                style={animatedViewStyle}
                source={brilliant}
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
    backgroundColor: 'transparent'
  },
  animatedView: {
    width,
    height,
  }
});
