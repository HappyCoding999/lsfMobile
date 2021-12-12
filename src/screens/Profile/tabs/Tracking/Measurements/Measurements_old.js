import React, { Component } from "react";
import { View, FlatList, Text, TouchableOpacity, Image } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import MeasurementRow from "./MeasurementRow";
import { color } from "../../../../../modules/styles/theme";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];


export default class extends Component {

  state = {
    showPropModal: false  
  };

  render() {
    const { measurements } = this.props;
    return (
      <View>
        { this._renderHeader() }
        { measurements.length === 0 ? 
          null
          :
          <FlatList
            data={measurements}
            renderItem={this._renderRow}
            ItemSeparatorComponent={() => <View style={{marginTop: 10, marginBottom: 10}}/>}
            keyExtractor={item => item.createdAt + "item"}
          />
        }
      </View>
    );
  }

  _renderHeader() {
    const { headerText, rowContainer, addButton, measurementsSubtitle } = styles;

    return (
      <View>
        <Text allowFontScaling={false} style={headerText}>PROGRESS TRACKING</Text>
        <View style={rowContainer}>
          <TouchableOpacity activeOpacity={.8} onPress={() => EventRegister.emit("paywallEvent", this._addNewMeasurement)}>
            <View style={addButton}>
              <Image source={require('./images/addButton.png')}/> 
            </View>
          </TouchableOpacity>
          <Text allowFontScaling={false} style={measurementsSubtitle}>ADD NEW MEASUREMENTS, PHOTOS, + WEIGH IN</Text>
          <View />
        </View>
      </View>
    );
  }

  _renderRow({ item }) {
    const { 
      createdAt, 
      weight, 
      waist, 
      biceps, 
      hips,
      thighs,
      frontImage,
      backImage,
      sideImage
    } = item;

    const date = new Date(createdAt);
    const month = months[date.getMonth()] 
    const day = date.getDate();

    return <MeasurementRow
      date={day}
      month={month}
      weight={weight}
      waist={waist}
      arms={biceps}
      hips={hips}
      thighs={thighs}
      photoURIs={[frontImage, backImage, sideImage]}
    />;
  }

  _addNewMeasurement = () => {
    this.props.addButtonPress();
  };

  _closePropModal = () => {
    this.setState({
      showPropModal: false
    });
  }
}

const styles = {
  headerText: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    textAlign: "center",
    color: color.lightPink,
    marginTop: 40,
    marginBottom: 20,
    // textShadowColor: color.hotPink,
    // textShadowRadius: 10
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: color.mediumPink
  },
  measurementsSubtitle: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "left",
    color: color.mediumPink,
    width: 250,
    marginLeft: 20
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
};