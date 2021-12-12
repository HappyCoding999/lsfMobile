import React, { Component } from "react";
import { View } from "react-native";
import ComboDetail from "./ComboDetail";
import CompletionModal from "../CompletionModalStack";
import ProgressTimer from "../../ProgressTimer";
import { connect } from "react-redux";
import {
  saveCompletedWorkout,
  skipWorkout,
  saveWorkoutForChallenge,
  Alert,
} from "../../../actions";
import { VideoCacheModule } from "../../../utils";
import { getAchievements } from "../../../DataStore";
import WorkoutInProgress from "../WorkoutInProgress";
import { AsyncStorage } from "react-native";
import moment from "moment";
import { EventRegister } from "react-native-event-listeners";

class ComboDetailWrapper extends Component {
  state = {
    exercises: [],
    workoutStartTime: 0,
    videoPlayedDuration: 0,
    cardioTime: "",
    workoutTime: "",
    outsideWorkoutData: null,
    totalSeconds: 0,
    isTodaysMoveCompleted: false,
    isCardioCompleted: false,
    showCompletionModal: false,
    showWorkoutInProgressModal: false,
    showProgressTimerModal: false,
    circuitOneExercises: null,
    circuitTwoExercises: null,
  };

  async componentDidMount() {
    try {
      const exercises = await this._appendCachedVideoUrl();
      this.setState({
        circuitOneExercises: exercises[0],
        circuitTwoExercises: exercises[1],
        exercises,
      });
    } catch (err) {
      console.log(err.stack);
    }
  }

