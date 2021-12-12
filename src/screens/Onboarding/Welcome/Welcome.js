import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Alert } from "react-native"
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'
import { BoltAnimated } from '../../../components/common/AnimatedComponents/BoltAnimated';
import { HeartAnimated } from '../../../components/common/AnimatedComponents/HeartAnimated';
import { StarAnimated } from '../../../components/common/AnimatedComponents/StarAnimated';
import { ScreenOneAnimation } from '../../../components/common/AnimatedComponents/ScreenOneAnimation';
import { ScreenThreeAnimation } from '../../../components/common/AnimatedComponents/ScreenThreeAnimation';
import { ScreenTwoAnimation } from '../../../components/common/AnimatedComponents/ScreenTwoAnimation';
import { PageIndicators } from "../../../components/common/AnimatedComponents/PageIndicators";
import { WelcomeSlide } from './WelcomeSlide';
import { color } from '../../../modules/styles/theme';
import { Directions, FlingGestureHandler, State, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const MIN_SLIDE_NUMBER = 1
const MAX_SLIDE_NUMBER = 3

class Welcome extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 1
    };
  }

  onSwipeLeft = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      console.log('onSwipeLeft')
      
      const { currentSlide: stateCurrentSlide } = this.state
      this.setState({ currentSlide: Math.min(stateCurrentSlide + 1, MAX_SLIDE_NUMBER) })
    }
  }
 
  onSwipeRight = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      console.log('onSwipeRight')
      
      const { currentSlide: stateCurrentSlide } = this.state
      this.setState({ currentSlide: Math.max(stateCurrentSlide - 1, MIN_SLIDE_NUMBER) })
    }
  }

  render() {
    const { containerStyle } = styles
    const { currentSlide } = this.state
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
 
    return (
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={this.onSwipeRight}>
        <View style={containerStyle}>
          <FlingGestureHandler
            direction={Directions.LEFT}
            onHandlerStateChange={this.onSwipeLeft}>
            <View style={containerStyle}>
              <WelcomeSlide
                slideNumber={1}
                currentSlide={currentSlide}
                backgroundAnimation={BoltAnimated}
                screenAnimation={ScreenOneAnimation}
                backgroundColor={'#F6A0B3'}
              />
              <WelcomeSlide
                slideNumber={2}
                currentSlide={currentSlide}
                backgroundAnimation={HeartAnimated}
                screenAnimation={ScreenTwoAnimation}
                backgroundColor={'#81B4C0'}
              />
              <WelcomeSlide
                slideNumber={3}
                currentSlide={currentSlide}
                backgroundAnimation={StarAnimated}
                screenAnimation={ScreenThreeAnimation}
                backgroundColor={'#F8D3D8'}
              />
              <View style={styles.logoStyle}>
                <Image style={{ width: '100%',top:0}} resizeMode="contain" source={require('../../../images/images/logo_white_love_seat_fitness.png')} />
              </View>
              <View style={{alignItems: "center", justifyContent: "center",width: "100%", height : '20%' }}>
                <PageIndicators pageNumber={currentSlide} />
                <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center"}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SignUp') }>
                    <View style={styles.buttonView}>
                      <Text allowFontScaling={false} style={styles.buttonText}>Get Started</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center",justifyContent: "flex-start", marginBottom: 0,height : 34}}>
                  <Image style={styles.imageStyle} source={require('./images/white_heart_welcome_.png')} />
                  <Text allowFontScaling={false} style={styles.secondaryTextNormal}>Already have account?  <Text onPress={() => this.props.navigation.navigate("Login")} style = {styles.secondaryTextWithLink}>Log In.</Text></Text>
                </View>
              </View>
            </View> 
          </FlingGestureHandler>
        </View> 
      </FlingGestureHandler>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonView: {
    width: width * 0.75,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.white,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    width: "100%",
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: "center",
    color: color.mediumPink
  },
  logoStyle: { 
    position: 'absolute',
    top: Platform.select({ android: 35, ios: 55 }),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default gestureHandlerRootHOC(Welcome);