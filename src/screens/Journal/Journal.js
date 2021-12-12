import React, { Component } from "react";
import { InteractionManager, View, Text, Image, TouchableOpacity, ScrollView, Dimensions,TouchableHighlight, FlatList} from "react-native";
import { color,colorNew } from '../../modules/styles/theme'
import firebase from "react-native-firebase"
const { width,height } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";
import close from "./images/cancel_round_cross.png";
import moment from 'moment';

const ITEM_WIDTH = Math.round(width * 0.8);
const ITEM_HEIGHT = 70;

export default class extends Component {

  constructor(props) {
    super()
    
    console.log("constructor props");
    var sweatLogsEntry = []
    var completedWorkoutsEntry = []
    var bonusChallengesEntry = []
    var selfCareLogsEntry = []
    if (props.navigation && props.navigation.state.params) {
     sweatLogsEntry = props.navigation.state.params.sweatLogs ? props.navigation.state.params.sweatLogs : []
     completedWorkoutsEntry = props.navigation.state.params.completedWorkouts ? props.navigation.state.params.completedWorkouts : []
     bonusChallengesEntry = props.navigation.state.params.bonusChallenges ? props.navigation.state.params.bonusChallenges : []
     selfCareLogsEntry = props.navigation.state.params.selfCareLogs ? props.navigation.state.params.selfCareLogs : []
    }
    var logEntries = []
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    var sweatLogsDates = []
    let dateFormat = "MM/DD/YYYY"
    for (var i = sweatLogsEntry.length - 1; i >= 0; i--) 
    {
      var log = sweatLogsEntry[i]
      const date = new Date(log.createdAt);
      let createdDate = moment(log.createdAt).format(dateFormat);
      if (date >= firstDay && date <= lastDay) {
          console.log("Test : ")
          console.log(date)
          console.log(firstDay)
          console.log(lastDay)
          console.log(log)
          console.log(createdDate)
          if (sweatLogsDates.includes(createdDate) == false) {
            sweatLogsDates.push(createdDate)
            logEntries.push(log)
          }
      }
    }
    console.log("sweatLogsDates : ")
    console.log(sweatLogsDates)
    for (var i = completedWorkoutsEntry.length - 1; i >= 0; i--) 
    {
      var log = completedWorkoutsEntry[i]
      const date = new Date(log.createdAt);
      let createdDate = moment(log.createdAt).format(dateFormat);

      if (date >= firstDay && date <= lastDay) {
          console.log("Test : ")
          console.log(date)
          console.log(firstDay)
          console.log(lastDay)
          console.log(log)
          console.log(createdDate)
          console.log("sweatLogsDates.includes")
          console.log(sweatLogsDates.includes(createdDate))
          if (sweatLogsDates.includes(createdDate) == false) 
          {
            logEntries.push(log)
          }
      }
    }
    console.log("logEntries ==>")
    console.log(logEntries)
    this._onItemPressed = this._onItemPressed.bind(this);
    this.state = {
      entryList: logEntries,
      sweatLogs: sweatLogsEntry,
      completedWorkouts: completedWorkoutsEntry,
      bonusChallenges: bonusChallengesEntry,
      selfCareLogs: selfCareLogsEntry,
      categories: null
    }
  }
  _viewOrEditDays = () => {
    console.log('viewOrEditDays');
  }
  _shareCalendar = () => {
    console.log('shareCalendar'); 
  }
  _onDayPressed = date => {
   console.log('onDayPressed');  
   console.log(date);  
  }
  componentDidMount() {

  }
  renderButton1(text) 
  {
      return (
        <View style={styles.button1}>
          <Text allowFontScaling={false} style={styles.button1Text}>{text}</Text>
        </View>
      );
  }
  _onItemPressed = item => {
    console.log("item");
    const { name,avatar,level } = this.props.screenProps;
    let newParam = {"logData":item,"userDetail":{name,avatar,level}}
    this.props.navigation.navigate("JournalReview", newParam)
  }
  
