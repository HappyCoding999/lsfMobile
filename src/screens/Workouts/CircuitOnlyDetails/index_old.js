import React, { Component } from 'react';
import { InteractionManager, View } from "react-native";
import { connect } from "react-redux";
import { saveCompletedWorkout, fetchPlaylistData, clearPlaylistData, skipWorkout } from "../../../actions";
import CircuitOverview from './CircuitOverview';
import WorkoutInProgress from "../WorkoutInProgress";
import CompletionModal from "../CompletionModalStack";
import { VideoCacheModule } from "../../../utils";

class CircuitsOnlyWrapper extends Component {

  state = {
    showWorkoutInProgressModal: false,
    showCompletionModal: false,
    circuitOneExercises: null,
    circuitTwoExercises: null
  };

  componentDidMount() {
    this.getCircuits();
  }


  shouldComponentUpdate(params, _) {
    const { level: newLevel } = params.screenProps;
    const { level: prevLevel } = this.props.screenProps;

    if (newLevel !== prevLevel) {
      this.props.navigation.navigate("My Week");
    }

    return true;
  }

  async getCircuits() {

    try {
      const circuits = await this._appendCachedVideoUrl();

      this.setState({
        circuitOneExercises: circuits[0],
        circuitTwoExercises: circuits[1]
      });
    } catch (err) {
      console.log('error trying to getting exercises video cache: ', err.stack);
    }
  }

  render() {
    const { 
      description, 
      level, 
      time,
      isToday
    } = this.props.navigation.state.params.workout;

    const {
      circuitOneExercises,
      circuitTwoExercises
    } = this.state;

    const { fetchPlaylistData, clearPlaylistData } = this.props;

    if (circuitOneExercises === null || circuitTwoExercises === null) {
      console.log('One or more circuits are empty.');
      return null;
    }

    const gear = this._getGearTags();

    return (
      <View>
        <CircuitOverview 
          workoutTitle={description} 
          onLargeBtnPressed={this._showCircuitRound}
          onSecondBtnPressed={isToday ? this._skipWorkout : null}
          time={time}
          level={level}
          gear={gear}
          circuitCardPressed={this._circuitCardPressed}
          fetchPlaylistData={fetchPlaylistData}
          clearPlaylistData={clearPlaylistData}
        />
        {this._renderModals()}
      </View>
    );
  }

  _skipWorkout = () => {
    const { workout, screenAfterWorkout } = this.props.navigation.state.params;
    const { skipWorkout } = this.props;
    
    skipWorkout(workout)
      .then(() => {
        this.props.navigation.navigate(screenAfterWorkout);
      })
      .catch(err => console.log(err.stack));
  };

  _getGearTags() {
    const { primaryTags, secondaryTags } = this._parseTags();
    const exercises = []
    const gearTags = []

    primaryTags.map((exercise)=> {
      exercises.push(exercise)
    })
    secondaryTags.map((exercise)=> {
      exercises.push(exercise)
    })

    exercises.map((exercise)=> {

      if (exercise.bootyBand === "Y"){
        gearTags.push("BAND")
      }
      if (exercise.weight === "Y"){
        gearTags.push("WEIGHT")
      }
      if (exercise.mat === "Y"){
        gearTags.push("MAT")
      }
      if (exercise.step === "Y"){
        gearTags.push("STEP")
      }

    })
    return gearTags;
    
  }

  _parseTags() {
    const { workout } = this.props.navigation.state.params;
    const { primaryTag: primaryTags, secondaryTag: secondaryTags } = workout;
    return {
      primaryTags: primaryTags.filter(tag => tag != null),
      secondaryTags: secondaryTags.filter(tag => tag != null)
    };
  }

  _use480VideoUrl(videoUrl) {
    if (videoUrl == null || videoUrl.length === 0) return videoUrl;
    return videoUrl.replace('/exercises%2F', '/exercises480%2F%20').replace('.mp4', '480.mp4');
  }

