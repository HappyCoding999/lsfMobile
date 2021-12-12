import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import smallButton from '../../../animations/smallButton.json';

export class SmallButtonAnimated extends Component {

   constructor(props) {
    super(props);
  }

  componentDidMount() {
      this.animation.play()
  }
  
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }]}>
            <LottieView
              ref={animation => {
                  this.animation = animation;
              }}
              loop={true}
              style={[styles.animatedViewStyle]}
              source={smallButton}
            />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.props.onPress} activeOpacity={.8}>
          <Text allowFontScaling={false} style={styles.text}>
              {this.props.children}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 115,
    height: 44,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  animatedViewStyle: {
    width: '100%',
    height: '100%',
  },
  text: {
    width: '100%',
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  }
});