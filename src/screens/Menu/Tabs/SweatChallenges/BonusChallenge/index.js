import React, { Component } from "react";
import { View } from "react-native";
import BonusOverview from "./BonusOverview";
import { getExercisesByTags, User } from "../../../../../DataStore";
import CompletionModal from "../../../../Workouts/CompletionModalStack/Completion";
import WorkoutInProgress from "../../../../Workouts/WorkoutInProgress";
import { completeBonusChallenge } from "../../../../../actions";
import { connect } from "react-redux";

class BonusChallenge extends Component {
  state = {
    exercises: null,
    showWorkoutInProgessModal: false,
    showCompletionModal: false,
  };

  componentDidMount() {
    this.getStarted();
  }

  getStarted = () => {
    const { tags } = this.props.navigation.state.params;
    console.log("tags: ", tags);
    getExercisesByTags(tags).then((exercises) => {
      this.setState({ exercises }, () => {
        // console.log("exercises:--- " + JSON.stringify(exercises));
      });
    });
  };

  render() {
    const { title, exercisename, description, imageUrl } =
      this.props.navigation.state.params;
    // console.log("bonus props: ", this.props.navigation.state.params);
    const { showCompletionModal, showWorkoutInProgessModal, exercises } =
      this.state;
    // console.log("exercises: ", exercises);

    const { quote } = this.props.screenProps;

    // if (exercises === null) {
    //   return (
    //     <View
    //       style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
    //     >
    //       <BonusOverview
    //         title={title}
    //         exercisename={exercisename}
    //         description={description}
    //         imageUrl={imageUrl}
    //         onButtonPress={this._startBonusChallenege}
    //       />
    //     </View>
    //   );
    // }

    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <BonusOverview
          title={title}
          exercisename={exercisename}
          description={description}
          imageUrl={imageUrl}
          onButtonPress={this._startBonusChallenege}
        />
        {exercises !== null && (
          <WorkoutInProgress
            visible={showWorkoutInProgessModal}
            // exercises={this.state.exercises}
            exercises={exercises}
            onClose={this._closeWorkout}
            maxRounds={1}
            exercisesPerRound={6}
            onWorkoutComplete={this._onWorkComplete}
            progressTimerRequired={false}
            withVideo={true}
            animType="none"
            noTitle={true}
          />
        )}

        <CompletionModal
          quote={quote}
          title="bonus Challenge"
          visible={showCompletionModal}
          shift={this._closeCompletionModal}
        />
      </View>
    );
  }

  _onWorkComplete = () => {
    const bonusChallenge = this.props.navigation.state.params;
    User.saveBonusChallenge(bonusChallenge).catch((err) =>
      console.log(err.stack)
    );

    this.props.completeBonusChallenge({
      ...bonusChallenge,
      createdAt: Date.now(),
    });

    this._showCompletionModal();
  };

  _startBonusChallenege = () => {
    this.setState({ showWorkoutInProgessModal: true });
  };

  _showCompletionModal = () => {
    this.setState(
      {
        showCompletionModal: true,
        showWorkoutInProgessModal: false,
        exercises: null,
      },
      () => {
        this.getStarted();
      }
    );
  };

  _closeWorkout = () => {
    this.setState({ exercises: null, showWorkoutInProgessModal: false }, () => {
      this.getStarted();
    });
  };

  _closeCompletionModal = () => {
    this.setState(
      {
        showCompletionModal: false,
      },
      () => this.props.navigation.navigate("Sweat Challenges")
    );
  };
}

export default connect(null, { completeBonusChallenge })(BonusChallenge);
