import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { color,colorNew } from "../../modules/styles/theme";
import { icon_weekday_star} from "../../images";
import LinearGradient from "react-native-linear-gradient";

export class WeekViewForChallange extends Component {

  constructor(props) {
    super(props);
    console.log("WeekViewForChallange - props")
    console.log(props)
    this.state = {
      isWeekButtonSelected: false,
    };
  }

  _handleWeekClick ()
  {
    console.log("WeekViewForChallange _handleWeekClick")
    if (this.props.onLeftPress != undefined)
    {
      this.props.onLeftPress()
      let isWeekButtonSelected =  !this.state.isWeekButtonSelected
      this.setState({ isWeekButtonSelected});
    }
    
  }
  renderWeekDayView()
  {
    const {weekDayStyle} = styles;
      return (
        <View style={{width:"90%",height:60,justifyContent:"center",alignItems:"center"}}>
          <View style={{width:"100%",height:this.state.isWeekButtonSelected ? 36 : 60,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
            {this.renderWeekDayCellView(true,"M")}
            {this.renderWeekDayCellView(true,"T")}
            {this.renderWeekDayCellView(true,"W")}
            {this.renderWeekDayCellView(false,"T")}
            {this.renderWeekDayCellView(false,"F")}
            {this.renderWeekDayCellView(false,"S")}
            {this.renderWeekDayCellView(false,"S")}
          </View>
        </View>
      )
  }
 renderWeekDayCellView(isSelected,text)
  {
    const {weekDayStyle} = styles;
    if (this.state.isWeekButtonSelected) {
      return this.renderWeekDayImageViewOnly(isSelected,text);
    }
    else
    {
      return this.renderWeekDayImageAndTextView(isSelected,text);
    }
  }
  renderWeekDayImageAndTextView(isSelected,text)
  {
    const {weekDayStyle} = styles;
      return(
          <View style={{alignItems: "center",flexDirection: "column",justifyContent: "center", height: "100%", width: "14%",paddingLeft:3,paddingRight:3}}>
            <View style={{height:35,width:35,justifyContent:"center",alignItems:"center",marginBottom:15,backgroundColor:color.lightPink,borderRadius: 100,borderWidth:1,borderColor:color.mediumPink}}>
              {isSelected ? <Image source={icon_weekday_star} resizeMode="contain" style={{ width: 13, height: 13}} /> : null}
            </View>
            <View style={{height:20,width:"100%",justifyContent:"center",alignItems:"center"}}>
              <Text allowFontScaling={false} style={{...weekDayStyle,height:"100%",marginBottom:18}}>{text}</Text>
            </View>
          </View>
      )
  }
  renderWeekDayImageViewOnly(isSelected,text)
  {
    const {weekDayStyle} = styles;
      return(
          <View style={{alignItems: "center",flexDirection: "column",justifyContent: "center", height: "100%", width: "14%",paddingLeft:3,paddingRight:3}}>
            <View style={{height:30,justifyContent:"center",alignItems:"center",backgroundColor:color.lightPink}}>
              {isSelected ? <Image source={icon_weekday_star} resizeMode="cover" style={{ width: 25, height: 25,tintColor:'#fff'}} /> : <Image source={day_uncheck_roundec} resizeMode="cover" style={{ width: 25, height: 25,tintColor:'#fff'}} />}
            </View>
          </View>
      )
  }

  render() {
  console.log("WeekViewForChallange -props");
  const {weekDayStyle} = styles;

  return(
      <View style={{flex:1,flexDirection:"row"}}>
        <View style={{width:"15%",height:60,justifyContent:"flex-end",backgroundColor:colorNew.darkPink,alignItems:"center"}}>
          <View style={{width:"100%",height:35,justifyContent:"center",alignItems:"flex-end",flexDirection:"row",marginTop:5}}>
            {this.state.isWeekButtonSelected ? <View style={{flex:1,height:4,marginBottom:0,backgroundColor:"#fff"}} /> : <View style={{flex:1,height:4,marginBottom:0,backgroundColor:"transparent"}} />}
            <View style={this.state.isWeekButtonSelected ?[{...styles.navigationButtonBackgroundViewSelected,marginLeft:0,marginBottom:0,justifyContent:"flex-end"}] : [{...styles.navigationButtonBackgroundView,marginLeft:0,marginBottom:0,justifyContent:"flex-end"}]}>
              <TouchableOpacity onPress={this._handleWeekClick.bind(this)}>
                <Text allowFontScaling={true} style={{...weekDayStyle,marginTop: 0,marginLeft:2,marginBottom:9,fontSize: 8,fontWeight: "700",color: this.state.isWeekButtonSelected ? colorNew.darkPink : "#fff"}}>WEEK 1</Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.isWeekButtonSelected ? <View style={{flex:1,width:"100%",marginBottom:0,backgroundColor:colorNew.lightPink}} /> : <View style={{flex:1,width:"100%",backgroundColor:"transparent"}} />}
        </View>
        <View style={{width:"70%",height:60,justifyContent:"center",alignItems:"center",backgroundColor:colorNew.darkPink}}>
          {this.renderWeekDayView()}
        </View>
        <View style={{width:"15%",height:60, justifyContent:"flex-end",backgroundColor:colorNew.darkPink,alignItems:"center"}}>
          <View style={{width:"100%",height:40, justifyContent:"flex-end",backgroundColor:colorNew.darkPink,alignItems:"center"}}>
            <Text allowFontScaling={true} style={{...weekDayStyle,marginBottom:8,marginTop: 0,marginRight:10,fontSize: 8,fontWeight: "700"}}>BEGINNER</Text>
            {this.state.isWeekButtonSelected ? <View style={{width:"100%",height:4,marginBottom:0,backgroundColor:"#fff"}} /> : <View style={{width:"100%",height:4,marginBottom:0,backgroundColor:"transparent"}}/>}
          </View>
          {this.state.isWeekButtonSelected ? <View style={{width:"100%",height:20,marginBottom:0,backgroundColor:colorNew.lightPink}} /> : <View style={{flex:1,height:20,marginBottom:0,backgroundColor:"transparent"}} />}
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
   width:50,
   height:40,
   justifyContent:"center",
   alignItems:"center"
  },
  navigationButtonBackgroundViewSelected: { 
   width:50,
   height:40,
   borderTopColor: '#ffffff',
   borderLeftColor: '#ffffff',
   borderRightColor: '#ffffff',
   borderBottomColor: 'transparent',
   marginTop:8,
   borderWidth: 4,
   borderTopLeftRadius:10,
   borderTopRightRadius:10,
   backgroundColor:colorNew.lightPink,
   justifyContent:"center",
   alignItems:"center"
  },
  weekDayStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: "#fff",
    marginTop: 10,
  },
  headingTextBlackBig: {
    width: "90%",
    height: 28,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 20,
    color: "#000",
    marginTop: 20
  },
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    position: 'relative'
  }
};
