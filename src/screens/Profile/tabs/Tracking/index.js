import React, { Component } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { sortBy } from "lodash";
import { color } from "../../../../modules/styles/theme";
import Calendar from "./Calendar";
import Measurements from "./Measurements/Measurements";
import { User } from "../../../../DataStore";
import Day from "../../tabs/Tracking/Calendar/Day"

export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this._showMeasurementsModal = this._showMeasurementsModal.bind(this);
    this._closeMeasurementsModal = this._closeMeasurementsModal.bind(this);
    // this._fetchMeasurements = this._fetchMeasurements.bind(this);
    this.state = {
      showMeasurementsModal: false,
    };
  }

  render() {
    const { container } = styles;

    return (
      <View style={container}>
        <ScrollView contentContainerStyle={{ marginTop: 10 }}>
          {this._renderCalendar()}
          {this._renderLegend()}
          {this._renderMeasurements()}
          {this._renderAllMeasurementsButton()}
        </ScrollView>
      </View>
    );
  }

  _onDayPressed = date => {
    const { sweatLogs } = this.props.screenProps;

    for (let log of sweatLogs) {
      const logDate = new Date(log.createdAt);
      const logDay = logDate.getDate();
      const logMonth = logDate.getMonth() + 1; 
      
      if (logMonth === date.month && logDay === date.day) {
        this.props.navigation.navigate("EntryDetail", log);
      }
    }
  }

  _renderCalendar() {
    const { sweatLogs, completedBonusChallenges, completedWorkouts, selfCareLogs, filteredChallengeLogs } = this.props.screenProps;

    return <Calendar
      sweatLogs={sweatLogs}
      bonusChallenges={[...completedBonusChallenges, ...filteredChallengeLogs]}
      completedWorkouts={completedWorkouts}
      selfCareLogs={selfCareLogs}
      day={props => <Day onSingleDayPressed={this._onDayPressed} {...props} />}
    />;
  }

  _renderLegend() {
    const { rowContainer, text, legendItem, workout, star, line, heart } = styles;

    return (
      <View>

        <View style={{ ...rowContainer, marginTop: 10 }} >
          <View style={legendItem} >
            <View style={workout} />
            <Text allowFontScaling={false} style={text}>workout</Text>
          </View>
          <View style={legendItem}>
            <Image style={star} source={require("../../images/calendarStar.png")} />
            <Text allowFontScaling={false} style={text}>bonus challenge</Text>
          </View>
          <View style={legendItem}>
            <Image style={line} source={require("../../images/calendarLine.png")} />
            <Text allowFontScaling={false} style={text}>journal entry</Text>
          </View>
        </View>

        <View style={{ ...rowContainer, marginTop: 10, justifyContent: "flex-start", paddingLeft: 4 }} >
          <View style={legendItem}>
            <Image style={heart} source={require("../../images/calendarHeart.png")} />
            <Text allowFontScaling={false} style={text}>self care</Text>
          </View>
        </View>

      </View>
    );
  }

  _renderMeasurements() {
    const measurements = sortBy(this.props.screenProps.measurements, m => m.createdAt).reverse();
    let passedMeasurements;

    if (measurements.length > 0) {
      passedMeasurements = measurements.slice(0, 2);
    } else {
      passedMeasurements = [];
    }

    return (
      <View style={{ margintop: 10, marginbottom: 10 }}>
        <Measurements
          measurements={passedMeasurements}
          addButtonPress={() => this.props.navigation.navigate("NewEntry")}
        />
      </View>
    )
  }

  _renderAllMeasurementsButton() {
    const { allMeasurementsBtn, text } = styles;
    const textStyle = {
      ...text,
      fontWeight: "bold",
      letterSpacing: 0.5
    };
    const cardContainer = {
      height: 90,
      width: "100%",
      marginTop: 20,
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <TouchableOpacity activeOpacity={1} onPress={() => EventRegister.emit("paywallEvent", this._showMeasurementsModal)}>
        <View style={cardContainer}>
          <View style={allMeasurementsBtn}>
            <Text allowFontScaling={false} style={textStyle}>View Progress History</Text>
            <Image resizeMode="contain" source={require("../../images/cellrowChevron.png")} />
          </View>
        </View>
      </TouchableOpacity>

    );
  }

  _showMeasurementsModal() {
    this.props.navigation.navigate("Measurements");
  }

  _closeMeasurementsModal() {
    this.setState({
      showMeasurementsModal: false
    });
  }

  _onNewEntrySubmit = data => {
    User.saveMeasurement(data)
      .catch(err => console.log(err.stack));
  };
}

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  star: {
    width: 22,
    height: 22
  },
  line: {
    height: 3,
    width: 22
  },
  heart: {
    height: 20,
    width: 20
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    marginLeft: 5,
  },
  workout: {
    height: 22,
    width: 22,
    borderRadius: 12,
    backgroundColor: "#f3ccd3"
  },
  allMeasurementsBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: 300
  }
};
