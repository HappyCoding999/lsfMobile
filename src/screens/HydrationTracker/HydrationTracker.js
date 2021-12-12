import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Platform, ScrollView, Dimensions, NativeModules, Modal } from "react-native";
import { color, colorNew } from "../../modules/styles/theme";
import { subscribeUserToEmailList } from '../../utils';
import firebase from 'react-native-firebase';
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-navigation"
import { BottleFillingUp, SmallBottleFillingUp} from "../../components/common/AnimatedComponents";
import { ic_back_white } from "../../images";
import { EventRegister } from "react-native-event-listeners";

import LottieView from 'lottie-react-native';
// import KeyframesView from 'react-native-facebook-keyframes'

import bottleFillingUp from '../../animations/bottleFillingUp.json';

const ProdChecker = NativeModules.ProdChecker;

const { height, width } = Dimensions.get('window');

const button_cancel_black = require('./images/cancel_black.png');
const button_cancel_grey = require('./images/cancel_gray.png');
const button_plus = require('./images/plus.png');
const button_minus = require('./images/minus.png');
const log_water_bottle = require('./images/log_water.png');
const filled_water_bottle = require('./images/bottle_fill.png');
const water_bottle = require('./images/bottle_blank.png');

import { info_grey } from "../../images";


class HydrationTracker extends Component {

  constructor(props) {
    super(props)
    const { goals} = this.props.screenProps;
    const { dailyWaterIntake} = goals;
    console.log(dailyWaterIntake)
    this.hideInfo = this.hideInfo.bind(this);
    this.logWatterBottle = this.logWatterBottle.bind(this);
    this.state = {
      productsList: null,
      showInfoModal: false,
      imageFor: null,
      waterBottleRequired: dailyWaterIntake.target,
      selectedWaterBottole: '20oz',
      logWaterBottole: dailyWaterIntake.current,
      checked: false,
      lastPressed: '',
      showAnimation: false
    }
  }

  async componentDidMount() {
    
  }

  buttonSelected = async (buttonText) => {
      console.log('buttonText: ', buttonText);
  }

