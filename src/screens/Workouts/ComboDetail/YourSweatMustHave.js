import React, { Component } from "react";
import { View, Image, Text, TouchableHighlight, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import Video from "react-native-video";
import { EventRegister } from "react-native-event-listeners";
import { color } from "../../../modules/styles/theme"
import { ConnectedMusicButtons } from "../../../components/common";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { height,width } = Dimensions.get('window');

const GEAR_ITEM_WIDTH = Math.round(width * 0.72);
const GEAR_ITEM_HEIGHT = (width * 1.5)/5;


export default class extends Component {


  componentDidMount() {
  
  }

  componentWillUnmount() {
    
  }

  render() {
    const {
      subTitleNew,
    } = styles;
    return (
        <View style={styles.container}>
        <Text allowFontScaling={false} style={{...subTitleNew,color:"#000"}}>Your Sweat Must Haves</Text>
        {this._renderGears()}
        </View>
    );
  }
  _renderGears() 
  {
      const {nameStyle, levelStyle, weekStyle,titleText,selectedTrophyText,unselectedTrophyText,updateStatsText,whiteTitleText,goalEditText} = styles;
      return (
        <View  style={{ width :"100%",height:GEAR_ITEM_HEIGHT + 40,justifyContent: "center",alignItems: "center",borderRadius: 40,paddingHorizontal:20,backgroundColor:"#fff"}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{ width: 20, height: "100%", backgroundColor: 'transparent' }} />}
            style={{width: "100%",backgroundColor: "#fff",padding:0}}
            data={this.state.gearList}
            renderItem={this._renderGearItems}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      );
  }
  _renderGearItems = ({ item}) => {
    console.log("_renderGearItems called");
    return (
            <View style={{alignItems: "flex-start",flexDirection: "column",justifyContent: "center",width:GEAR_ITEM_HEIGHT}}>
              <View style={{width:GEAR_ITEM_HEIGHT,height:GEAR_ITEM_HEIGHT,alignItems: "center",flexDirection: "column",justifyContent: "center",backgroundColor:colorNew.boxGrey,borderRadius: 10}}>
              </View>
              <Text style={[styles.gearTitleText,{color:"#000",fontSize: 10,fontWeight: "700",textAlign: "left",paddingLeft:5}]}>{item.toUpperCase()}</Text>
            </View>
      );
  }
}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white"
  },
  subTitleNew: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft:"10%",
    fontFamily: "SF Pro Text",
    fontSize: 26,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
    width: width

  },
  mainTitle: {
    width: 174,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 20,
  },
  circuitName: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 5
  },
  workoutContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 135.4,
    height: 135.4,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 12,
    shadowOpacity: 1
  },
  buttonView: {
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: "center",
    marginLeft: 5
  },
  buttonText: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginLeft: 0,

  },
  workoutText: {
    width: 108,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: "#333",
    marginTop: 10,
    flex: 1
  },
  completeButton: {
    width: 315,
    height: 48,
    borderColor: color.hotPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute"
  },
  smallButtonText: {
    width: 315,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.hotPink
  },
  carouselContainer: {
      marginTop: 0,
      marginBottom: 0
   },
  instructions: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.hotPink,
    textAlign: "center",
    margin: 5
  }
};



