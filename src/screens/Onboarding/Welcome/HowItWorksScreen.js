import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native"
import { Directions, FlingGestureHandler, State, gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { setHasSeenHowItWorks } from "../../../actions";
import { HowItWorksSlides } from '../../../components/common/AnimatedComponents/HowItWorksSlides';
import { HIWPageIndicators as PageIndicators } from '../../../components/common/AnimatedComponents/HIWPageIndicators';

import { cancel_round_cross } from '../../../images'
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window');

const MIN_SLIDE_NUMBER = 1
const MAX_SLIDE_NUMBER = 4

class HowItWorksScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 1
    };
  }
  
  componentDidMount() {
    this.props.setHasSeenHowItWorks()
  }

  onSwipeLeft = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      const { currentSlide: stateCurrentSlide } = this.state
      this.setState({ currentSlide: Math.min(stateCurrentSlide + 1, MAX_SLIDE_NUMBER) })
    }
  }
 
  onSwipeRight = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      const { currentSlide: stateCurrentSlide } = this.state
      this.setState({ currentSlide: Math.max(stateCurrentSlide - 1, MIN_SLIDE_NUMBER) })
    }
  }

  onDismiss = () => {
    if(this.props.navigation) {
      this.props.navigation.pop()
    } else if(this.props.onDismiss) {
      this.props.onDismiss()
    }
  }

  render() {
    const { containerStyle } = styles
    const { currentSlide } = this.state
    const { visible } = this.props
 
    return (
      <View style={containerStyle}>
        <FlingGestureHandler direction={Directions.RIGHT} onHandlerStateChange={this.onSwipeRight}>
          <View style={containerStyle}>
            <FlingGestureHandler direction={Directions.LEFT} onHandlerStateChange={this.onSwipeLeft}>
              <View style={[containerStyle]}>
                <View style={{ height: '100%'}}>
                  <HowItWorksSlides showAnimated pageNumber={currentSlide} visible={visible} />
                  <PageIndicators pageNumber={currentSlide} />
                </View>
              </View>
          </FlingGestureHandler>
          </View>
        </FlingGestureHandler>
        <View style={{ position: 'absolute', top: 60, right: 30 }}>
          <TouchableOpacity style={{ padding: 15 }} onPress={this.onDismiss}>
              <Image
                source={cancel_round_cross}
                style={{ backgroundColor: "transparent", height: 25, width: 25, tintColor: '#E26D93' }}
              />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#FDF3F4'
  },
})

const HowItWorksScreenWithGesture = gestureHandlerRootHOC(HowItWorksScreen);

export default connect(null, { setHasSeenHowItWorks })(HowItWorksScreenWithGesture)