 renderButton(buttonText)
  {
    return(
          <View style={styles.planViewContainer}>
            <View style={styles.planView}>
              <TouchableOpacity style={{ height: "100%",justifyContent: 'center', alignItems: 'center'}} onPress={() => this.buttonSelected(buttonText)}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '95%', height: "90%",margin:15}}>
              <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '95%', height: "100%"}}>
              <Text style={styles.planSubtitle}>
                {buttonText}
              </Text>
              </View>
              </View>
              </TouchableOpacity>
            </View>
          </View>
      )
  }
  showInfo(){
    console.log("showInfo")
      this.setState({
      showInfoModal: true,
    })
  }
  hideInfo() {
    console.log("hideInfo")
      this.setState({
      showInfoModal: false,
    })
  }  
  renderTitleView(text) 
  {

    return(
          <Text style={styles.titleText}>
              {text}
          </Text>
      )
  }
  logWatterBottlePlus = async () => {
    var loggedBottle = this.state.logWaterBottole
    if (loggedBottle < this.state.waterBottleRequired) {
      loggedBottle = this.state.logWaterBottole + 1
    }
      this.setState({
      logWaterBottole: loggedBottle,lastPressed:'plus',
    })
    this.animation.play();
  }
  logWatterBottleMinus = async () => {
    var loggedBottle = this.state.logWaterBottole
    if (loggedBottle > 0) {
      loggedBottle = this.state.logWaterBottole - 1
    }
      this.setState({
      logWaterBottole: loggedBottle,lastPressed:'minus',
    })
  }
  waterBottleTextSelected = async (buttonText) => 
  {
      console.log('waterBottleTextSelected');
      console.log('buttonText: ', buttonText);
      var size = parseInt(buttonText.replace('oz',''));
      var bottoleCount = 80/size;
       var newCount = parseInt(80/size);
      if (80%size > 0) {
        bottoleCount = newCount + 1;
      }
      console.log(bottoleCount);
      this.setState({
      selectedWaterBottole: buttonText,
      waterBottleRequired:bottoleCount,
    })
  }
  renderWaterBottleText(text) 
  {
    return(
        <TouchableOpacity onPress={() => this.waterBottleTextSelected(text)}>
          <Text style={this.state.selectedWaterBottole == text ? styles.waterBottoleSelectedText : styles.waterBottoleNormalText}>
            {text}
          </Text>
        </TouchableOpacity>
      )
  }
  renderBottlesWithAnimation(index) 
  {
    let loggedBottle = this.state.logWaterBottole
    console.log(loggedBottle);
    if (index == loggedBottle - 1 && this.state.lastPressed == 'plus') {
      return <SmallBottleFillingUp animatedView={{ height: '100%',top:0,margin:0}} />
    }
    else
    {
      // return <Image style={{ height: '75%',top:0,margin:12}} resizeMode="contain" source={ loggedBottle > index ? filled_water_bottle : water_bottle} />
      return <Image style={{ height: '70%',top:0,margin:2}} resizeMode="contain" source={ loggedBottle > index ? filled_water_bottle : water_bottle} />
    }
  }
  renderBottles(count) {
    const bottoles = [];
    let loggedBottle = this.state.logWaterBottole
    console.log(loggedBottle);
    for (let i=0; i < count; i++) {
        bottoles.push(
          this.renderBottlesWithAnimation(i)
        );

        // bottoles.push(
        //   <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={ loggedBottle > i ? filled_water_bottle : water_bottle} />
        // );
    }
    return bottoles;
  }
  renderWaterBottle() 
  {
    let count = this.state.waterBottleRequired;
    if (count < 11) {
        return(
        <View style={{flex:1,flexDirection:'row',justifyContent: 'center', alignItems: 'center',  width: '100%', marginTop:10,marginBottom:0}}>
            {this.renderBottles(count)}
        </View> 
      )
    }
    else
    {
      return(
        <View style={{flex:1,flexDirection:'row',justifyContent: 'space-evenly', alignItems: 'center',  width: '100%', marginTop:10,marginBottom:0}}>
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={filled_water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
            <Image style={{ height: '70%',top:0,margin:5}} resizeMode="contain" source={water_bottle} />
        </View> 
      )
    }
  }
  renderAnimatedView() 
  {
    console.log("Vishal - renderAnimatedView called")
    return(
          <View>
            <LottieView
              ref={animation => {
                this.animation = animation;
              }}
              loop={false}
              style={{ height: '100%'}}
              source={bottleFillingUp}
            />
        </View>
    )
  }
  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height:(0.5 * (elevation+15))},
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }
  renderMain() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    return (
      <View style={[this.shadowBottom(5),styles.container]}>
        <View style={{flex:1,justifyContent: 'center', alignItems: 'center', width: '90%',marginLeft:"5%"}}>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 25,height:"13%"}}>
          {this.renderTitleView('HYDRATION GOAL')}
            <View style={{position: "absolute",height:"100%",zIndex: 0,width:"100%",marginLeft:width-80,justifyContent:"center",alignItems:"flex-end"}}>
              <TouchableOpacity onPress={() => this.showInfo()}>
                <Image style={{ height: '50%',top:'-25%',tintColor:'#b2b2b2'}} resizeMode="contain" source={info_grey} />
                </TouchableOpacity>
                <TouchableOpacity>
                   <Text style={{ fontFamily: 'Sofia Pro', color: '#000', fontSize: 11, lineHeight: 15, fontWeight: '500', textAlign: 'center',width:"100%",padding:0}}>
                   {/*EDIT*/}
                  </Text>
                </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'Sofia Pro', color: colorNew.textPink, fontSize: 17,lineHeight: 18, textAlign: 'center',fontWeight: '300',width:"90%",marginTop:10,marginBottom:5}}>
            {'80 ounces per day'}
          </Text>
        </View>
        <View style={{ width: '100%', backgroundColor:"#000",height:1,marginTop:10,marginBottom:0}}/>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 15,height:"13%"}}>
        {this.renderTitleView('WATER BOTTLE OUNCES')}
          <Text style={{ fontFamily: 'Sofia Pro', color: '#000', fontSize: 16, lineHeight: 19, fontWeight: '500', textAlign: 'center',width:"100%",padding:0}}>
              
          </Text>
          <View style={{flexDirection:'row',justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: 10,backgroundColor:"#fff"}}>
          {this.renderWaterBottleText('8oz')}
          {this.renderWaterBottleText('16oz')}
          {this.renderWaterBottleText('20oz')}
          {this.renderWaterBottleText('24oz')}
          {this.renderWaterBottleText('32oz')}
          </View>  
        </View>
        <View style={{ width: '100%', backgroundColor:"#000",height:1,marginTop:10,marginBottom:0}}/>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%',height:"27%"}}>
          <Text style={{marginTop:15, fontFamily: 'Sofia Pro', color: '#000', fontSize: 16, lineHeight: 18, fontWeight: '500', textAlign: 'center',width:"100%"}}>
              DRINK <Text style={{marginTop:15, fontFamily: 'Sofia Pro', color: colorNew.textPink,textDecorationLine: 'underline', fontSize: 18, lineHeight: 20, fontWeight: '500', textAlign: 'center',width:"100%"}}>
               {'4 '} 
            </Text>
            {'BOTTLES TO\nREACH YOUR HYDRATION GOAL'}
          </Text>
            {this.renderWaterBottle()}
        </View>     
        <View style={{ width: '100%', backgroundColor:"#000",height:1,marginTop:10,marginBottom:0}}/>
        <View style={{flex:1,justifyContent: 'center', alignItems: 'center', width: '100%',marginTop:20}}>
        {this.renderTitleView('LOG WATER')}
          <View style={{flex:1,flexDirection:'row',justifyContent: 'center', alignItems: 'center',  width: '100%', marginTop:10,marginBottom:0}}>
            <TouchableOpacity onPress={() => this.logWatterBottleMinus()}>
              <Image style={{ height: '90%',top:0}} resizeMode="contain" source={button_minus} />
            </TouchableOpacity>
            {this.renderAnimatedView()}
            <TouchableOpacity onPress={() => this.logWatterBottlePlus()}>
              <Image style={{ height: '90%',top:0}} resizeMode="contain" source={button_plus} />
            </TouchableOpacity>
          </View>   
        </View>     
        </View> 
      </View>
    );
  }
  logWatterBottle ()
  {
    console.log("HydrationTracker logWatterBottle")
      var loggedWatterBottle =  this.state.logWaterBottole
      var selectedWaterBottole =  this.state.selectedWaterBottole

      const { saveBottleCount } = this.props.screenProps;

      if (loggedWatterBottle <= this.state.waterBottleRequired) 
      {
        console.log("saveBottleCount called");
        saveBottleCount(loggedWatterBottle);
        this.props.onClose();
        // saveBottleCount(loggedWatterBottle,selectedWaterBottole);
      }
  }
  render() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    
      return (
        <View style={{ width: width, backgroundColor: colorNew.darkPink, marginTop: 0,height:height}}>
          <SafeAreaView forceInset={{ top: "always" }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={colors}
            style={styles.linearGradient}>
            <View style={{justifyContent:"center"}}>
            {/* <View style={{position: "absolute",height:40,zIndex: 3,width:40,marginLeft:0,justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity onPress={() => EventRegister.emit("paywallEvent", this.logWatterBottle)}>
                <Image style={{ height: '90%',top:0,tintColor:'#fff'}} resizeMode="contain" source={ic_back_white} />
              </TouchableOpacity>
            </View> */}
            <Text style={{ fontFamily: 'Sofia Pro', color: '#fff', fontSize: 25, fontWeight: 'bold', textAlign: 'center',width:"100%",padding:40}}>
              Hydration Tracker
            </Text>
            <View style={{position: "absolute",height:30,zIndex: 0,width:30,marginLeft:width-80,justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity onPress={() => this.props.onClose()}>
                <Image style={{ height: '90%',top:0,tintColor:'#fff'}} resizeMode="contain" source={button_cancel_black} />
                </TouchableOpacity>
            </View>
            </View>
            {this.renderMain()}
            <View style={{backgroundColor:color.mediumPink,height:44,borderRadius: 100,margin:15,borderColor: '#fff',borderWidth:2,justifyContent:"center"}}>
            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center"}}
              onPress={() => EventRegister.emit("paywallEvent", this.logWatterBottle)}
            >
              <Text allowFontScaling={true} adjustsFontSizeToFit={true} minimumFontScale={.70} numberOfLines={1} ellipsizeMode={"tail"} style={{
                fontFamily: "SF Pro Text",fontSize: 15,fontWeight: "bold",fontStyle: "normal",padding:5,
                letterSpacing: 0,textAlign: "center",color: "#fff",marginTop: 0}}>
                  LOG BOTTLES
                </Text>
            </TouchableOpacity>
            </View> 
          </LinearGradient>
          {this._renderInfoModal()}        
          </SafeAreaView>
        </View>
      );
    }
    _renderInfoModal() {
    const { showInfoModal } = this.state;
    if (!this.state.showInfoModal)
    return null
    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showInfoModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => { this.hideInfo, console.log("Dialogue Closed") }}>
          <View style={styles.window}>
            <View style={styles.dialogue}>
            <View style={{justifyContent:"center",alignItems:"flex-end",width:"100%"}}>
            <View style={{height:30,zIndex: 0,width:30,marginRight:20,marginTop:20,justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity onPress={() => this.hideInfo()}>
                <Image style={{ height: '90%',top:0,tintColor:colorNew.bgGrey}} resizeMode="contain" source={button_cancel_black} />
                </TouchableOpacity>
            </View>
            </View>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>HYDRATION</Text>
              <Text allowFontScaling={false} style={styles.infoMiddleText}>We suggest drinking half your{'\n'}body weight in water each day.</Text>
              <Text allowFontScaling={false} style={styles.infoBottomText}>Take your weight, devide that number by 2.{'\n'}This number is how much water (in ounces){'\n'}you should drink everyday.</Text>              
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  waterBottoleSelectedText: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.textPink,
    textDecorationLine: 'underline', 
    fontSize: 16, 
    fontWeight: 'normal', 
    textAlign: 'center',
    width:"100%",
    padding:0
  },
  waterBottoleNormalText: { 
    fontFamily: 'Sofia Pro', 
    color: '#000', 
    fontSize: 15, 
    fontWeight: 'normal', 
    textAlign: 'center',
    width:"100%",
    padding:0
  },
  titleText: {
    fontFamily: 'Sofia Pro', 
    color: '#000', 
    fontSize: 16, 
    lineHeight: 19, 
    fontWeight: '500', 
    textAlign: 'center',
    width:"100%",
    padding:0
  },
  linearGradient: {
    width: "100%",
    height: height,
    marginTop: Platform.OS === "ios" ? -40 : 0,
    padding:"8%",
  },
  container: {
    width: "100%",
    height: "82%",
    marginTop:"1%",
    borderRadius: 40,
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  mainTitle: {
    width: "100%",
    height: 120,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center"
  },
  primaryText: {
    width: 120,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    color: "#ffffff",
    marginTop: 12,
    marginLeft: 26
  },
  secondaryText: {
    width: 200,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    color: "#f7f7f7",
    marginLeft: 26,
    marginTop: -2
  },
  priceText: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff"
  },
  priceText2: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff"
  },
  readyText: {
    width: 146,
    height: 26,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 26,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24
  },
  freeWorkoutsText: {
    width: 175,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
    textDecorationLine: "underline"
  },
  legalText: {
    width: "96%",
    height: 200,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black
  },
  legalText2: {
    width: 300,
    height: 54,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  },
  bubbleSelected: {
    padding : 10,
    marginLeft:5,
    height: 35,
    top: 10,
    backgroundColor: color.lightPink,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.lightPink,
    borderWidth: 1
  },
  goalViewContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
    marginTop:30
  },
  planViewContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
    marginTop:15
  },  
  planSaveText: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.white, 
    fontSize: 16,
    letterSpacing: 0, 
    fontWeight: 'bold', 
    textAlign: 'left',
    width:"100%",
    marginLeft:0
  },
  planTitle: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.darkPink, 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'left',
    width:"100%",
    marginLeft:10
  },
  planTitleSelected: { 
    fontFamily: 'Sofia Pro', 
    color: color.white, 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'left',
    width:"100%",
    marginLeft:10
  },
  planSubtitleSelected: { 
    fontFamily: 'Sofia Pro', 
    color: color.white, 
    fontSize: 18, 
    fontWeight: 'normal', 
    textAlign: 'center',
    width:"100%"
  },
  planSubtitle: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.mediumPink, 
    fontSize: 18, 
    fontWeight: '500', 
    textAlign: 'center',
    width:"100%"
  },
  beforeAfterText: {
    fontFamily: 'Sofia Pro', 
    color: colorNew.bgGrey, 
    fontSize: 14,
    lineHeight: 20, 
    textAlign: 'center',
    fontWeight: '300',
    width:"90%",
    marginTop:25
  },
  planViewSelected: {
    width: '90%',
    backgroundColor:colorNew.darkPink,
    borderRadius: 100
  },
  planView: {
    width: '80%',
    backgroundColor:color.white,
    borderRadius: 100,
    borderColor:colorNew.darkPink,
    borderWidth:1
  },
  progressMainlView: {
    width: '90%',
    height: width*0.98,
    backgroundColor:colorNew.lightPink,
    borderRadius: 20,
    borderColor:colorNew.darkPink,
    borderWidth:2
  },
  progressImageView: {
    width: '100%',
    height: "20%",
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  progressBeforeAfterView: {
    width: '100%',
    height: "68%",
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  progressPhotoView: {
    width: '44%',
    borderRadius: 20,
    borderColor:colorNew.bgGrey,
    borderWidth:1,
    justifyContent: 'center', 
    alignItems: 'center',
    height: "95%",
    backgroundColor:'white'
  },
  modalContainer: {
    flex: 1,
  },
  window: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(148,148,148,0.5)'
  },
  dialogue: {
    width: "90%",
    height: 240,
    borderRadius: 50,
    borderWidth: 2,
    borderColor:colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  infoMiddleText: {
    width: "90%",
    marginTop:0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#828282"
  },
  infoBottomText: {
    width: "90%",
    marginTop:20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#929292"
  },
  modalHeaderText: {
    width: "90%",
    height: "15%",
    marginTop:0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink
  },
  button1: {
    width: width*0.65,
    padding:10,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor:color.mediumPink,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center"
  },
  button1Text: {
    width: "90%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.white
  },
  progressLSFView: {
    width: '100%',
    height: "12%",
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'transparent'
  }
})

export default HydrationTracker;