  _appendCachedVideoUrl() {
    const { primaryTags, secondaryTags } = this._parseTags();
    const { workout } = this.props.navigation.state.params;

    const newPrimaryTags = Promise.all(primaryTags.map(exercise => {
      const { tag, videoUrl } = exercise;
      const _480VideoUrl = this._use480VideoUrl(videoUrl);

      return VideoCacheModule.getCachedExerciseVideoFilePath(workout, tag)
        .then(cache => {

          if (cache == null) cache = {}

          const { path, _480Path } = cache;

          return {
            ...exercise,
            videoUrl: path || videoUrl,
            _480videoUrl: _480Path || _480VideoUrl
          }
        })
    }));

    const newSecondaryTags = Promise.all(secondaryTags.map(exercise => {
      const { tag, videoUrl } = exercise;
      const _480VideoUrl = this._use480VideoUrl(videoUrl);

      return VideoCacheModule.getCachedExerciseVideoFilePath(workout, tag)
        .then(cache => {

          if (cache == null) cache = {}

          const { path, _480Path } = cache;

          return {
            ...exercise,
            videoUrl: path || videoUrl,
            _480videoUrl: _480Path || _480VideoUrl
          }
        })
    }));

    return Promise.all([newPrimaryTags, newSecondaryTags]);
  }

  _showCircuitRound = ()  => this.setState({ showWorkoutInProgressModal: true });

  _renderModals() {
    const { 
      showWorkoutInProgressModal, 
      showCompletionModal,
      circuitOneExercises, 
      circuitTwoExercises
    } = this.state;

    const { showSpotifyMusicBar } = this.props;

    const { description, rounds } = this.props.navigation.state.params.workout;
    const { screenAfterWorkout } = this.props.navigation.state.params;

    let exercises = [];

    for (let i = 0; i < rounds; i++) {
      exercises = exercises.concat(circuitOneExercises);
    }

    for ( let i = 0; i < rounds; i++) {
      exercises = exercises.concat(circuitTwoExercises);
    }

    const { quote } = this.props.screenProps;

    return (
      <View>
        {
          (this.state.showWorkoutInProgressModal) ? 
          <WorkoutInProgress 
            visible={showWorkoutInProgressModal}
            exercises={exercises}
            maxRounds={rounds}
            exercisesPerRound={4}
            onClose={this._onCloseWorkoutInProgressModal}
            onWorkoutComplete={this._onWorkoutComplete}
            withVideo={true}
            progressTimerRequired={true}
            withSpotifyMusicBar={showSpotifyMusicBar}
          /> : null
        }
        {
          (this.state.showCompletionModal) ?
          <CompletionModal
            screenAfterWorkout={screenAfterWorkout}
            quote={quote} 
            onStackComplete={this._onCompletionFlowEnd}  
            title={description}
            start={showCompletionModal}
            onClose={this._onCloseCompletionModal}
          /> : null
        }
      </View>
    );
  }

  _onCloseWorkoutInProgressModal = () => {
    this.setState({
      showWorkoutInProgressModal: false
    });
  };

  _onCloseCompletionModal = () => {
    this.setState({
      showCompletionModal: false
    });
  };

  _circuitCardPressed = circuitNumber => {
    const { description: workoutTitle } = this.props.navigation.state.params.workout;
    const { circuitOneExercises, circuitTwoExercises } = this.state;
    const passedProps = { 
      circuitOneExercises, 
      circuitTwoExercises, 
      workoutTitle, 
      startWorkout: this._showCircuitRound,
      currentCircuit: circuitNumber,
      onCompletionPress: this._onWorkoutComplete
    };

    this.props.navigation.navigate("Circuit", passedProps);
  };

  _onWorkoutComplete = () => {
    this.setState({
      showWorkoutInProgressModal: false,
      showCompletionModal: true
    });
  }

  _onCompletionFlowEnd = (screenName, props) => {
    const { workout } = this.props.navigation.state.params;
    // User.saveCompletedWorkout(workout)
    //   .catch(err => console.log(err.stack));

    this.props.saveCompletedWorkout(workout);

    this.setState({
      showCompletionModal: false
    });

    // navigationFunctions.navigateToMenuTab(screenName);
    this.props.navigation.navigate(screenName, props);
  }
}

const mapStateToProps = ({ appData }) => ({
  showSpotifyMusicBar: appData.currentPlaylist ? true : false
})

export default connect(mapStateToProps, { 
  saveCompletedWorkout, 
  fetchPlaylistData, 
  clearPlaylistData,
  skipWorkout
})(CircuitsOnlyWrapper);
