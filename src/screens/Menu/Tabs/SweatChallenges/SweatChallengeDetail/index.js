import React, { Component } from 'react';
import { View } from "react-native";
import firebase from "react-native-firebase"
import SweatChallengeDetail from './SweatChallengeDetail';
import DailySweat from "../../../../Daily10/DailySweat";
import DailySweatCompletionModal from "../../../../Daily10/DailySweatCompletion";

export default class extends Component {

  state = {
    showDailySweatCompletionModal: false,
    showDailSweatModal: false
  };

  render() {

    const passedProps = this.props.navigation.state.params
    const {
      showDailSweatModal,
      showDailySweatCompletionModal,
    } = this.state;

    const { daily10 } = this.props.screenProps;

    const { move1, move2, move3 } = this._prepDaily10Data(daily10);
    return (
      <View>
        <SweatChallengeDetail
          daily10={daily10}
          {...passedProps}
          onButtonPress={this._onButtonPressed}
        />
        <DailySweat
          visible={showDailSweatModal}
          move1={move1}
          move2={move2}
          move3={move3}
          onClose={this._closeDailySweatModal}
          onWorkoutComplete={this._openDailySweatCompletionModal}
          animType="none"
        />
        <DailySweatCompletionModal
          visible={showDailySweatCompletionModal}
          onClose={this._closeDailySweatCompletionModal}
        />
      </View>
    );
  }

  _prepDaily10Data(daily10) {
    const {
      move1ImageUrl,
      move1Name,
      move1Reps,
      move2ImageUrl,
      move2Name,
      move2Reps,
      move3ImageUrl,
      move3Name,
      move3Reps,
    } = daily10;

    return {
      move1: { imgUrl: move1ImageUrl, name: move1Name, reps: move1Reps },
      move2: { imgUrl: move2ImageUrl, name: move2Name, reps: move2Reps },
      move3: { imgUrl: move3ImageUrl, name: move3Name, reps: move3Reps },
    };

  }

  _onButtonPressed = () => this.setState({ showDailSweatModal: true });

  _showDailySweatModal = () => this.setState({ showDailSweatModal: true });

  _closeDailySweatModal = () => this.setState({ showDailSweatModal: false });

  _openDailySweatCompletionModal = () => this.setState({ showDailySweatCompletionModal: true, showDailSweatModal: false });

  _closeDailySweatCompletionModal = () => this.setState({ showDailySweatCompletionModal: false });

}