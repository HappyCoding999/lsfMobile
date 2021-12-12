import React, { Component } from "react";
import { InteractionManager, View, Alert } from "react-native";
import { connect } from "react-redux";
import {
  saveCompletedWorkout,
  fetchPlaylistData,
  clearPlaylistData,
  skipWorkout,
  saveWorkoutForChallenge,
} from "../../../actions";
import CircuitOverview from "./CircuitOverview";
import WorkoutInProgress from "../WorkoutInProgress";
import CompletionModal from "../CompletionModalStack";
import { VideoCacheModule } from "../../../utils";
import BackgroundTimer from "react-native-background-timer";
import moment from "moment";
import { AsyncStorage } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { getAchievements, User } from "../../../DataStore";

class CircuitsOnlyWrapper extends Component {
  state = {
    totalSeconds: 0,
    workoutStartTime: 0,
    videoPlayedDuration: 0,
    showWorkoutInProgressModal: false,
    showCompletionModal: false,
    circuitOneExercises: null,
    circuitTwoExercises: null,
  };

  timer = null;

  _formatTime() {
    const { totalSeconds } = this.state;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds - hours * 3600 - minutes * 60;

    return `${this._twoDigitFormat(hours)}:${this._twoDigitFormat(
      minutes
    )}:${this._twoDigitFormat(seconds)}`;
  }

  _startTimer = () => {
    // const { totalSeconds } = this.state;
    if (this.timer === null) {
      this.timer = setInterval(() => {}, 1000);
      BackgroundTimer.runBackgroundTimer(() => {
        console.log("runBackgroundTimer called");
        const { totalSeconds, workoutStartTime } = this.state;
        // console.log("Checking");
        // const start = workoutStartTime;
        //  const end   = Date.now();
        // // const range = moment.range(start, end);
        //  // console.log(range.diff('minutes'));
        //  console.log(workoutStartTime);
        //   console.log(end);
        //   const diff   = Math.floor(end - start) / 1000;
        //   const seconds   = Math.floor(diff % 60);
        console.log("seconds");
        console.log(totalSeconds + 1);
        this.setState({
          totalSeconds: totalSeconds + 1,
        });
      }, 1000);
    }
  };
  _stopTimer() {
    if (this.timer) {
      alert("totalSeconds: " + this.state.totalSeconds);

      clearInterval(this.timer);
      this.timer = null;
      BackgroundTimer.stopBackgroundTimer();
    }
  }

