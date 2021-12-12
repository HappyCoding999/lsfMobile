import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { saveCompletedWorkout, skipWorkout } from "../../../actions";
import CardioDetail from "./CardioDetail";
import CompletionModal from "../CompletionModalStack";
import ProgressTimer from "../../ProgressTimer";
import { getAchievements, User } from "../../../DataStore";

class CardioDetailWrapper extends Component {
  state = {
    showCompletionModal: false,
    outsideWorkoutData: null,
    workoutTime: "",
    showProgressTimerModal: false,
  };

  render() {
    const { description, time, primaryType, isToday } =
      this.props.navigation.state.params.workout;

    return (
      <View>
        <CardioDetail
          mainTitle={description}
          type={primaryType}
          secondTitle={time}
          onSweatSoloPress={this._showProgressTimer}
          onVideoLibraryPress={this._showVideoList}
          onOutsideWorkoutPress={this._showOutsideWorkout.bind(this)}
          onCompletionPress={this._showCompletionModal}
          openVideoModal={this.props.navigation.state.params.openVideoModal}
          renderVideoModal={this.props.navigation.state.params.renderVideoModal}
          onSkipPress={isToday ? this._skipWorkout : null}
        />
        {this._renderModals()}
      </View>
    );
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

  _renderModals() {
    const { description, day } = this.props.navigation.state.params.workout;
    const { screenAfterWorkout } = this.props.navigation.state.params;
    const { showCompletionModal, showProgressTimerModal } = this.state;
    var time = "";
    if (showCompletionModal && this.state.workoutTime != "") {
      console.log("Vishal : showCompletionModal : ");
      const { workoutTime } = this.state;
      const HMS = workoutTime.split(":");
      console.log("Vishal : HMS : " + HMS);
      var HH = 0;
      var MM = 0;
      var SS = 0;
      var totalSeconds = 0;
      if (HMS.length == 3) {
        HH = HMS[0];
        console.log("Vishal HH : " + HH);
        MM = HMS[1];
        console.log("Vishal MM : " + MM);
        SS = HMS[2];
        console.log("Vishal SS : " + SS);
        totalSeconds = parseInt(HH) * 60 + parseInt(MM) * 60 + parseInt(SS);
        console.log("Vishal totalSeconds : " + totalSeconds);
        time = this._formatTimeFromSeconds(totalSeconds);
        console.log("Vishal : workout time : " + time);
      } else {
        time = workoutTime;
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
      console.log("Vishal : time : " + time);
    }
    const { quote, goals } = this.props.screenProps;
    console.log("_renderModals CardioDetail");
    return (
      <View>
        <CompletionModal
          quote={quote}
          onStackComplete={this._onCompletionFlowEnd}
          title={description}
          achievements={this.props.screenProps.achievements}
          start={showCompletionModal}
          day={day}
          viewTrophie={this._showTrophie}
          viewBonusChallange={this._showBonusChallange}
          onClose={this._onCloseCompletionModal}
          screenAfterWorkout={screenAfterWorkout}
          workout={{
            ...this.props.navigation.state.params.workout,
            completionTime: time,
            outsideWorkoutData: this.state.outsideWorkoutData,
          }}
          screenProps={{
            goals: this.props.screenProps.goals,
            saveBottleCount: this.props.screenProps.saveBottleCount,
          }}
        />
        <ProgressTimer
          visible={showProgressTimerModal}
          headerText=""
          withTimer={true}
          onClose={this._closeProgressTimer}
          onCompletePress={this._showCompletionModal}
          onOutsideWorkoutPress={this._showOutsideWorkoutFromTimer.bind(this)}
          withTimer={true}
        />
      </View>
    );
  }
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

    //         // alert("2. showTrophie");

    //         // this.props.navigation.navigate("Trophies", newProps);
    //       }
    //     );
    //   })
    //   .catch((err) => console.log(err.stack));
  };
  _showOutsideWorkout = () => {
    const { workout } = this.props.navigation.state.params;
    this.props.navigation.navigate("OutsideWorkout", {
      title: workout.description,
      onCompletionPress: this._handleOutsideWorkout.bind(this),
    });
  };
  _showOutsideWorkoutFromTimer = () => {
    const { workout } = this.props.navigation.state.params;
    this.props.navigation.navigate("OutsideWorkout", {
      title: workout.description,
      onCompletionPress: this._handleOutsideWorkout.bind(this),
    });
    setTimeout(() => {
      this.setState({
        showProgressTimerModal: false,
      });
    }, 100);
  };
  _showVideoList = () => {
    const { primaryType } = this.props.navigation.state.params.workout;
    let category = primaryType.replace("Cardio", "Workouts");
    // this.props.navigation.navigate('VideoLibraryDetail', { videoListTitle: category })
    this.props.navigation.navigate("VideoLibraryDetail", {
      videoListTitle: category,
      backToScreen: "Today",
    });
  };

  _onCloseCompletionModal = () => {
    this.setState({ showCompletionModal: false });
  };

  _onCompletionFlowEnd = (screenName, props) => {
    const { workout } = this.props.navigation.state.params;
    this.setState({ showCompletionModal: false });
    const { isPreviousWorkoutCompleted, isCompleted, day } =
      this.props.navigation.state.params.workout;

    // alert(
    //   "3. day: " +
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
      // alert("2.\n" + JSON.stringify(workout));
      this.props.saveCompletedWorkout(workout);
    }
    // }

    if (screenName) {
      // if (screenName === "VideoLibraryNew") {
      //   this.props.goToRecovery(true);
      // }
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
  _handleOutsideWorkout = (data) => {
    console.log("_handleOutsideWorkout");
    console.log(data);
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
  };
  _showCompletionModal = (time) => {
    console.log("_showCompletionModal");
    console.log(time);
    this.setState({
      workoutTime: time,
      showCompletionModal: true,
      showProgressTimerModal: false,
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
})(CardioDetailWrapper);
