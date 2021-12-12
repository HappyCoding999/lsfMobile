import React, { Component } from "react";
import { View, Text, Dimensions,StyleSheet,ImageBackground, Image, Modal, TouchableOpacity, Platform, Linking, CameraRoll, PermissionsAndroid } from "react-native";
import { sample, range } from "lodash";
import { color, colorNew } from "../../modules/styles/theme"
import { Subscriptions } from "../../components/common"
import { EventRegister } from "react-native-event-listeners";
import LinearGradient from "react-native-linear-gradient";
import { captureRef } from "react-native-view-shot";
import { icon_close_x_pink,premium_end_bg,premium_end_bottom_image_combo} from "../../images";


const { height, width } = Dimensions.get('window');

class ExplainerScreen extends Component {
  constructor(props) {

    super(props);
    this.state = 
    {
      currentPageIdx: 0,
      totalPage:4,
    }
  }

  isIphoneXorAbove() {

    const dimen = Dimensions.get('window');

    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
  }


  _renderEndscreenNew = () => {
    const bgWidthRatio = 414/700;
    const bgRatio = 700/414;
    var imageStyle = {flex: 1, height: height, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
    if (Platform.OS === "ios") {

      if (this.isIphoneXorAbove()) {
        imageStyle = {flex: 1, height: height, width: width, top: -64, resizeMode: 'contain', backgroundColor: 'white'};
      } else {
        imageStyle = {flex: 1, height: height + 20, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
      }

    } else {
      imageStyle = {flex: 1, height: height, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
    }

    const colors = [colorNew.darkPink, colorNew.lightPink];
    const topMargin = Platform.OS === "ios" ? 0 : 44;
    const bottomMargin = (height * 0.20);
    const newWidth = (width*0.90)
    const newHeight = (newWidth*bgRatio)-topMargin
    const imagePadding = 13
    return(
      <View ref="snapshot" style={{ width :newWidth,height:newHeight,justifyContent: "center",alignItems: "center",borderRadius: 40,overflow: 'hidden',top:20,backgroundColor:"#fff"}}>
          <View  style={{ width :"100%",height:"25%",justifyContent: "center",alignItems: "center",top:2,marginBottom:10}}>          
            <Text allowFontScaling={false} style={{...styles.headingText,width:"85%",fontSize: 16,height:30,letterSpacing: 0}}>{"HERE'S HOW IT WORKS"}</Text>
            <Text allowFontScaling={false} style={{...styles.bottomWayText,width: "85%",color: colorNew.boxGrey, textAlign: "center",fontWeight: "bold",fontSize: 10,marginRight:0,marginLeft:0,marginTop:20,marginBottom:10,letterSpacing: 0}}>
            Complete your Daily 10 and Sweat Sesh everyday. If you're feeling
             extra, do a Bonus Sweat or full length video too! 
             Join us for our Challanges for extra motivation, results and prices.
            </Text>
          </View>
          <View style={{ width :"45%",height:"40%",justifyContent: "center",alignItems: "center",marginTop:0,marginBottom:30,backgroundColor:colorNew.bgGrey,borderRadius: 40}}>
          </View>
          <View  style={{ width :"100%",height:"20%",justifyContent: "center",alignItems: "center",marginTop:30,bottom:30}}>
            <Text numberOfLines={2} allowFontScaling={false} style={{...styles.bottomWayText,width: "85%",color: colorNew.boxGrey, textAlign: "center",fontWeight: "bold",fontSize: 10,marginRight:0,marginLeft:0,letterSpacing: 0}}>Subtitle here to explain what's happening in the screen record above^ that is automatically transitioning</Text>
            <View style={{height:30,width:"100%",marginLeft:0,marginTop:10,marginBottom:20,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
              {this.renderDotes()}
            </View>
            <View style={{ width:"100%",flex: 1, justifyContent: 'center',marginTop:15, marginBottom: 15 }}>
            <View style={styles.shareBtnsContainer}>
               <TouchableOpacity
                activeOpacity={.5}
                style={styles.buttonView}
                onPress={this.props.onClose}
                underlayColor={'#ee90af'}>
                  <Text style={styles.buttonText}>GOT IT!</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
      </View>
      ) 
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderEndscreenNew()}
      </View>
    );
  }
  renderDotes() {
    const dotes = [];
    // const {
    //   currentExerciseIdx,
    //   currentPageIdx,
    //   totalPage,
    // } = this.props;

    const {
      currentPageIdx,
      totalPage,
    } = this.state;

    const {
      pageDotContainer,
      paginationDot,
      paginationInnerDotActive,
      paginationDotInactive,
    } = styles;
    console.log(totalPage);
    for (let i=0; i < totalPage; i++) {
        dotes.push(
          <View style={currentPageIdx == i ? paginationDot :   paginationDotInactive}>
           {currentPageIdx == i ? <View style={paginationInnerDotActive}/> : null}
          </View>
        );
    }
    return dotes;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    top : Platform.OS === "ios" ? 0 : 0,
  },
  pageDotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20
  },
  paginationDot: {
      marginTop: 5,
      marginBottom: 5,
      width: 12,
      height: 12,
      borderWidth: 0.5,
      borderRadius: 6,
      justifyContent:"center",
      alignItems:"center",
      borderColor: colorNew.mediumPink,
      marginHorizontal: 1
    },
  paginationInnerDotActive: {
    width: 6,
    height: 6,
    backgroundColor:colorNew.mediumPink,
    borderWidth: 0,
    borderRadius: 4,
  },
  paginationDotInactive: {
    marginTop: 5,
    marginBottom: 5,
    width: 4,
    height: 4,
    backgroundColor:colorNew.boxGrey,
    borderWidth: 0,
    borderRadius: 4,
    marginHorizontal: 6
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  bottomDailyText: {
    width: "100%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 25,
    marginTop:10,
    marginBottom:10,
    letterSpacing: 4,
    textAlign: "right",
    color: '#fff'
  },
  bottomDoneText: {
    width: "20%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 4,
    textAlign: "center",
    color: '#fff'
  },
  bottomWayText: {
    width: "90%",
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 5,
    textAlign: "right",
    color: colorNew.textPink
  },
  headingText: {
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 4,
    padding:0,
    textAlign: "center",
    color: colorNew.textPink
  },
  d10HeadingText:{
    width: 249,
    height: 80,
    fontFamily: "Northwell",
    fontSize: 50,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 80,
    textAlign: "center",
    letterSpacing: 4,
    color: '#fff'

  },
  shareBtnsContainer: {
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%",
    marginTop:20,
    marginBottom:20,
    height: 44
  },
  buttonView: {
    height: 44,
    width: "50%",
    borderRadius: 100,
    borderColor:colorNew.mediumPink,
    borderWidth:1,
    backgroundColor: colorNew.white,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: "row"
  },
  buttonText: {
    width: "90%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.mediumPink,
    marginLeft: 0,
  }
})

export default ExplainerScreen;