import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Animated,Easing } from 'react-native';
// import LottieView from 'lottie-react-native';
// import anim from '../../animations/94-soda-loader.json';
// import anim1 from '../../animations/bottleFillingUp.json';
// import anim2 from '../../animations/31176-medal-badge.json';
// import anim3 from '../../animations/smallBottleAnimation.json';
// import anim4 from '../../animations/accountCreationDone.json';



export class BottleFillingUp extends Component {

   constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
     // setTimeout(() => {this.animation.play()}, 1000)
     this.animation.play();

    /*Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start();*/

    
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Lottie Animations :-)</Text>
        <View>
        </View>

      </View>
    );
  }

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.welcome}>Welcome to Lottie Animations :-)</Text>
  //       <View>
  //         <LottieView
  //           progress={this.state.progress}
  //           style={{
  //             width: 160,
  //             height: 160
  //           }}
  //           source={anim1}
  //         />
  //       </View>

  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A6207E'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff'
  }
});