  _renderItem = ({ item}) => {
    console.log(item);
    // let dateFormat = "YYYY-MM-DD"
    let dateFormat = "MM/DD/YYYY"
    let createdDate = moment(item.createdAt).format(dateFormat);
    let dayFormat = "dddd"
    let createdDay = moment(item.createdAt).format(dayFormat);
    let finalDate = createdDay.toUpperCase() + " - " + createdDate;
    console.log("item")
    console.log(finalDate)
    const {titleText,subTitle1,editText} = styles;
    return (
        <View style={styles.cellContainer}> 
          <View style={styles.cellInnerContainer}>
            <View style={{width:((ITEM_WIDTH-20) * 0.75),height: ITEM_HEIGHT-30,alignItems: "flex-start",flexDirection: "column",justifyContent: "space-between"}}>
              <Text style={styles.titleText}>{finalDate}</Text>
              <Text style={styles.subTitle1}>{item.Workout ? item.Workout : item.description ? item.description : "Self Care Day"}</Text>
            </View>
            <View style={{width:((ITEM_WIDTH-20) * 0.25),height: ITEM_HEIGHT-30,alignItems: "center",justifyContent: "center"}}>
            <TouchableOpacity activeOpacity={1} onPress={()=> this._onItemPressed(item)}>
            <View style={{width:"100%",height: "100%",alignItems: "flex-start",flexDirection: "column",justifyContent: "flex-start"}}>
              <Text style={styles.editText}>EDIT</Text>
            </View>
            </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  }

  renderEntriesView() 
  {
    console.log('renderEntriesView =>')
    console.log('this.state.entryList.length =>')
    console.log(this.state.entryList.length)
      const {nameStyle, levelStyle, weekStyle,titleText,selectedTrophyText,unselectedTrophyText,updateStatsText,whiteTitleText,goalEditText} = styles;
      return (
        <View  style={{ width :"85%",height:"65%",justifyContent: "center",alignItems: "center",borderRadius: 40,padding:20,backgroundColor:"#fff"}}>
        {this.state.entryList.length > 0 && (
            <FlatList
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: "100%", height: 1, backgroundColor: '#ddd' }} />}
              style={{width: "100%",backgroundColor: "#fff",padding:15}}
              data={this.state.entryList}
              renderItem={this._renderItem}
              extraData={this.state}
              keyExtractor={(item, index) => item + index}
            />
        )}
        {this.state.entryList.length === 0 && (
          <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.nameStyle}>{'You currently have no journal entries this month.\n\n Start a Sweat Sesh workout!'}</Text>
          </TouchableOpacity>
        )}
        </View>
      );
  }

  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps called in Journal");
    const { sweatLogs, completedBonusChallenges, completedWorkouts, selfCareLogs, filteredChallengeLogs } = props.screenProps;

    var sweatLogsEntry = []
    var completedWorkoutsEntry = []
    var bonusChallengesEntry = []
    var selfCareLogsEntry = []
    if (props.navigation && props.navigation.state.params) {
     sweatLogsEntry = sweatLogs ? sweatLogs : []
     completedWorkoutsEntry = completedWorkouts ? completedWorkouts : []
     bonusChallengesEntry = [...completedBonusChallenges, ...filteredChallengeLogs]
     selfCareLogsEntry = selfCareLogs ? selfCareLogs : []
    }
    var logEntries = []
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    var sweatLogsDates = []
    let dateFormat = "MM/DD/YYYY"
    for (var i = sweatLogsEntry.length - 1; i >= 0; i--) 
    {
      var log = sweatLogsEntry[i]
      const date = new Date(log.createdAt);
      let createdDate = moment(log.createdAt).format(dateFormat);
      if (date >= firstDay && date <= lastDay) {
          console.log("Test : ")
          console.log(date)
          console.log(firstDay)
          console.log(lastDay)
          console.log(log)
          console.log(createdDate)
          if (sweatLogsDates.includes(createdDate) == false) {
            sweatLogsDates.push(createdDate)
            logEntries.push(log)
          }
      }
    }
    console.log("sweatLogsDates : ")
    console.log(sweatLogsDates)
    for (var i = completedWorkoutsEntry.length - 1; i >= 0; i--) 
    {
      var log = completedWorkoutsEntry[i]
      const date = new Date(log.createdAt);
      let createdDate = moment(log.createdAt).format(dateFormat);

      if (date >= firstDay && date <= lastDay) {
          console.log("Test : ")
          console.log(date)
          console.log(firstDay)
          console.log(lastDay)
          console.log(log)
          console.log(createdDate)
          console.log("sweatLogsDates.includes")
          console.log(sweatLogsDates.includes(createdDate))
          if (sweatLogsDates.includes(createdDate) == false) 
          {
            logEntries.push(log)
          }
      }
    }
    console.log("logEntries ==>")
    console.log(logEntries)
    this.setState({"entryList": logEntries})
  }
  render() {
    console.log("render Journal");
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    return (
      <View style={{ width:'100%',height:'100%',justifyContent: "flex-start", alignItems: "center", backgroundColor: "#fff"}} >
      <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={colors}
            style={styles.linearGradient}>
            <View style={{width:"100%",height:"90%",alignItems: "center",justifyContent: "center",marginBottom:60}}>
            <View style={{width:"100%",alignItems: "flex-end",justifyContent: "center"}}>
              <View style={{width:"20%",alignItems: "flex-end",justifyContent: "center",marginRight:20}}>
                   <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
                      <Image source={close} />
                   </TouchableOpacity>
              </View>
            </View>
            <View style={{width:"100%",alignItems: "center",justifyContent: "center",padding:25}}>
              <Text style={styles.whiteTitleText}>Your Journal</Text>
            </View>
            {this.renderEntriesView()}
            </View>
          </LinearGradient>
      </View>
    );
  }
}

