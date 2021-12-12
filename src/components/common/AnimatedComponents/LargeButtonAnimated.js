import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import bigButton from '../../../animations/bigButton.json';

const { width } = Dimensions.get("window");
export class LargeButtonAnimated extends Component {

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
              source={bigButton}
            />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.props.onPress} activeOpacity={.8}>
          {this.props.children}
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
    width: 315,
    height: 48,
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