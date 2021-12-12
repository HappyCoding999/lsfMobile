import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { color,colorNew } from "../../modules/styles/theme";
import { bottle_blank,bottle_fill,goal_workout_status,
  goal_plus_rounded,goal_weight_goal,goal_water_intake,goal_sweat_streak,
  goal_feel_hapier,day_check_roundec} from "../../images";
import LinearGradient from "react-native-linear-gradient";
import moment from 'moment';
import { sortBy, filter, last } from "lodash";
import { flow } from "lodash/fp";
import { getDataForWeek } from "../../utils";

  export class GoalViewForHeader extends Component {

  constructor(props) {
    super(props);
    const { goals,completedWorkouts,weeklyWorkoutSchedule,historicalWeight} = props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    const targetWeight = goals.weight.target;
    const startingWeight = last(sortBy(Object.values(historicalWeight), w => w.createdAt)).weight;
    let weekData = getDataForWeek(completedWorkouts,weeklyWorkoutSchedule,props.screenProps.currentWeek)

    var dates = []
    if (weekData) {
      // console.log(completed)
      weekData.map(obj => {
        var day = new Date(obj.createdAt)
        if (day != "Invalid Date") {
          if (obj.isCompleted && props.screenProps.currentWeek == obj.week){
            dates.push(day.getDay())
          } 
        }
      })    
    }
    const { dailyWaterIntake,weight,weeklyWorkout,workoutStreak} = goals;
    this.state = {
      loggedWatterBottle: dailyWaterIntake.current,
      targetWatterBottle: dailyWaterIntake.target,
      currentWeight: weight.current,
      startingWeight: startingWeight,
      goalWeight: targetWeight,
      workoutStreakLongest: workoutStreak.longest,
      workoutStreakCurrent: workoutStreak.current,
      completedDates:dates,
    };
  }
  componentWillReceiveProps(props) {
    
    const { goals,completedWorkouts,weeklyWorkoutSchedule,historicalWeight} = props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    const targetWeight = goals.weight.target;
    const startingWeight = last(sortBy(Object.values(historicalWeight), w => w.createdAt)).weight;
    const { dailyWaterIntake,weight,weeklyWorkout,workoutStreak} = goals;
    let weekData = getDataForWeek(completedWorkouts,weeklyWorkoutSchedule,props.screenProps.currentWeek)
    var dates = []
    if (weekData) {
      console.log(weekData)
      weekData.map(obj => {
        var day = new Date(obj.createdAt)
        if (day != "Invalid Date") {
          console.log(obj)
          if (obj.isCompleted && props.screenProps.currentWeek == obj.week){
            dates.push(day.getDay())
          } 
        }
      })    
    }
    this.setState({ 
      loggedWatterBottle: dailyWaterIntake.current,
      targetWatterBottle: dailyWaterIntake.target,
      currentWeight: weight.current,
      startingWeight: startingWeight,
      goalWeight: targetWeight,
      workoutStreakLongest: workoutStreak.longest,
      workoutStreakCurrent: workoutStreak.current,
      completedDates:dates
    })
  }
  logWatterBottlePlus ()
  {
    // if (this.props.logWatterBottlePlus != undefined)
    // {
    //   this.props.logWatterBottlePlus()
      var loggedWatterBottle =  this.state.loggedWatterBottle + 1

      const { saveBottleCount } = this.props.screenProps;

      if (loggedWatterBottle <= this.state.targetWatterBottle) 
      {
        // saveBottleCount(loggedWatterBottle);
        saveBottleCount(1);
        this.setState({loggedWatterBottle}); 
      }
    // }
  }
 renderWeekDayCellViewForGoal(isSelected)
  {
    const height_width = 12
      return(
          <View style={{alignItems: "center",flexDirection: "column",justifyContent: "center", height: "100%", width: "14%",paddingLeft:3,paddingRight:3}}>
            {isSelected ? <Image source={day_check_roundec} resizeMode="cover" style={{ width: height_width, height: height_width,tintColor:colorNew.darkPink}} /> : <Image source={day_check_roundec} resizeMode="cover" style={{ width: height_width, height: height_width,tintColor:'#fff'}} />}
          </View>
      )
  }

  render() {
  return(
      <View style={{flex:1}}>
        <View style={[{width:"100%",height:60,justifyContent:"flex-end",alignItems:"flex-end",flexDirection:"row"}]}>
          <View style={[{height:2,flex:1,justifyContent:"flex-end",alignItems:"center",backgroundColor:colorNew.darkPink,margin:10,marginBottom:25}]}/>
          <Text allowFontScaling={false} style={{...styles.headingTextBlackBig,paddingLeft:0,width:"30%",paddingRight:20,marginBottom:20,color:colorNew.darkPink }}>#GOAL</Text>
        </View>
        <View style={[{width:"100%",flex:1,justifyContent:"space-evenly"}]}>
          <View style={[{width:"100%",height:110,flexDirection:"row",justifyContent:"space-evenly"}]}>
            <View style={[{width:"45%",height:"100%",flexDirection:"row",justifyContent:"space-evenly"}]}>
              <View style={[{width:"20%",height:"100%"}]} >
                <Image source={goal_sweat_streak} resizeMode="contain" style={{height:25,width:25,tintColor:'#fff',marginTop:15}} />
              </View>  
              <View style={[{width:"70%",height:"100%"}]}>
                <Text allowFontScaling={false} style={{...styles.headingTextBlackBig,fontSize: 14,paddingLeft:0,width:"100%",color:colorNew.darkPink,height: 20,marginTop:15}}>Sweat Streak</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>Longest Streak: {this.state.workoutStreakLongest} days</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>Current Streak: {this.state.workoutStreakCurrent} days</Text>
              </View>  
            </View>  
            <View style={[{width:"45%",height:"110%",flexDirection:"row",justifyContent:"space-evenly"}]}>
              <View style={[{width:"20%",height:"100%"}]} >
                <Image source={goal_workout_status} resizeMode="contain" style={{height:25,width:25,tintColor:'#fff',marginTop:15}} />
              </View>  
              <View style={[{width:"70%",height:"100%"}]}>
                <Text allowFontScaling={false} style={{...styles.headingTextBlackBig,fontSize: 14,paddingLeft:0,width:"100%",color:colorNew.darkPink,height: 20,marginTop:15}}>Workout Status</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>{this.state.completedDates.length} of 7 workouts completed</Text>
                <View style={{width:"100%",height:20,marginTop:3,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(1) : false)}
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(2) : false)}
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(3) : false)}
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(4) : false)}
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(5) : false)}
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(6) : false)}
                  {this.renderWeekDayCellViewForGoal(this.state.completedDates.length > 0 ? this.state.completedDates.includes(0) : false)}
                </View>
              </View>  
            </View>  
          </View>
          <View style={[{width:"100%",height:120,flexDirection:"row",justifyContent:"space-evenly",marginTop:10}]}>
            <View style={[{width:"45%",height:"100%",flexDirection:"row",justifyContent:"space-evenly"}]}>
              <View style={[{width:"20%",height:"100%"}]} >
                <Image source={goal_weight_goal} resizeMode="contain" style={{height:25,width:25,tintColor:'#fff',marginTop:15}} />
              </View>  
              <View style={[{width:"70%",height:"100%"}]}>
                <Text allowFontScaling={false} style={{...styles.headingTextBlackBig,fontSize: 14,paddingLeft:0,width:"100%",color:colorNew.darkPink,height: 20,marginTop:15}}>Weight Goal</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>Starting Weight: {this.state.startingWeight}</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>Current Weight: {this.state.currentWeight}</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>Goal Weight: {this.state.goalWeight}</Text>
              </View>  
            </View>  
            <View style={[{width:"45%",height:"100%",flexDirection:"row",justifyContent:"space-evenly"}]}>
              <View style={[{width:"20%",height:"100%"}]} >
                <Image source={goal_water_intake} resizeMode="contain" style={{height:25,width:25,tintColor:'#fff',marginTop:15}} />
              </View>  
              <View style={[{width:"70%",height:"100%"}]}>
                <Text allowFontScaling={false} style={{...styles.headingTextBlackBig,fontSize: 14,paddingLeft:0,width:"100%",color:colorNew.darkPink,height: 20,marginTop:15}}>Water Intake</Text>
                <Text allowFontScaling={true} style={{...styles.weekDayStyle,textAlign: "left",marginTop: 2,fontSize: 9,fontWeight: '300',color: "#000"}}>{this.state.loggedWatterBottle} of {this.state.targetWatterBottle} bottles logged</Text>
                <View style={{width:"90%",height:30,marginTop:7,justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>
                  <Image style={{ height: '100%',top:0,margin:3,tintColor:colorNew.darkPink}} resizeMode="contain" source={ this.state.loggedWatterBottle > 0 ? bottle_fill : bottle_blank}/>
                  <Image style={{ height: '100%',top:0,margin:3,tintColor:colorNew.darkPink}} resizeMode="contain" source={ this.state.loggedWatterBottle > 1 ? bottle_fill : bottle_blank} />
                  <Image style={{ height: '100%',top:0,margin:3,tintColor:colorNew.darkPink}} resizeMode="contain" source={ this.state.loggedWatterBottle > 2 ? bottle_fill : bottle_blank} />
                  <Image style={{ height: '100%',top:0,margin:3,tintColor:colorNew.darkPink}} resizeMode="contain" source={ this.state.loggedWatterBottle > 3 ? bottle_fill : bottle_blank} />
                  <TouchableOpacity onPress={() => this.logWatterBottlePlus()}>
                    <Image style={{ height: '100%',top:0,margin:3,marginLeft:7}} resizeMode="contain" source={goal_plus_rounded} />
                  </TouchableOpacity>
                </View>  
              </View>  
            </View>  
          </View>
        </View>
        <View style={[{width:"100%",height:4,backgroundColor:"#fff"}]} />
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
