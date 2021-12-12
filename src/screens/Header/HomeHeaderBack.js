import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Header from './Header'
import { colorNew } from '../../modules/styles/theme';
import { StyleSheet } from 'react-native';

export class HomeHeaderBack extends Component {

  constructor(props) {
    super(props);
    this._navigationRightButtonPressed = this._navigationRightButtonPressed.bind(this);
  }

  _navigationRightButtonPressed = () => {
    if(this.props.onRightPressed) {
      this.props.onRightPressed()
    }
  }
  
  _navigationLeftButtonPressed = () => {
    if(this.props.onLeftButtonPressed) {
      this.props.onLeftButtonPressed()
    }
  }
  

  render() {
    const { containerStyle } = styles
    const colors = [colorNew.lightPink, colorNew.darkPink]
    return(
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={colors}
        style={[containerStyle, this.props.containerStyle]}>
          <Header {...this.props} displayBackButton={true} onLeftButtonPressed={this._navigationLeftButtonPressed} onRightPressed={this._navigationRightButtonPressed}  />
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    width:'100%',
    height: 100,
    justifyContent:'center',
    alignItems:'flex-end',
    backgroundColor:'#bdbdbd',
    flexDirection:'row',
    paddingBottom: 10
  }
})

export default HomeHeaderBack