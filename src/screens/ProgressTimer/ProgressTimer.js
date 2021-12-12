import React, { Component } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity, ImageBackground, Platform, ScrollView } from "react-native";
import { Timer, CountDown, ConnectedSpotifyMusicBar } from "../../components/common";
import { color,colorNew} from "../../modules/styles/theme"
import { LargeButton,MediumButton,ConnectedMusicButtonsWhite} from "../../components/common";
import LinearGradient from "react-native-linear-gradient";
import NextWorkOutFooter from "./NextMoveFooter"
import HeartAnimation from "./HeartAnimation";
import { EventRegister } from "react-native-event-listeners";
import { ArrowShopNow, CircleTimer} from "../../components/common/AnimatedComponents";

const { height, width } = Dimensions.get("window");

export default class ProgressTimer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isPaused: true,
      start: false
    }

    this.timerValue = "";
  }

  _pause() {
    this.setState({
      isPaused: true,
      start: false
    });
  }

  _reset = () => {
    this.setState({
      isPaused: true,
      start: false
    });
    this.timerValue = "";
    EventRegister.emit("resetTimer")
  }

  _playFromPause() {
    this.setState({
      isPaused: false,
      start: true
    })
  }
  _updateTimer(time) {
    // console.log("_updateTimer");
    // console.log(time);
    this.timerValue = time;
    console.log(this.timerValue);
  }
  renderCircuitDetail(circuitNumber,roundNumber)
  {
    if (circuitNumber != undefined && roundNumber != undefined) {
        return (
          <View style={{padding:2,width:"100%",justifyContent:"center",alignItems:"center",flexDirection:"row",marginTop:30}}>
            <Text allowFontScaling={false} style={styles.mainTitlePink}>{circuitNumber.toUpperCase()}</Text>
            <View style={{marginLeft:5,marginRight:5,width:4,height:4,backgroundColor:colorNew.textPink,justifyContent:"center",alignItems:"center",flexDirection:"row",borderRadius: 100}}>
            </View>
            <Text allowFontScaling={false} style={styles.mainTitlePink}>{roundNumber.toUpperCase()}</Text>
          </View>
        );
    }
    else
    {
      return null;
    }
  }

  completeWorkout()
  {
    console.log("completeWorkout called");
    console.log(this.timerValue);
    this.props.onCompletePress(this.timerValue);
  }

  render() {
    const { title, subTitleText, withTimer, nextMove, onClose, onCompletePress,restartTimer,onOutsideWorkoutPress,
    circuitNumber, roundNumber} = this.props;
    const { isPaused, start } = this.state
    // console.log("render ProgressTimer");
    const colors = [colorNew.darkPink,colorNew.lightPink];
    const {
      container,
      titleStyle,
      titleStyleNew,
      subtitleStyle,
      img,
      completeButton,
      smallButtonText,
      tinyButtonText,
      hmsTitle,
      subTitle,
      footerContainer
    } = styles;
          
    if (withTimer) {
      return (
        <View style={container}>
        <View style={styles.topContainer}>
          <Text allowFontScaling={false} style={styles.mainTitle}>Cardio Sweat Sesh</Text>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "flex-start", alignItems: "center", width: width }}>
          <View style={{ width: width, flex: 1, justifyContent: "flex-start", alignItems: "center",backgroundColor:"#fff" }} contentContainerStyle={container}>
            <View style={{ width: width * 0.9, flex: 1, justifyContent: "flex-start", alignItems: "center", marginTop:50,borderWidth:1,borderColor:colorNew.darkPink,borderRadius:20}} contentContainerStyle={container}>
              <Timer start={start} updateTimer={this._updateTimer.bind(this)}/>
              <View style={{ width: width * 0.9, height: 50, justifyContent: "space-evenly", alignItems: "center", flexDirection:"row"}} contentContainerStyle={container}>            
                <Text allowFontScaling={false} style={[styles.hmsTitle,{paddingLeft:10}]}>hours</Text>
                <Text allowFontScaling={false} style={[styles.hmsTitle,{paddingLeft:10}]}>minutes</Text>
                <Text allowFontScaling={false} style={[styles.hmsTitle,{paddingLeft:10}]}>seconds</Text>
              </View>
              <View style={{ width: width * 0.9,flex: 1,justifyContent: "space-evenly", alignItems: "center", flexDirection:"row"}} contentContainerStyle={container}>            
                <TouchableOpacity onPress={isPaused ? () => this._playFromPause() : () => this._pause()}>
                  <Image style={{ marginTop: 2,marginBottom: 20 }} source={isPaused ? require("./images/new_play.png") : require("./images/new_pause.png")} />
                </TouchableOpacity>
                { isPaused && this.timerValue != "" && <TouchableOpacity onPress={this._reset}>
                  <Image style={{ marginTop: 2,marginBottom: 20 }} source={isPaused ? require("./images/reset.png") : require("./images/new_pause.png")} />
                </TouchableOpacity>
                }
              </View>
            </View>
            <View style={{ width: width, flex: 1, justifyContent: "flex-start", alignItems: "center", marginTop:50}} contentContainerStyle={container}>
              <LinearGradient colors={colors} style={styles.container}>
                <View style={{ width: width * 0.9, flex: 1, justifyContent: "flex-start", alignItems: "center"}} contentContainerStyle={container}>
                  <Text allowFontScaling={false} style={[styles.subTitle,{marginTop:20}]}>Choose your music</Text>
                  <View style={{ marginTop: 12,marginBottom: 22,width:"100%",flexDirection:"row",justifyContent:"space-evenly"}}>
                    {this._renderMusicButtons()}
                    {/*<TouchableOpacity
                      style={styles.completeButton}>
                      <View>
                        <Text allowFontScaling={false} style={styles.tinyButtonText}>LSF PLAYLIST</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.completeButton}>
                      <View>
                        <Text allowFontScaling={false} style={styles.tinyButtonText}>MY MUSIC</Text>
                      </View>
                    </TouchableOpacity>*/}
                  </View>
                </View>  
              </LinearGradient>
            </View>  
            <View style={{ marginTop: 50 }}>
            <MediumButton
              onPress={this.completeWorkout.bind(this)}>
              <Text>Complete Workout</Text>
            </MediumButton>
          </View>
          <View style={{ marginTop: 22, marginBottom: 50 }}>
            <MediumButton
            onPress={() => EventRegister.emit("paywallEvent", onOutsideWorkoutPress)}>
              <Text>Outside Workout</Text>
            </MediumButton>
          </View>
          </View>
        </ScrollView>
      </View>

      );
      // return (
      //   <View style={{ width: width, flex: 1, justifyContent: "flex-start", alignItems: "center" }} contentContainerStyle={container}>
      //     {title ?
      //       <Text allowFontScaling={false} style={titleStyle}>
      //         {title}
      //       </Text>
      //       :
      //       null
      //     }
      //     {subTitleText ?
      //       <Text allowFontScaling={false} style={subtitleStyle}>
      //         {subTitleText}
      //       </Text>
      //       :
      //       null
      //     }
      //     <Timer start={start} />
      //     <ImageBackground style={img} resizeMode={"center"} source={require("./images/iconHeart.png")}>
      //       <TouchableOpacity onPress={isPaused ? () => this._playFromPause() : () => this._pause()}>
      //         <Image style={{ marginTop: 40 }} source={isPaused ? require("./images/iconPlay.png") : require("./images/pause.png")} />
      //       </TouchableOpacity>
      //     </ImageBackground>
      //     <TouchableOpacity style={{ ...completeButton, marginTop: 0, width: 0.7 * width, zIndex: 10 }} onPress={onCompletePress}>
      //       <View>
      //         <Text allowFontScaling={false} style={{ ...smallButtonText, width: "100%" }}>COMPLETE WORKOUT</Text>
      //       </View>
      //     </TouchableOpacity>
      //     <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 0 }}>
      //       <ConnectedSpotifyMusicBar />
      //     </View>
      //   </View>
      // );

    } else {
      // console.log('circuitNumber')
      // console.log(circuitNumber)
      // console.log('roundNumber')
      // console.log(roundNumber)
      const containerStyle = {
        ...container,
        marginBottom: Platform.OS === "android" ? 20 : 0
      };

      return (
        <View style={containerStyle}>
          {this.renderCircuitDetail(circuitNumber,roundNumber)}
          <Text allowFontScaling={false} style={titleStyleNew}>
            {title}
          </Text>
          <Text allowFontScaling={false} style={subtitleStyle}>
            {subTitleText}
          </Text>
          <View style={{ marginTop: 55, justifyContent: "center", alignContent: "center"}}>
              <CircleTimer animatedView={{width:width*0.9 ,height: width*0.9,top:Platform.OS === "android" ? 0 : -20,margin:0}} />
              <View style={{position: "absolute", width: "100%", height: "100%",justifyContent:"center",alignItems:"center",right:-10,top:Platform.OS === "android" ? 30 : -30}}>
              <CountDown isTextBlack={true} start={restartTimer} initial={59} onClose={onClose} />
              <Text allowFontScaling={false} style={[styles.hmsTitle,{paddingLeft:10,marginTop:-5,color:'#000'}]}>seconds left</Text>
              </View>
          </View>
          <View style={footerContainer}>
            <NextWorkOutFooter nextMove={nextMove} onClose={onClose} />
          </View>
        </View>
      );

    }
  }

  _renderMusicButtons() {
    return <ConnectedMusicButtonsWhite />;
  }

};