  render() {
    const {
      description,
      time,
      imageUrl,
      primaryTag,
      secondaryTag,
      secondaryType,
      rounds,
      level,
      isToday,
    } = this.props.navigation.state.params.workout;
    const { exercises, isTodaysMoveCompleted } = this.state;

    if (exercises.length > 0) {
      return (
        <View>
          <ComboDetail
            workoutImage={imageUrl}
            primaryTag={primaryTag}
            secondaryTag={secondaryTag}
            workoutTitle={description}
            exercises={exercises}
            mainTitle={description}
            time={time}
            level={level}
            secondaryType={secondaryType}
            rounds={rounds}
            isTodaysMoveCompleted={isTodaysMoveCompleted}
            circuitName="Circuit"
            onLargeBtnPressed={this._showCircuitRound}
            onSweatSoloPress={this._showProgressTimer}
            onVideoLibraryPress={this._chooseVideo.bind(this)}
            onCompletionPress={this._showCompletionModal}
            onOutsideWorkoutPress={this._showOutsideWorkout}
            workout={this.props.navigation.state.params.workout}
            onSkipPress={isToday ? this._skipWorkout : null}
            openVideoModal={this.props.screenProps.openVideoModal}
            renderVideoModal={this.props.screenProps.renderVideoModal}
            navigation={this.props.navigation}
          />
          {this._renderModals()}
        </View>
      );
    }

    return null;
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
          "Vishal - checking for chooseVideoInstead in AsyncStorage 1 ComboDetail"
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
              // if (videoPlayedDuration < 30)
              if (userWatchedHalfOfTheVideo == false) {
                Alert.alert(
                  "",
                  "To log your workout, complete at least half of the video. You've got this!"
                );
              } else {
                this.setState({
                  videoPlayedDuration,
                });
                this._onWorkoutComplete();
              }
            }, 500);
          }
        );
      }
    );
    this.props.navigation.navigate("VideoLibraryNew", { chooseVideoBtn: true });
  };
  componentWillUnmount() {
    console.log("componentWillUnmount");
    if (this.listener != undefined) {
      AsyncStorage.removeItem("ChooseVideoInstead");
      console.log(
        "Vishal - Remove listner if already added => " + this.listener
      );
      EventRegister.removeEventListener(this.listener);
    }
  }
  _onWorkoutComplete = () => {
    console.log("_onWorkoutComplete");
    AsyncStorage.getItem("absOrCardioComplete", (err, result) => {
      if (this.state.isTodaysMoveCompleted == false) {
        var showCompletionModalVar = false;
        if (result == null) {
          AsyncStorage.setItem("absOrCardioComplete", "abs");
        } else {
          if (result == "cardio") {
            AsyncStorage.removeItem("absOrCardioComplete");
            showCompletionModalVar = true;
          } else {
            showCompletionModalVar = false;
          }
        }
        console.log(err);
        console.log(result);
        this.setState({
          showCompletionModal: showCompletionModalVar,
          isTodaysMoveCompleted: true,
          showWorkoutInProgressModal: false,
        });
      }
    });

    // AsyncStorage.setItem('absOrCardioComplete', "abs");

    // this.setState({
    //   showWorkoutInProgressModal: false,
    //   showCompletionModal: true
    // });
  };

  _showCircuitRound = () => {
    const timeStamp = Date.now();
    this.setState({
      showWorkoutInProgressModal: true,
      workoutStartTime: timeStamp,
    });
  };

  _showOutsideWorkout = () => {
    const { workout } = this.props.navigation.state.params;
    this.props.navigation.navigate("OutsideWorkout", {
      title: workout.description,
      onCompletionPress: this._handleOutsideWorkout.bind(this),
    });
  };
  _showOutsideWorkoutFromTimer = () => {
    this.props.navigation.navigate("OutsideWorkout");
    setTimeout(() => {
      this.setState({
        showProgressTimerModal: false,
      });
    }, 100);
  };

  _showVideoList = () => {
    const { secondaryType } = this.props.navigation.state.params.workout;
    let category = secondaryType.replace("Cardio", "Workouts");
    this.props.navigation.navigate("VideoLibraryDetail", {
      videoListTitle: category,
    });
  };

  _appendCachedVideoUrl() {
    const { primaryTags, secondaryTags } = this._parseTags();
    const { workout } = this.props.navigation.state.params;

    const newPrimaryTags = Promise.all(
      primaryTags.map((exercise) => {
        const { tag, videoUrl } = exercise;
        return VideoCacheModule.getCachedExerciseVideoFilePath(
          workout,
          tag
        ).then((cache) => {
          if (cache == null) cache = {};

          const { path, _480Path } = cache;
          return {
            ...exercise,
            videoUrl: path || this._use480VideoUrl(videoUrl),
          };
        });
      })
    );
    return Promise.all([newPrimaryTags, []]);
  }

  _parseTags() {
    const { workout } = this.props.navigation.state.params;
    const { primaryTag: primaryTags, secondaryTag: secondaryTags } = workout;

    return {
      primaryTags,
      secondaryTags,
    };
  }

  _use480VideoUrl(videoUrl) {
    if (videoUrl == null || videoUrl.length === 0) return videoUrl;
    return videoUrl
      .replace("/exercises%2F", "/exercises480%2F%20")
      .replace(".mp4", "480.mp4");
  }

  _renderModals() {
    const { description, rounds } = this.props.navigation.state.params.workout;
    const { screenAfterWorkout } = this.props.navigation.state.params;
    const {
      showCompletionModal,
      showProgressTimerModal,
      showWorkoutInProgressModal,
      totalSeconds,
      circuitOneExercises,
      circuitTwoExercises,
      workoutTime,
    } = this.state;

    const { quote } = this.props.screenProps;

    let exercises = [];
    for (let i = 0; i < rounds; i++) {
      exercises = exercises.concat(circuitOneExercises);
    }
    if (circuitTwoExercises != null) {
      if (circuitTwoExercises.length > 0) {
        for (let i = 0; i < rounds; i++) {
          exercises = exercises.concat(circuitTwoExercises);
        }
      }
    }
    var time = "";
    var totalSecondsFinal = 0;
    if (showCompletionModal && this.state.workoutTime != "") {
      console.log("Vishal : showCompletionModal : ");
      const { workoutTime } = this.state;
      const HMS = workoutTime.split(":");
      console.log("Vishal : HMS : " + HMS);
      var HH = 0;
      var MM = 0;
      var SS = 0;
      var totalSecondsTemp = 0;
      if (HMS.length == 3) {
        HH = HMS[0];
        console.log("Vishal HH : " + HH);
        MM = HMS[1];
        console.log("Vishal MM : " + MM);
        SS = HMS[2];
        console.log("Vishal SS : " + SS);
        totalSecondsTemp =
          parseInt(HH) * 60 * 60 + parseInt(MM) * 60 + parseInt(SS);
        console.log("Vishal totalSeconds : " + totalSecondsTemp);
        totalSecondsFinal = totalSecondsTemp;
        time = this._formatTimeFromSeconds(totalSecondsTemp);
        console.log("Vishal : workout time : " + time);
      } else {
        time = workoutTime;
        totalSecondsFinal =
          totalSecondsFinal + this._getSecondsFromTimeString(workoutTime);
        time = this._formatTimeFromSeconds(totalSecondsFinal);
      }
    }
    if (showCompletionModal && this.state.cardioTime != "") {
      console.log("Vishal : showCompletionModal : ");
      const { cardioTime } = this.state;
      const HMS = cardioTime.split(":");
      console.log("Vishal : HMS : " + HMS);
      var HH = 0;
      var MM = 0;
      var SS = 0;
      var totalSecondsTemp = 0;
      if (HMS.length == 3) {
        HH = HMS[0];
        console.log("Vishal HH : " + HH);
        MM = HMS[1];
        console.log("Vishal MM : " + MM);
        SS = HMS[2];
        console.log("Vishal SS : " + SS);
        totalSecondsTemp =
          parseInt(HH) * 60 * 60 + parseInt(MM) * 60 + parseInt(SS);
        console.log("Vishal totalSeconds : " + totalSecondsTemp);
        totalSecondsFinal = totalSecondsTemp;
        time = this._formatTimeFromSeconds(totalSecondsTemp);
        console.log("Vishal : workout time : " + time);
      } else {
        time = cardioTime;
        totalSecondsFinal =
          totalSecondsFinal + this._getSecondsFromTimeString(cardioTime);
        time = this._formatTimeFromSeconds(totalSecondsFinal);
      }
    }
    if (showCompletionModal && this.state.outsideWorkoutData != null) {
      console.log(
        "Vishal : showCompletionModal : for this.state.outsideWorkoutData "
      );
      console.log(
        "Vishal : showCompletionModal : for this.state.outsideWorkoutData : " +
          this.state.outsideWorkoutData
      );
      time = this.state.outsideWorkoutData.time;
      totalSecondsFinal =
        totalSecondsFinal + this._getSecondsFromTimeString(time);
      time = this._formatTimeFromSeconds(totalSecondsFinal);
      console.log("Vishal : time : " + time);
    }
    if (showCompletionModal && this.state.workoutStartTime != 0) {
      console.log("Vishal : showCompletionModal : for regular workout");
      const { workoutStartTime, videoPlayedDuration } = this.state;
      /*const start = workoutStartTime;
      console.log("Vishal : workoutStartTime : " + workoutStartTime);
      const end   = Date.now();
      console.log("Vishal : workoutEndTime : " + end);
      var diff = moment.duration(moment(end).diff(moment(start)));
      var seconds = parseInt(diff.asSeconds()); //84
      totalSecondsFinal = seconds + totalSecondsFinal;
      time = this._formatTimeFromSeconds(totalSecondsFinal)*/
      time = this._formatTimeFromSeconds(videoPlayedDuration);
      console.log("Vishal : workout time : " + time);
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
          />
        ) : null}
        <CompletionModal
          workout={this.props.navigation.state.params.workout}
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
            outsideWorkoutData: this.state.outsideWorkoutData,
          }}
          screenAfterWorkout={screenAfterWorkout}
          screenProps={{
            goals: this.props.screenProps.goals,
            saveBottleCount: this.props.screenProps.saveBottleCount,
          }}
        />
        <ProgressTimer
          title={description}
          visible={showProgressTimerModal}
          onClose={this._closeProgressTimer}
          onOutsideWorkoutPress={this._showOutsideWorkoutFromTimer}
          onCompletePress={this._showCompletionModalFromTimer.bind(this)}
          withTimer={true}
        />
      </View>
    );
  }

  _onCloseWorkoutInProgressModal = () => {
    this.setState({
      showWorkoutInProgressModal: false,
    });
  };

  _showBonusChallange = () => {
    console.log("_showBonusChallange test 1");
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
    //         // this.props.navigation.pop();

    //         this.props.navigation.navigate("Trophies", newProps);
    //       }
    //     );
    //   })
    //   .catch((err) => console.log(err.stack));
  };

  _onCloseCompletionModal = () => this.setState({ showCompletionModal: false });

  _onCompletionFlowEnd = (screenName, props) => {
    const { workout } = this.props.navigation.state.params;

    console.log("_onCompletionFlowEnd in ComboDetail");

    // const { isFromChallangeDashboard, challangeDetail } = workout;

    // console.log("isFromChallangeDashboard");
    // console.log(isFromChallangeDashboard);
    // console.log("challangeDetail");
    // console.log(challangeDetail);

    // if (isFromChallangeDashboard != undefined && isFromChallangeDashboard)
    // {
    //   const { challangeDetail} = this.props.navigation.state.params.workout;
    //   console.log(challangeDetail)
    //   const createdAt = Date.now();
    //   const today = new Date(createdAt);
    //   const name = "regular";/* "d10" or "bonus" */

    //   const { validPurchase } = this.props.screenProps;
    //   console.log("saveWorkoutForChallenge called in index.js in ComboDetail");
    //   this.props.saveWorkoutForChallenge({createdAt, validPurchase, name});
    // }
    // else
    // {
    var completedWorkout = workout;
    if (this.state.cardioTime == "") {
      completedWorkout = {
        ...workout,
        cardioTime: this.state.cardioTime,
        isTodaysMoveCompleted: true,
      };
    } else {
      completedWorkout = {
        ...workout,
        cardioTime: this.state.cardioTime,
        isCardioCompleted: true,
      };
    }
    console.log(completedWorkout);
    const { isPreviousWorkoutCompleted, isCompleted, day } =
      this.props.navigation.state.params.workout;

    // alert(
    //   "1. day: " +
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
      // alert("4.\n" + JSON.stringify(completedWorkout));
      this.props.saveCompletedWorkout(completedWorkout);
    }
    // }
    // }
    this.setState({ cardioTime: "", showCompletionModal: false });

    if (screenName) {
      this.props.navigation.navigate(screenName, props);
    } else {
      this.props.navigation.goBack();
    }
  };

  _showProgressTimer = () => {
    this.setState({
      showProgressTimerModal: true,
    });
  };

  _showCompletionModalFromTimer(time) {
    console.log("__showCompletionModalFromTimer");
    console.log(time);
    AsyncStorage.getItem("absOrCardioComplete", (err, result) => {
      console.log(
        "this.state.isCardioCompleted : " + this.state.isCardioCompleted
      );

      if (this.state.isCardioCompleted == false) {
        if (result == null) {
          AsyncStorage.setItem("absOrCardioComplete", "cardio");
          this.setState({
            cardioTime: time,
            isCardioCompleted: true,
            showProgressTimerModal: false,
          });
        } else {
          if (result == "abs") {
            AsyncStorage.removeItem("absOrCardioComplete");
          }
          console.log(err);
          console.log(result);
          this.setState({
            cardioTime: time,
            isCardioCompleted: true,
            showCompletionModal: true,
            showProgressTimerModal: false,
          });
        }
      }
    });
  }

  _twoDigitFormat(num) {
    console.log("_twoDigitFormat called");
    const str = num.toString();
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
    var finalString = "";
    var hourString = "";
    var minutesString = "";
    var secondsString = "";
    if (hours > 0) {
      if (hours > 1) {
        finalString = `${this._twoDigitFormat(hours)} Hours`;
      } else {
        finalString = `${this._twoDigitFormat(hours)} Hour`;
      }
    }
    hourString = finalString;
    console.log("finalString after checking for hours : ==> " + finalString);
    finalString = "";
    if (minutes > 0) {
      finalString = finalString != "" ? " " : "";
      if (minutes > 1) {
        finalString = finalString + `${this._twoDigitFormat(minutes)} Minutes`;
      } else {
        finalString = finalString + `${this._twoDigitFormat(minutes)} Minute`;
      }
    }
    minutesString = finalString;
    console.log("finalString after checking for minutes : ==> " + finalString);
    finalString = "";
    if (minutes == 0 && hours == 0 && seconds > 0) {
      finalString = finalString != "" ? " " : "";
      if (seconds > 1) {
        finalString = finalString + `${this._twoDigitFormat(seconds)} Seconds`;
      } else {
        finalString = finalString + `${this._twoDigitFormat(seconds)} Second`;
      }
      secondsString = finalString;
    }
    // if (hours > 1 && minutes > 1) {
    //   return `${this._twoDigitFormat(hours)} Hours ${this._twoDigitFormat(minutes)} Minutes`;
    // }
    // else if (hours == 1 && minutes > 1) {
    //   return `${this._twoDigitFormat(hours)} Hour ${this._twoDigitFormat(minutes)} Minutes`;
    // }
    // else if (hours == 1 && minutes == 1) {
    //   return `${this._twoDigitFormat(hours)} Hour ${this._twoDigitFormat(minutes)} Minute`;
    // }
    // else if (seconds < 59) {
    //   if (seconds > 1) {
    //     return `${this._twoDigitFormat(totalSeconds)} Seconds`;
    //   }
    //   else

    // }
    // return `${this._twoDigitFormat(minutes)} Minutes`;
    finalString = hourString + minutesString + secondsString;
    console.log("finalString : ==> " + finalString);
    return finalString;
  }
  _getSecondsFromTimeString(timeString) {
    const HMS = timeString.split(" ");
    var new_hours = 0;
    var new_minutes = 0;
    var new_seconds = 0;
    if (HMS.length > 5) {
      new_hours = HMS[0];
      new_minutes = HMS[2];
    } else if (HMS.length > 3) {
      new_hours = HMS[0];
      new_minutes = HMS[2];
    } else if (HMS.length < 3) {
      var hours_minutes_second = HMS[1];
      if (
        hours_minutes_second.includes("Hour") ||
        hours_minutes_second.includes("Hours")
      ) {
        new_hours = HMS[0];
      } else if (
        hours_minutes_second.includes("Minutes") ||
        hours_minutes_second.includes("Minute")
      ) {
        new_minutes = HMS[0];
      } else if (
        hours_minutes_second.includes("Seconds") ||
        hours_minutes_second.includes("Second")
      ) {
        new_seconds = HMS[0];
      }
    }
    return (
      parseInt(new_hours) * 60 * 60 + parseInt(new_minutes) * 60 + new_seconds
    );
  }
  _handleOutsideWorkout = (data) => {
    console.log("_handleOutsideWorkout");
    console.log(data);
    AsyncStorage.getItem("absOrCardioComplete", (err, result) => {
      console.log(
        "this.state.isCardioCompleted : " + this.state.isCardioCompleted
      );

      if (this.state.isCardioCompleted == false) {
        if (result == null) {
          AsyncStorage.setItem("absOrCardioComplete", "cardio");
          this.setState({
            outsideWorkoutData: data,
          });
          this.props.navigation.pop();
          setTimeout(() => {
            this.setState({
              outsideWorkoutData: data,
              showProgressTimerModal: false,
            });
          }, 1000);
        } else {
          if (result == "abs") {
            AsyncStorage.removeItem("absOrCardioComplete");
          }
          console.log(err);
          console.log(result);
          this.setState({
            outsideWorkoutData: data,
          });
          this.props.navigation.pop();
          setTimeout(() => {
            this.setState({
              outsideWorkoutData: data,
              showCompletionModal: true,
              showProgressTimerModal: false,
            });
          }, 1000);
        }
      }
    });
  };

  _showCompletionModal = (time) => {
    AsyncStorage.getItem("absOrCardioComplete", (err, result) => {
      console.log(
        "this.state.isCardioCompleted : " + this.state.isCardioCompleted
      );

      if (this.state.isCardioCompleted == false) {
        if (result == null) {
          AsyncStorage.setItem("absOrCardioComplete", "cardio");
          this.setState({
            workoutTime: time,
            showProgressTimerModal: false,
          });
        } else {
          if (result == "abs") {
            AsyncStorage.removeItem("absOrCardioComplete");
          }
          console.log(err);
          console.log(result);
          this.setState({
            workoutTime: time,
            showCompletionModal: true,
            showProgressTimerModal: false,
          });
        }
      }
    });
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

  _closeProgressTimer = () => {
    this.setState({
      showProgressTimerModal: false,
    });
  };
}

export default connect(null, {
  saveCompletedWorkout,
  skipWorkout,
  saveWorkoutForChallenge,
})(ComboDetailWrapper);