  componentDidMount() {
    this.getCircuits();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");

    this._stopTimer();
    if (this.listener != undefined) {
      AsyncStorage.removeItem("ChooseVideoInstead");
      console.log(
        "Vishal - Remove listner if already added => " + this.listener
      );
      EventRegister.removeEventListener(this.listener);
    }
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
        circuitTwoExercises: circuits[1],
      });
    } catch (err) {
      console.log("error trying to getting exercises video cache: ", err.stack);
    }
  }

  render() {
    const {
      primaryTag,
      secondaryTag,
      rounds,
      description,
      imageUrl,
      level,
      time,
      isToday,
    } = this.props.navigation.state.params.workout;
    const { circuitOneExercises, circuitTwoExercises, totalSeconds } =
      this.state;

    const { fetchPlaylistData, clearPlaylistData } = this.props;

    if (circuitOneExercises === null || circuitTwoExercises === null) {
      console.log("One or more circuits are empty.");
      return null;
    }

    const gear = this._getGearTags();

    return (
      <View>
        <CircuitOverview
          workoutImage={imageUrl}
          workoutTitle={description}
          primaryTag={primaryTag}
          secondaryTag={secondaryTag}
          rounds={rounds}
          onLargeBtnPressed={this._showCircuitRound}
          onSecondBtnPressed={isToday ? this._skipWorkout : null}
          onVideoBtnPressed={isToday ? this._chooseVideo : null}
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

  _chooseVideo = () => {
    console.log("_chooseVideo called");
    const { workout, screenAfterWorkout } = this.props.navigation.state.params;
    const { skipWorkout } = this.props;
    console.log(screenAfterWorkout);
    AsyncStorage.setItem("ChooseVideoInstead", "true");
    if (this.listener != undefined) {
      console.log(
        "Vishal - Remove listner if already added => " + this.listener
      );
      EventRegister.removeEventListener(this.listener);
    }
    const timeStamp = Date.now();
    this.setState({ workoutStartTime: timeStamp });

    console.log("Vishal - add  new listner");
    this.listener = EventRegister.addEventListener(
      "videoPlayerClosed",
      (data) => {
        console.log(data);
        const { videoPlayedDuration, totalVideoDurationInMinute } = data;
        console.log(
          "Vishal - checking for chooseVideoInstead in AsyncStorage 1 CircuitsOnlyDetails"
        );
        AsyncStorage.getItem("ChooseVideoInstead").then(
          (chooseVideoInstead) => {
            console.log("chooseVideoInstead value : " + chooseVideoInstead);
            this.props.navigation.navigate("Today");
            setTimeout(() => {
              AsyncStorage.removeItem("ChooseVideoInstead");

              const end = Date.now();
              var diff = moment.duration(moment(end).diff(moment(timeStamp)));
              var seconds = parseInt(diff.asSeconds()); //84
              console.log("Vishal : workout time : " + seconds);
              let totalDurationInMinute = totalVideoDurationInMinute;
              let checkHalfOfVideoInSeconds =
                (totalVideoDurationInMinute * 60) / 2;
              console.log(
                "Vishal : checkHalfOfVideoInSeconds : " +
                  checkHalfOfVideoInSeconds
              );
              let userWatchedHalfOfTheVideo =
                videoPlayedDuration >= checkHalfOfVideoInSeconds;
              // if (seconds < 30) {
              if (userWatchedHalfOfTheVideo == false) {
                Alert.alert(
                  "",
                  "To log your workout, complete at least half of the video. You've got this!"
                );
              } else {
                this.setState({
                  showCompletionModal: true,
                  videoPlayedDuration,
                });
              }
            }, 500);
          }
        );
      }
    );
    this.props.navigation.navigate("VideoLibraryNew", { chooseVideoBtn: true });
    return;
    skipWorkout(workout)
      .then(() => {
        this.props.navigation.navigate(screenAfterWorkout);
      })
      .catch((err) => console.log(err.stack));
  };
  _skipWorkout = () => {
    const { workout, screenAfterWorkout } = this.props.navigation.state.params;
    const { skipWorkout } = this.props;

    skipWorkout(workout)
      .then(() => {
        this.props.navigation.navigate(screenAfterWorkout);
      })
      .catch((err) => console.log(err.stack));
  };

  _getGearTags() {
    const { primaryTags, secondaryTags } = this._parseTags();
    const exercises = [];
    const gearTags = [];

    primaryTags.map((exercise) => {
      exercises.push(exercise);
    });
    secondaryTags.map((exercise) => {
      exercises.push(exercise);
    });

    exercises.map((exercise) => {
      if (exercise.bootyBand === "Y") {
        if (gearTags.includes("BAND") == false) {
          gearTags.push("BAND");
        }
      }
      if (exercise.weight === "Y") {
        if (gearTags.includes("WEIGHT") == false) {
          gearTags.push("WEIGHT");
        }
      }
      if (exercise.mat === "Y") {
        if (gearTags.includes("MAT") == false) {
          gearTags.push("MAT");
        }
      }
      if (exercise.step === "Y") {
        if (gearTags.includes("STEP") == false) {
          gearTags.push("STEP");
        }
      }
    });
    return gearTags;
  }

  _parseTags() {
    const { workout } = this.props.navigation.state.params;
    const { primaryTag: primaryTags, secondaryTag: secondaryTags } = workout;
    return {
      primaryTags: primaryTags.filter((tag) => tag != null),
      secondaryTags: secondaryTags.filter((tag) => tag != null),
    };
  }

  _use480VideoUrl(videoUrl) {
    if (videoUrl == null || videoUrl.length === 0) return videoUrl;
    return videoUrl
      .replace("/exercises%2F", "/exercises480%2F%20")
      .replace(".mp4", "480.mp4");
  }

  _appendCachedVideoUrl() {
    const { primaryTags, secondaryTags } = this._parseTags();
    const { workout } = this.props.navigation.state.params;

    const newPrimaryTags = Promise.all(
      primaryTags.map((exercise) => {
        const { tag, videoUrl } = exercise;
        const _480VideoUrl = this._use480VideoUrl(videoUrl);

        return VideoCacheModule.getCachedExerciseVideoFilePath(
          workout,
          tag
        ).then((cache) => {
          if (cache == null) cache = {};

          const { path, _480Path } = cache;

          return {
            ...exercise,
            videoUrl: path || videoUrl,
            _480videoUrl: _480Path || _480VideoUrl,
          };
        });
      })
    );

    const newSecondaryTags = Promise.all(
      secondaryTags.map((exercise) => {
        const { tag, videoUrl } = exercise;
        const _480VideoUrl = this._use480VideoUrl(videoUrl);

        return VideoCacheModule.getCachedExerciseVideoFilePath(
          workout,
          tag
        ).then((cache) => {
          if (cache == null) cache = {};

          const { path, _480Path } = cache;

          return {
            ...exercise,
            videoUrl: path || videoUrl,
            _480videoUrl: _480Path || _480VideoUrl,
          };
        });
      })
    );

    return Promise.all([newPrimaryTags, newSecondaryTags]);
  }
  _showCircuitRound = () => {
    const timeStamp = Date.now();
    this.setState({
      showWorkoutInProgressModal: true,
      workoutStartTime: timeStamp,
    });
  };
  // _showCircuitRound = ()  => this.setState({ showWorkoutInProgressModal: true });

  _renderModals() {
    const {
      totalSeconds,
      showWorkoutInProgressModal,
      showCompletionModal,
      circuitOneExercises,
      circuitTwoExercises,
    } = this.state;

    const { showSpotifyMusicBar } = this.props;

    const { description, rounds } = this.props.navigation.state.params.workout;
    const { screenAfterWorkout } = this.props.navigation.state.params;

    let exercises = [];

    for (let i = 0; i < rounds; i++) {
      exercises = exercises.concat(circuitOneExercises);
    }

    for (let i = 0; i < rounds; i++) {
      exercises = exercises.concat(circuitTwoExercises);
    }

    const { quote } = this.props.screenProps;

    // if (this.state.workoutStartTime != 0) {
    //   this._startTimer();
    // }
    var time = "";
    if (showCompletionModal) {
      // console.log("Vishal : showCompletionModal : ");
      const { workoutStartTime, videoPlayedDuration } = this.state;
      /*const start = workoutStartTime;
      // console.log("Vishal : workoutStartTime : " + workoutStartTime);
      const end   = Date.now();
      // console.log("Vishal : workoutEndTime : " + end);
      var diff = moment.duration(moment(end).diff(moment(start)));
      var seconds = parseInt(diff.asSeconds()); //84
      time = this._formatTimeFromSeconds(seconds)*/
      time = this._formatTimeFromSeconds(videoPlayedDuration);
      // console.log("Vishal : workout time : " + time);
    }
    return (
      <View>
        {this.state.showWorkoutInProgressModal ? (
          <WorkoutInProgress
            visible={showWorkoutInProgressModal}
            totalSeconds={totalSeconds}
            timerStart={this._startTimer}
            timerStop={this._stopTimer}
            exercises={exercises}
            maxRounds={rounds}
            exercisesPerRound={4}
            onClose={this._onCloseWorkoutInProgressModal}
            onWorkoutComplete={this._onWorkoutComplete}
            withVideo={true}
            progressTimerRequired={true}
            withSpotifyMusicBar={showSpotifyMusicBar}
          />
        ) : null}
        {this.state.showCompletionModal ? (
          <CompletionModal
            screenAfterWorkout={screenAfterWorkout}
            quote={quote}
            onStackComplete={this._onCompletionFlowEnd}
            title={description}
            start={showCompletionModal}
            viewTrophie={this._showTrophie}
            viewBonusChallange={this._showBonusChallange}
            onClose={this._onCloseCompletionModal}
            workout={{
              ...this.props.navigation.state.params.workout,
              completionTime: time,
            }}
            screenProps={{ ...this.props.screenProps }}
          />
        ) : null}
      </View>
    );
  }
  _twoDigitFormat(num) {
    const str = num.toString();
    // if (str.length <= 1) {
    //   return "0" + str;
    // }

    return str;
  }
  _formatTimeFromSeconds(totalSeconds) {
    console.log("_formatTimeFromSeconds called");
    console.log("totalSeconds : " + totalSeconds);
    var _totalSeconds = parseInt(totalSeconds); //84
    const hours = Math.floor(_totalSeconds / 3600);
    console.log("hours : " + hours);
    const minutes = Math.floor((_totalSeconds - hours * 3600) / 60);
    console.log("minutes : " + minutes);
    const seconds = _totalSeconds - hours * 3600 - minutes * 60;
    console.log("seconds : " + seconds);

    if (hours > 1) {
      return `${this._twoDigitFormat(hours)} Hours ${this._twoDigitFormat(
        minutes
      )} Minutes`;
    } else if (hours == 1 && minutes > 1) {
      return `${this._twoDigitFormat(hours)} Hour ${this._twoDigitFormat(
        minutes
      )} Minutes`;
    } else if (minutes > 1) {
      return `${this._twoDigitFormat(minutes)} Minutes`;
    }
    return `${this._twoDigitFormat(totalSeconds)} Seconds`;
  }
  _showBonusChallange = () => {
    console.log("_showBonusChallange test 1");
    const { workout } = this.props.navigation.state.params;
    const { isPreviousWorkoutCompleted, isCompleted, day } =
      this.props.navigation.state.params.workout;

    if (day == 1 || isPreviousWorkoutCompleted) {
      console.log("saveCompletedWorkout called - 1");
      console.log("isCompleted " + isCompleted);
      if (isCompleted == undefined || isCompleted == false) {
        this.props.saveCompletedWorkout(workout);
      }
    }

    this.setState({
      showCompletionModal: false,
    });
    this.props.navigation.pop();
    this.props.navigation.navigate("SweatChallenges");
  };
  _showTrophie = () => {
    console.log("_showTrophie test 1");

    setTimeout(() => {
      const newProps = {
        achievements: this.props.screenProps.achievements,
        achievementTable: {},
        backToScreen: "Goals",
      };
      this.props.navigation.navigate("Trophies", newProps);
    }, 100);

    // getAchievements()
    //   .then((achievementTable) => {
    //     console.log("achievementTable ==>");
    //     console.log(achievementTable);

    //     const newProps = {
    //       achievements: this.props.screenProps.achievements,
    //       achievementTable: achievementTable,
    //       backToScreen: "Goals",
    //     };
    //     console.log(newProps);
    //     this.setState(
    //       {
    //         showCompletionModal: false,
    //       },
    //       () => {
    //         // this.props.navigation.goBack();

    //         // alert("1. showTrophie");

    //         this.props.navigation.pop();
    //         this.props.navigation.navigate("Trophies", newProps);
    //       }
    //     );
    //   })
    //   .catch((err) => console.log(err.stack));
  };

  _onCloseWorkoutInProgressModal = () => {
    this.setState({
      showWorkoutInProgressModal: false,
    });
  };

  _onCloseCompletionModal = () => {
    this.setState({
      showCompletionModal: false,
    });
  };

  _circuitCardPressed = (circuitNumber) => {
    const { description: workoutTitle } =
      this.props.navigation.state.params.workout;
    const { circuitOneExercises, circuitTwoExercises } = this.state;
    const passedProps = {
      circuitOneExercises,
      circuitTwoExercises,
      workoutTitle,
      startWorkout: this._showCircuitRound,
      currentCircuit: circuitNumber,
      onCompletionPress: this._onWorkoutComplete,
    };

    this.props.navigation.navigate("Circuit", passedProps);
  };

  _onWorkoutComplete = () => {
    const timeStamp = Date.now();
    this.setState({
      showWorkoutInProgressModal: false,
      showCompletionModal: true,
    });
  };

  _onCompletionFlowEnd = (screenName, props) => {
    const { workout } = this.props.navigation.state.params;
    console.log("_onCompletionFlowEnd in CircuitsOnlyDetails index");

    const { isCompleted, isPreviousWorkoutCompleted, day } =
      this.props.navigation.state.params.workout;

    // alert(
    //   "2. day: " +
    //     day +
    //     " // isPreviousWorkoutCompleted: " +
    //     isPreviousWorkoutCompleted +
    //     " // isCompleted: " +
    //     isCompleted
    // );

    // if (day == 1 || isPreviousWorkoutCompleted) {
    //   console.log("saveCompletedWorkout called - 1");
    //   console.log("isCompleted " + isCompleted);
    if (isCompleted == undefined || isCompleted == false) {
      // alert("3.\n" + JSON.stringify(workout));
      this.props.saveCompletedWorkout(workout);
    }
    // }

    this.setState({
      showCompletionModal: false,
    });

    if (screenName) {
      this.props.navigation.navigate(screenName, props);
    } else {
      this.props.navigation.goBack();
    }
  };
}

const mapStateToProps = ({ appData }) => ({
  showSpotifyMusicBar: appData.currentPlaylist ? true : false,
});

export default connect(mapStateToProps, {
  saveCompletedWorkout,
  saveWorkoutForChallenge,
  fetchPlaylistData,
  clearPlaylistData,
  skipWorkout,
})(CircuitsOnlyWrapper);
