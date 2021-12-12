import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity,Platform } from 'react-native';
import { color,colorNew } from "../../modules/styles/theme";
import { gear,lightning_bolt,logo_white_love_seat_fitness} from "../../images";
import LinearGradient from "react-native-linear-gradient";

export class TransparentHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLeftButtonSelected: false,
      isRightButtonSelected: false,
    };
  }

  _navigationLeftButtonPressed ()
  {
    if (this.props.onLeftPress != undefined)
    {
      this.props.onLeftPress()
      // let isLeftButtonSelected =  !this.state.isLeftButtonSelected
      // this.setState({ isLeftButtonSelected:false, isRightButtonSelected:false});
    }
  }
  _navigationRightButtonPressed ()
  {
    if (this.props.onRightPress != undefined)
    {
      this.props.onRightPress()
      let isRightButtonSelected =  !this.state.isRightButtonSelected
      this.setState({ isRightButtonSelected, isLeftButtonSelected:false});
    }
  }

  render() {
  const { onLeftPress,onRightPress } = this.props;
  const colors = [colorNew.lightPink, colorNew.darkPink];
  const buttonBackgroundColor = this.state.isRightButtonSelected ? colorNew.lightPink : 'transparent';

  return(
      <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
        <View style={{width:"100%", height:100,justifyContent:"center",alignItems:"flex-end",backgroundColor:"transparent",flexDirection:"row"}}>
          <View style={{width:"15%",height:40,marginTop:20,justifyContent:"center",alignItems:"flex-start"}}>
            <View style={this.state.isLeftButtonSelected ?[{...styles.navigationButtonBackgroundViewSelected,marginLeft:10}] : [{...styles.navigationButtonBackgroundView,marginLeft:10}]}>
              <TouchableOpacity onPress={this._navigationLeftButtonPressed.bind(this)}>
                <Image style={{width: 24,height:24,resizeMode: 'contain',marginTop:5}} source={gear} />
              </TouchableOpacity>
            </View>
            {this.state.isRightButtonSelected ? <View style={{width:"100%",height:4,marginBottom:4,backgroundColor:"#fff"}} /> : this.state.isLeftButtonSelected ? <View style={{width:10,height:4,marginBottom:4,backgroundColor:"#fff"}} /> : <View style={{width:"100%",height:4,marginBottom:4,backgroundColor:"transparent"}} />}
          </View>
          <View style={{width:"70%",marginTop:20,justifyContent:"center",alignItems:"flex-start"}}>
            <Image style={{width: '100%',height:40,resizeMode: 'contain'}} source={logo_white_love_seat_fitness} />
            {(this.state.isRightButtonSelected || this.state.isLeftButtonSelected)? <View style={{width:"103%",height:4,backgroundColor:"#fff",marginLeft:this.state.isLeftButtonSelected ? -5 : 0}} /> : <View style={{width:"103%",height:4,backgroundColor:"transparent"}} />}
          </View>
          <View style={{width:"15%",height:40,marginTop:20,justifyContent:"center",alignItems:"flex-end",flexDirection:"row"}}>
            <View style={this.state.isRightButtonSelected ?[{...styles.navigationButtonBackgroundViewSelected,marginLeft:8}] : [{...styles.navigationButtonBackgroundView,marginLeft:8}]}>
              <TouchableOpacity onPress={this._navigationRightButtonPressed.bind(this)}>
                <Image style={{width: 24,height:24,resizeMode: 'contain',marginTop:2}} source={lightning_bolt} />
              </TouchableOpacity>
            </View>
            {this.state.isRightButtonSelected ? <View style={{flex:1,height:4,marginBottom:0,backgroundColor:"#fff"}} /> : this.state.isLeftButtonSelected ? <View style={{width:"100%",height:4,marginBottom:4,backgroundColor:"#fff"}} /> : <View style={{width:10,height:4,marginBottom:4,backgroundColor:"transparent"}} />} 
          </View>
        </View>
      </View>
    )
  }
};
const styles = {
  textStyle: { 
    fontSize: 20,
    color: color.hot_pink
  },
  navigationButtonBackgroundView: { 
   width:40,
   height:40,
   justifyContent:"center",
   alignItems:"center"
  },
  navigationButtonBackgroundViewSelected: { 
   width:40,
   height:40,
   borderTopColor: '#ffffff',
   borderLeftColor: '#ffffff',
   borderRightColor: '#ffffff',
   borderBottomColor: 'transparent',
   marginTop:8,
   borderWidth: 4,
   borderTopLeftRadius: Platform.OS === "ios" ? 10 : 0,
   borderTopRightRadius:Platform.OS === "ios" ? 10 : 0,
   backgroundColor:colorNew.lightPink,
   justifyContent:"center",
   alignItems:"center"
  },
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    position: 'relative'
  }
};
// export { GradientHeader };
