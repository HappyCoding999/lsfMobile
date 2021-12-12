import React, { Component } from "react";
import { Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import { color,colorNew } from "../../modules/styles/theme";
import { bottle_blank,bottle_fill,goal_workout_status,
  goal_plus_rounded,goal_weight_goal,goal_water_intake,goal_sweat_streak,
  goal_feel_hapier,day_check_roundec,day_uncheck_roundec} from "../../images";
import LinearGradient from "react-native-linear-gradient";
import moment from 'moment';
import WeekdayCheck, { CHECK_STATE } from "./WeekdayCheck";
import { BrilliantAnimation } from "./AnimatedComponents/BrilliantAnimation";
import { Modal } from "react-native";
const { width, height } = Dimensions.get('window')

const DEFAULT_CHECK_STATE = {
  showBrilliantAnimation: false,
  weekCompleteAnimateCheck: false,
  weekAnimateBurst1: false,
  weekAnimateBurst2: false,
  weekAnimateBurst3: false,
  weekAnimateBurst4: false,
  weekAnimateBurst5: false,
  weekAnimateBurst6: false,
  weekAnimateBurst0: false
}

const DAYS = [1,2,3,4,5,6,0]

export class WeekViewForHeader extends Component {

  constructor(props) {
    super(props);
    var dates = []
    if (props.completed) {
      props.completed.map(obj => {
        var day = new Date(obj.createdAt)
        if (day != "Invalid Date") {
          // console.log(obj)
          if (this.props.currentWeek == obj.week && dates.includes(day.getDay()) == false){
            dates.push(day.getDay())
          } 
        }
      })    
    }
    this.state = {
      isWeekButtonSelected: false,
      completedDates:dates,
      ...DEFAULT_CHECK_STATE
    };
  }

  componentWillReceiveProps(props) {
    var dates = []
    if (props.completed) {
      props.completed.map(obj => {
        var day = new Date(obj.createdAt)
        if (day != "Invalid Date") {
          if (this.props.currentWeek == obj.week && dates.includes(day.getDay()) == false){
            dates.push(day.getDay())
          } 
        }
      })    
    }
    this.setState({ completedDates:dates})
  }
  
  onLastDayCompleted = () => {
    const { completedDates } = this.state
    const dates = [...completedDates, 0]

    let weekCompleteAnimateCheck = true
    for(const day of DAYS) {
      if(!dates.includes(day)) {
        weekCompleteAnimateCheck = false
      }
    }

    this.setState({ completedDates: dates, weekCompleteAnimateCheck })
  }

  _handleWeekClick ()
  {
    if (this.props.onLeftPress != undefined)
    {
      this.props.onLeftPress()
      let isWeekButtonSelected =  !this.state.isWeekButtonSelected
      this.setState({ isWeekButtonSelected});
    }
    
  }

  onStartWeekCompleteAnimation = async() => {

    this.setState({ showBrilliantAnimation: true })
    for(const day of DAYS) {
      await this.sleep(5)
      this.setState({ [`weekAnimateBurst${day}`]: true })
    }
  }

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  renderWeekDayView()
  {
    const {weekDayStyle} = styles;
      return (
        <View style={{width:"100%",height:60,justifyContent:"center",alignItems:"center",backgroundColor:colorNew.darkPink}}>
          <View style={{width:"100%",height:this.state.isWeekButtonSelected ? 36 : 60,justifyContent:"center",alignItems:"center",backgroundColor:colorNew.darkPink,flexDirection:"row"}}>
            {/*this.renderWeekDayCellView(true,"M")}
            {this.renderWeekDayCellView(true,"T")}
            {this.renderWeekDayCellView(true,"W")}
            {this.renderWeekDayCellView(false,"T")}
            {this.renderWeekDayCellView(true,"F")}
            {this.renderWeekDayCellView(false,"S")}
            {this.renderWeekDayCellView(false,"S")*/}
            {this.renderWeekDayCellView(1,"M")}
            {this.renderWeekDayCellView(2,"T")}
            {this.renderWeekDayCellView(3,"W")}
            {this.renderWeekDayCellView(4,"T")}
            {this.renderWeekDayCellView(5,"F")}
            {this.renderWeekDayCellView(6,"S")}
            {this.renderWeekDayCellView(0,"S")}
          </View>
        {this.state.isWeekButtonSelected ? <View style={{width:"100%",height:4,justifyContent:"center",alignItems:"center",backgroundColor:"#fff"}} /> : null}
        {this.state.isWeekButtonSelected ? <View style={{width:"100%",height:20,justifyContent:"center",alignItems:"center",backgroundColor:colorNew.lightPink}} /> : null}
        </View>
      )
  }
 renderWeekDayCellView(day,text)
  {
    var isSelected = this.state.completedDates.length > 0 ? this.state.completedDates.includes(day) : false;

    const {weekDayStyle} = styles;
    if (this.state.isWeekButtonSelected) {
      return this.renderWeekDayImageViewOnly(isSelected,text);
    }
    else
    {
      return this.renderWeekDayImageAndTextView(isSelected,day, text);
    }
  }
  renderWeekDayImageAndTextView(isSelected, day, text)
  {
    const { completedDates } = this.state
    let checkState = isSelected ? CHECK_STATE.CHECKED : CHECK_STATE.UNCHECKED
    if(this.state.weekCompleteAnimateCheck && day == 0) {
      checkState = CHECK_STATE.CHECKED_ANIMATE
    }
    if(this.state[`weekAnimateBurst${day}`]) {
      checkState = CHECK_STATE.CHECKED_BURST
    }

    const {weekDayStyle} = styles;
      return(
          <View style={{alignItems: "center",flexDirection: "column",justifyContent: "center", height: "100%", width: "14%",paddingLeft:3,paddingRight:3}}>
            <TouchableOpacity style={{height:40,justifyContent:"center",alignItems:"center",marginBottom:4}} disabled={true} onPress={this.onLastDayCompleted}>
              <WeekdayCheck checkState={checkState} onFlipAnimationEnd={this.onStartWeekCompleteAnimation} />
            </TouchableOpacity>
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
            <View style={{height:30,justifyContent:"center",alignItems:"center"}}>
              {isSelected ? <Image source={day_check_roundec} resizeMode="cover" style={{ width: 25, height: 25,tintColor:'#fff'}} /> : <Image source={day_uncheck_roundec} resizeMode="cover" style={{ width: 25, height: 25,tintColor:'#fff'}} />}
            </View>
          </View>
      )
  }

  render() {
  const {weekDayStyle} = styles;
  const { level,currentWeek, onLevelSelected } = this.props;
  const { showBrilliantAnimation } = this.state
  
  return(
      <View style={{flex:1,flexDirection:"row"}}>
        <BrilliantAnimation showAnimated={showBrilliantAnimation} onAnimationFinish={() => this.setState({ ...DEFAULT_CHECK_STATE })} />
        <View style={{width:"17%",height:60,justifyContent:"flex-end",backgroundColor:colorNew.darkPink,alignItems:"center"}}>
          <View style={{width:"100%",height:35,justifyContent:"center",alignItems:"flex-end",flexDirection:"row",marginTop:5}}>
            {this.state.isWeekButtonSelected ? <View style={{flex:1,height:4,marginBottom:0,backgroundColor:"#fff"}} /> : <View style={{flex:1,height:4,marginBottom:0,backgroundColor:"transparent"}} />}
            <View style={this.state.isWeekButtonSelected ?[{...styles.navigationButtonBackgroundViewSelected,marginLeft:0,marginBottom:0,justifyContent:"flex-end"}] : [{...styles.navigationButtonBackgroundView,marginLeft:0,marginBottom:0,justifyContent:"flex-end"}]}>
              <TouchableOpacity onPress={this._handleWeekClick.bind(this)}>
                <Text allowFontScaling={true} style={{...weekDayStyle,marginRight: 15,marginTop: 0,marginLeft:2,marginBottom:9,fontSize: 7,fontWeight: "700",color: this.state.isWeekButtonSelected ? colorNew.darkPink : "#fff"}}>WEEK {currentWeek}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.isWeekButtonSelected ? <View style={{flex:1,width:"100%",marginBottom:0,backgroundColor:colorNew.lightPink}} /> : <View style={{flex:1,width:"100%",backgroundColor:"transparent"}} />}
        </View>
        <View style={{width:"66%",height:60,justifyContent:"center",alignItems:"center",backgroundColor:colorNew.darkPink}}>
          {this.renderWeekDayView()}
        </View>
        <View style={{width:"17%",height:60, justifyContent:"flex-end",backgroundColor:colorNew.darkPink,alignItems:"center"}}>
          <TouchableOpacity onPress={onLevelSelected} style={{width:"100%",height:40, justifyContent:"flex-end",backgroundColor:colorNew.darkPink,alignItems:"center"}}>
            <Text allowFontScaling={true} style={{...weekDayStyle,marginBottom:8,marginTop: 0,marginRight:10,fontSize: 7,fontWeight: "700"}}>{level.toUpperCase()}</Text>
            {this.state.isWeekButtonSelected ? <View style={{width:"100%",height:4,marginBottom:0,backgroundColor:"#fff"}} /> : <View style={{width:"100%",height:4,marginBottom:0,backgroundColor:"transparent"}}/>}
          </TouchableOpacity>
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
