import React, { Component } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, Dimensions, Platform, FlatList} from "react-native";
import { color,colorNew } from "../../../modules/styles/theme";


const GEAR_ITEM_WIDTH = Math.round(width * 0.72);
const GEAR_ITEM_HEIGHT = (width * 1.5)/5;


class YourSweatMustHave extends Component {

  state = {
    gearList: ["LSF Booty Bands","Workout Mat","Dumbbells","LSF Booty Bands","Workout Mat","Dumbbells","LSF Booty Bands","Workout Mat","Dumbbells"]
  };

  render() {
    const {
      container,
      subTitleNew,
    } = styles;

    return (
      <View style={container}>
        <Text allowFontScaling={false} style={{...subTitleNew,color:"#000"}}>Your Sweat Must Haves</Text>
        {this._renderGears()}
      </View>
    );
  }

  _renderGears() 
  {      
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
    justifyContent: "flex-start",
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
  gearTitleText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 10
  }
};

export default YourSweatMustHave;