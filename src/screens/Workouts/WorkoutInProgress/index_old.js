import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../../components/common";
import Workout from "./Workout";
import AboutModal from "./AboutModal";
import ProgressTimer from "../../ProgressTimer";
import {color} from "../../../modules/styles/theme"

const WrappedWorkout = plainModalHeaderWrapper(Workout);

class WorkoutInProgress extends Component {

  state = {
    currentExerciseIdx: 0,
    showAboutModal: false,
    showProgressTimerModal: false,
    circuitNumber: 1,
    roundNumber: 1
  };

  render() {
    const { 
      visible,
      onClose,
      exercises,
      withVideo,
      isDaily10,
      animType,
      withSpotifyMusicBar,
      ignoreSilentSwitch
    } = this.props;

    const { showAboutModal, showProgressTimerModal, currentExerciseIdx } = this.state;
    const currentExercise = exercises[currentExerciseIdx];

    if (!currentExercise) { 
      console.log('no current exercise');
      return null;
    }

    const { exercise: currentExerciseName, videoUrl: videoUrl } = currentExercise;

    const headerProps = {
      onClose,
      headerText: this._getHeaderText().toUpperCase(),
      withInfo: true,
      onInfoPress: this._onInfoPressed,
      closeButtonType: "pink",
      containerViewStyle: {zIndex:1, marginTop:18},
      headerTextStyle: {  
        width: 200,
        height: 24,
        fontFamily: "SF Pro Text",
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 1,
        textAlign: "center",
        color: color.hotPink}
    };

    return (
      <View>
        <Modal visible={visible} onRequestClose={() => ""} animationType={animType || "slide"}>
          <SafeAreaView style={{flex: 1}} forceInset={{top: "always", bottom: "never"}}>
            <WrappedWorkout
              currentExercise={currentExercise}
              headerProps={headerProps}
              title={currentExerciseName}
              videoUrl={videoUrl}
              onNextArrowPressed={this._onNextArrowPressed}
              onPreviousArrowPressed={this._onPreviousArrowPressed}
              withVideo={withVideo}
              isDaily10={isDaily10}
              withSpotifyMusicBar={withSpotifyMusicBar}
              ignoreSilentSwitch={ignoreSilentSwitch}
            />
            <AboutModal 
              visible={showAboutModal} 
              title={currentExerciseName}
              onClose={this._onCloseAboutModal}
              aboutText={this._exerciseDescription}
            />
            <ProgressTimer 
              visible={showProgressTimerModal}
              restartTimer={showProgressTimerModal}
              title="JUST CHILL"
              headerText={this._getHeaderText().toUpperCase()}
              subTitleText="Catch your breath and get ready for the next move."
              nextMove={currentExercise}
              onClose={this._onCloseProgressTimer}
              withTimer={false}
            />
          </SafeAreaView>
        </Modal>
      </View>
    );
  }

  _getHeaderText() {
    const { circuitNumber, roundNumber } = this.state;
    const { noTitle } = this.props;

    if (noTitle === true) {
      return "";
    }

    return `Circuit ${circuitNumber}, Round ${roundNumber}`;
  }

  _onNextArrowPressed = () => {
    const { currentExerciseIdx, circuitNumber, roundNumber } = this.state;
    const { exercises, onWorkoutComplete, progressTimerRequired } = this.props;
    const [circuitComplete, roundComplete] = [this._circuitComplete("increment"), this._roundComplete("increment")];
    let newCircuitNumber = circuitNumber, newRoundNumber = roundNumber, showProgressTimerModal = false;

    if (currentExerciseIdx >= exercises.length - 1) {
      return onWorkoutComplete();
    } 

    if (circuitComplete) {
      newCircuitNumber = circuitNumber + 1;
      newRoundNumber = 1;
      showProgressTimerModal = true;
    } else if (roundComplete) {
      showProgressTimerModal = true;
      newCircuitNumber = circuitNumber;
      newRoundNumber = roundNumber + 1;
    }

    this.setState({
      currentExerciseIdx: currentExerciseIdx + 1,
      circuitNumber: newCircuitNumber,
      roundNumber: newRoundNumber,
      showProgressTimerModal: progressTimerRequired && showProgressTimerModal
    });
  }

  _onPreviousArrowPressed = () => {
    const { currentExerciseIdx, circuitNumber, roundNumber } = this.state;
    const { maxRounds } = this.props;
    const [circuitComplete, roundComplete] = [this._circuitComplete("decrement"), this._roundComplete("decrement")];

    if (currentExerciseIdx <= 0)  { return }

    if (circuitComplete) {
      this.setState({
        roundNumber: maxRounds,
        currentExerciseIdx: currentExerciseIdx - 1,
        circuitNumber: circuitNumber - 1
      });
    } else if (roundComplete) {
      this.setState({
        roundNumber: roundNumber - 1,
        currentExerciseIdx: currentExerciseIdx - 1
      });
    } else {
      this.setState({
        currentExerciseIdx: currentExerciseIdx - 1
      });
    }
  }

  _roundComplete(direction) {
    const delta = direction === "increment" ? 1 : 0;
    const { currentExerciseIdx } = this.state;
    const { exercisesPerRound } = this.props;
    return (currentExerciseIdx + delta) % exercisesPerRound === 0;
  }

  _circuitComplete(direction) {
    const delta = direction === "increment" ? 1 : 0;
    const { currentExerciseIdx } = this.state;
    const { exercisesPerRound, maxRounds } = this.props;
    return this._roundComplete && (currentExerciseIdx + delta) % (maxRounds * exercisesPerRound) === 0;
  }

  _onInfoPressed = () => {
    this.setState({
      showAboutModal: true
    });
  }

  _onCloseAboutModal = () => {
    this.setState({
      showAboutModal: false
    });
  }

  _onCloseProgressTimer = () => {
    this.setState({
      showProgressTimerModal: false
    });
  }

  get _exerciseDescription() {
    const { currentExerciseIdx } = this.state;
    const { exercises } = this.props;
    const currentExercise = exercises[currentExerciseIdx];

    var format = currentExercise.description.split("\n")

    let numbered = format.map((val, i) => {
      var newString = ""
      return newString.concat(i+1 + ". " + val.substr(1).substr(1))
    });

    numbered.pop()

    return numbered;
  }
}

const mapStateToProps = ({ appData }) => ({
  ignoreSilentSwitch: appData.currentPlaylist
});

export default connect(mapStateToProps)(WorkoutInProgress);