const styles = {
  container: {
    width: width,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    backgroundColor:"#fff"
  },
  mainTitlePink: {
    marginTop: 10,
    marginBottom: 10,
    lineHeight:18,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
    zIndex: 4,
  },
  mainTitle: {
    width: "100%",
    height: 32,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 0,
    marginBottom: 20,
  },
  completeButton: {
    width: 315,
    height: 48,
    borderColor: color.mediumPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    width: "100%",
    height: 34,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    marginLeft:30,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
    marginTop: 5,
    marginBottom: 5,
  },
  hmsTitle: {
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#AFAFAF",
    marginTop: 35,
    marginBottom: 45,
  },
 topContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorNew.darkPink
  },
  footerContainer: {
    flex: 1,
    marginBottom:20,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  titleStyle: {
    fontFamily: "SF Pro Text",
    fontSize: 38,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  titleStyleNew: {
    fontFamily: "SF Pro Text",
    fontSize: 24,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center"
  },
  subtitleStyle: {
    width: 240,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  img: {
    width: width,
    height: width,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40

  },
  modalContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  modalContent: {
    justifyContent: "flex-start",
    flex: 1
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginTop: 15
  },
  smallButtonText: {
    width: 105,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#fff"
  },
  tinyButtonText: {
    width: 105,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1.5,
    textAlign: "center",
    color: "#fff"
  },
  completeButton: {
    width: 150,
    height: 48,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },


};
