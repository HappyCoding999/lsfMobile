import React, { Component } from "react";
import { View, Image, Text, Dimensions, TextInput, ScrollView} from "react-native";
import {color} from "../../../../../modules/styles/theme"
import {GradientSlider} from "../../../../../components/common"

const { height, width } = Dimensions.get('window');


export default class extends Component {
    constructor(props) {

        console.log(props.navigation.state.params)

        super(props);

        this.state = {

        };
    }

    render(){

        const sweatLog = this.props.navigation.state.params

        var date = new Date(sweatLog.createdAt)
        var monthNames = [
          "Jan", "Feb", "Mar",
          "Apr", "May", "Jun", "Jul",
          "Aug", "Sept", "Oct",
          "Nov", "Dec"
        ];

        var day = date.getDate();
        var month = monthNames[date.getMonth()];
        var year = date.getFullYear();

        console.log(sweatLog.mood)


        return(
          <ScrollView style={{backgroundColor: "#fff"}}>
                        <View style={styles.container}>
              <Text style={styles.mainTitle}>{month + ". " + day + ", " + year }</Text>
              <Text style={styles.rowHeader}>Notes:</Text>
              <TextInput 
                style={styles.textinput}
                multiline={true}
                editable={false}>{sweatLog.notes}</TextInput>
              <Text style={styles.rowHeader}>How hard you worked:</Text>
              <GradientSlider initialPos={sweatLog.effort} width={width * .85} lock={true} leftIcon="nosweat" rightIcon="sweat"/>
              <View style={{flexDirection: "row", width: width * .88, justifyContent: "space-between", marginLeft: 10, marginTop: 10}}>
                <Text style={styles.sliderText}>No Sweat</Text>
                <Text style={styles.sliderText}>Killed it!</Text>
              </View>
              <Text style={styles.rowHeader}>How it felt:</Text>
              <GradientSlider initialPos={sweatLog.felt} width={width * .85} lock={true} leftIcon="sad" rightIcon="happy"/>
              <View style={{flexDirection: "row", width: width * .85, justifyContent: "space-between",  marginTop: 10}}>
                <Text style={styles.sliderText}>Real Hard</Text>
                <Text style={styles.sliderText}>Amazing!</Text>
              </View>
              <View style={{flexDirection: "row", width: width * .85, justifyContent: "space-between",  marginTop: 30}}>
                <Text style={styles.descriptionText}>Your mood:</Text>
                <Text style={styles.formText}>{sweatLog.mood.toUpperCase()}</Text>
              </View>
              <View style={{flexDirection: "row", width: width * .85, justifyContent: "space-between",  marginTop: 10}}>
              <Text style={styles.descriptionText}>Sore:</Text>
                <Text style={styles.formText}>{sweatLog.sore}</Text>
              </View>
              <View style={{flexDirection: "row", width: width * .85, justifyContent: "space-between",  marginTop: 10}}>
              <Text style={styles.descriptionText}>Self care:</Text>
                <Text style={styles.formText}>{sweatLog.selfCare.toUpperCase()}</Text>
              </View>

            </View>
          </ScrollView>
        );
    }

}

const styles = {
  container: {
    flex:1,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  mainTitle: {
    width: width,
    height: 100,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 140,
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
  },
  rowHeader: {
    width: width * .88,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black,
    marginTop: 20,
    marginBottom: 20
  },
  textinput: {
    width: width * .88,
    height: 100,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
  },
  sliderText: {
    width: 75,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.mediumGrey,
    textAlign: "left"
  },
  descriptionText: {
    width: 86,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black
  },
  formText: {
    width: width * .50,
    height: 48,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "right",
    color: color.hotPink,
    flexWrap: "wrap"
  }

}
