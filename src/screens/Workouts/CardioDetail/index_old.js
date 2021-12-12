import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { saveCompletedWorkout, skipWorkout } from "../../../actions";
import CardioDetail from "./CardioDetail";
import CompletionModal from "../CompletionModalStack";
import ProgressTimer from "../../ProgressTimer";

class CardioDetailWrapper extends Component {
  state = {
    showCompletionModal: false,
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
          onCompletionPress={this._showCompletionModal}
          onSkipPress={isToday ? this._skipWorkout : null}
        />
        {this._renderModals()}
      </View>
    );
  }

  _renderModals() {
    const { description, day } = this.props.navigation.state.params.workout;
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
          day={day}
          onClose={this._onCloseCompletionModal}
          screenAfterWorkout={screenAfterWorkout}
        />
        <ProgressTimer
          visible={showProgressTimerModal}
          headerText="CARDIO SWEAT SESH"
          withTimer={true}
          onClose={this._closeProgressTimer}
          onCompletePress={this._showCompletionModal}
          withTimer={true}
        />
      </View>
    );
  }

  _showVideoList = () => {
    const { primaryType } = this.props.navigation.state.params.workout;
    let category = primaryType.replace("Cardio", "Workouts");
    this.props.navigation.navigate("VideoLibraryDetail", {
      videoListTitle: category,
    });
  };

  _onCloseCompletionModal = () => {
    this.setState({ showCompletionModal: false });
  };

  _onCompletionFlowEnd = (screenName, props) => {
    const { workout } = this.props.navigation.state.params;
    this.setState({ showCompletionModal: false });

    this.props.saveCompletedWorkout(workout);
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

  _showCompletionModal = () => {
    this.setState({
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

export default connect(null, { saveCompletedWorkout, skipWorkout })(
  CardioDetailWrapper
);
