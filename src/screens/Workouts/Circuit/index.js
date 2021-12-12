import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import CircuitDetails from "./CircuitDetails";
import { LargeButton } from "../../../components/common";
import { User } from "../../../DataStore";
import SweatLog from "../CompletionModalStack/SweatLog";

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentCircuit: props.navigation.state.params.currentCircuit,
      showSweatLog: false
    };
  }

  render() {
    const { circuitOneExercises, circuitTwoExercises, workoutTitle } = this.props.navigation.state.params;
    const { currentCircuit, showSweatLog } = this.state;

    let circuitDetailsProps;

    if (currentCircuit === 1) {
      const { description } = circuitOneExercises;
      circuitDetailsProps = {
        exercises: circuitOneExercises,
        number: currentCircuit,
        instructions: description,
        largeButtonText: "Next Circuit",
        onLargeButtonPressed: this._nextCircuit,
        navigation: this.props.navigation
      };
    } else {
      const { description } = circuitTwoExercises;
      circuitDetailsProps = {
        exercises: circuitTwoExercises,
        number: currentCircuit,
        instructions: description,
        navigation: this.props.navigation
      };
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <CircuitDetails {...circuitDetailsProps} />
        {this._renderButtons()}
        <SweatLog
          visible={showSweatLog}
          shift={this._closeSweatLog}
          headerText={workoutTitle}
          logButtonPressed={this._logButtonPress}
        />
      </ScrollView>
    );
  }

  _renderButtons() {
    const { onCompletionPress } = this.props.navigation.state.params;
    const { currentCircuit } = this.state;
    const { buttonContainer, btn } = styles;

    return (
      <View style={buttonContainer}>

        {currentCircuit === 1 ? 
          <LargeButton 
            containerStyle={btn}
            onPress={this._nextCircuit}
          > NEXT CIRCUIT </LargeButton>
          :
          null
        }

        <LargeButton
          containerStyle={btn}
          onPress={() => EventRegister.emit("paywallEvent", this._startWorkout)}
        > START WORKOUT </LargeButton>

        {currentCircuit === 2 ?
          <LargeButton
            containerStyle={btn}
            onPress={() => EventRegister.emit("paywallEvent", onCompletionPress)}
          > LOG WORKOUT </LargeButton>
          :
          null
        }
      </View>
    )
  }

  _nextCircuit = () => {
    const { currentCircuit } = this.state;

    if (currentCircuit < 2)  {
      this.setState({ currentCircuit: currentCircuit + 1 });
    }
  };

  _startWorkout = () => {
    const { startWorkout } = this.props.navigation.state.params;

    startWorkout();
  };

  _closeSweatLog = () => this.setState({ showSweatLog: false });

  _logButtonPress = sweatLog => {
    User.saveSweatLog(sweatLog)    
      .catch(err => console.log(err.stack));

    this.props.navigation.navigate("My Week");
  }

}

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonContainer: {
    justifyContent: "center", 
    alignItems: "center"
  },
  btn: {
    marginTop: 10,
    marginBottom: 10
  }
}