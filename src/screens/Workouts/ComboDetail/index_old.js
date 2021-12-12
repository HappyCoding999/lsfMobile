import React, { Component } from "react";
import { View } from "react-native";
import ComboDetail from "./ComboDetail";
import CompletionModal from "../CompletionModalStack";
import ProgressTimer from "../../ProgressTimer";
import { connect } from "react-redux";
import { saveCompletedWorkout, skipWorkout } from "../../../actions";
import { VideoCacheModule } from "../../../utils";

class ComboDetailWrapper extends Component {

  state = {
    exercises: [],
    showCompletionModal: false,
    showProgressTimerModal: false,
  };

  async componentDidMount() {
    try {
      const exercises = await this._appendCachedVideoUrl();

      this.setState({
        exercises
      });
    } catch (err) {
      console.log(err.stack);
    }
  }

  render() {
    const { 
      description,
      time,
      secondaryType,
      rounds,
      isToday
    } = this.props.navigation.state.params.workout;
    const { exercises } = this.state;

    if (exercises.length > 0) {
      return (
        <View>
          <ComboDetail 
            exercises={exercises} 
            mainTitle={description}
            time={time}
            secondaryType={secondaryType}
            rounds={rounds}
            circuitName="Circuit" 
            onSweatSoloPress={this._showProgressTimer}
            onVideoLibraryPress={this._showVideoList}
            onCompletionPress={this._showCompletionModal}
            onSkipPress={isToday ? this._skipWorkout : null}
            navigation={this.props.navigation}
          />
          {this._renderModals()}
        </View>
      );
    }

    return null;
  }

  _showVideoList = () => {
    const {secondaryType} = this.props.navigation.state.params.workout;
    let category = secondaryType.replace("Cardio", "Workouts")
    this.props.navigation.navigate('VideoLibraryDetail', { videoListTitle: category })
  }

  _appendCachedVideoUrl() {
    const { primaryTags, secondaryTags } = this._parseTags();
    const { workout } = this.props.navigation.state.params;

    const newPrimaryTags = Promise.all(primaryTags.map(exercise => {
      const { tag, videoUrl } = exercise;

      return VideoCacheModule.getCachedExerciseVideoFilePath(workout, tag)
        .then(cache => {

          if (cache == null) cache = {}

          const { path, _480Path } = cache;

          return {
            ...exercise,
            videoUrl: path || this._use480VideoUrl(videoUrl)
          }
        })
    }));

    return newPrimaryTags;
  }

  _parseTags() {
    const { workout } = this.props.navigation.state.params;
    const { primaryTag: primaryTags, secondaryTag: secondaryTags } = workout;

    return {
      primaryTags,
      secondaryTags
    };
  }

  _use480VideoUrl(videoUrl) {
    if (videoUrl == null || videoUrl.length === 0) return videoUrl;
    return videoUrl.replace('/exercises%2F', '/exercises480%2F%20').replace('.mp4', '480.mp4');
  }

  _renderModals() {
    const { description } = this.props.navigation.state.params.workout;
    const { screenAfterWorkout } = this.props.navigation.state.params;
    const { showCompletionModal, showProgressTimerModal } = this.state;

    const { quote } = this.props.screenProps;

    return (
      <View>
        <CompletionModal 
          quote={quote}
          onStackComplete={this._onCompletionFlowEnd}  
          title={description}
          start={showCompletionModal}
          onClose={this._onCloseCompletionModal}
          screenAfterWorkout={screenAfterWorkout}
        />
        <ProgressTimer 
          title={description}
          visible={showProgressTimerModal}
          onClose={this._closeProgressTimer}
          onCompletePress={this._showCompletionModal}
          withTimer={true}
        />
      </View>
    )
  }

  _onCloseCompletionModal = () => this.setState({ showCompletionModal: false });

  _onCompletionFlowEnd = (screenName, props) => {
    const { workout } = this.props.navigation.state.params;
    this.setState({ showCompletionModal: false })

    this.props.saveCompletedWorkout(workout);
    if (screenName) 
    {
      this.props.navigation.navigate(screenName, props);  
    }
    else
    {
      this.props.navigation.goBack();   
    }
  }

  _showProgressTimer = () => {
    this.setState({
     showProgressTimerModal: true
    });
  }

  _showCompletionModal = () => this.setState({
    showCompletionModal: true,
    showProgressTimerModal: false
  });

  _skipWorkout = () => {
    const { workout, screenAfterWorkout } = this.props.navigation.state.params;
    const { skipWorkout } = this.props;

    skipWorkout(workout)
      .then(() => {
        this.props.navigation.navigate(screenAfterWorkout);
      })
      .catch(err => console.log(err.stack));
  }

  _closeProgressTimer = () => {
    this.setState({
      showProgressTimerModal: false
    });
  };
}

export default connect(null, { saveCompletedWorkout, skipWorkout })(ComboDetailWrapper);