const styles = {
  titleText: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0.5,
    textAlign: "left",
    color: color.black,
    marginTop: 0
  },
  editText: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0.5,
    textAlign: "left",
    color: color.black,
    marginTop: 0
  },
  subTitle1: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    paddingLeft:0,
    textAlign: "left",
    color: color.mediumGrey,
    marginTop: 1
  },
  titleText: {
    width: "100%",
    height: 17,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 17,
    letterSpacing: 0.5,
    textAlign: "left",
    color: colorNew.textPink,
    marginTop: 0
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  whiteTitleText: {
    width: "100%",
    height: 28,
    fontFamily: "SF Pro Text",
    fontSize: 26,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 28,
    letterSpacing: 0.5,
    textAlign: "center",
    color: "#fff",
    marginTop: 0
  },
  levelStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.darkPink,
    marginTop: 0,
  },
  nameStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 20,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 0,
  },
  calenderDetailText: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontSize: 8,
    lineHeight: 10,
    textAlign: "center",
    fontStyle: "normal",
    color: color.mediumGrey,
    paddingLeft: 5,
    paddingRight: 5,
  },
  weekDayStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 5,
  },
  button1: {
    width: width*0.45,
    height: 55,
    borderRadius: 50/2,
    borderWidth: 2,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center"
  },
  button1Text: {
    width: width*0.40,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink
  },
  selectedTrophyText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    textDecorationLine: 'underline',
    color: color.mediumPink
  },
  unselectedTrophyText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#000"
  },
  seeAllTrophyText: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: color.lightGrey,
    marginTop: 0,
  },
  updateStatsText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft:8,
    textAlign: "left",
    color: "#000"
  },
  progressSubTitle1: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft:0,
    textAlign: "left",
    color: color.darkGrey
  },
  progressSubTitle2: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft:0,
    textAlign: "left",
    color: color.mediumGrey
  },
  goalEditText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    paddingLeft:8,
    textAlign: "left",
    color: "#fff"
  },
  viewAllProgressButtonStyle: {
    width: "95%",
    height: 60,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    alignItems: 'center',
    justifyContent: 'center',

  },
  createProgressButtonStyle: {
    width: "95%",
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',

  },
 buttonText: {
    width: "100%",
    height: 20,
    fontFamily: "Sofia Pro",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff"
  },
  cellInnerContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff"
  },
  cellContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    paddingLeft:0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  weekStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 0,
  }

}