import React, { Component } from 'react';
import { View, Text, scrollView } from 'react-native';
import { connect } from 'react-redux';
import {
  flagChallenge,
  saveChallengeWorkout,
  saveWorkoutForChallenge
} from "../../actions";
// components
import ChallengeDashboard from './ChallengeDashboard';

class ChallengeDashboardWrapper extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log("render ChallengeDashboard called");
    // let { daily10 } = this.props.screenProps;
    const screenProps = {
      ...this.props.screenProps,
      ssuChallenges: this.props.ssuChallenges,
      bootyChallenges: this.props.bootyChallenges,
      sleighChallenges: this.props.sleighChallenges,
      refreshIn21Challenges: this.props.refreshIn21Challenges,
      lotsOfLoveChallenges: this.props.lotsOfLoveChallenges,
      flagChallenge: this.props.flagChallenge,
      joinedChallenge: this.props.screenProps.joinedChallenge,
      daily10: this.props.screenProps.daily10,
      saveChallengeWorkout: this.props.saveChallengeWorkout,
      saveWorkoutForChallenge: this.props.saveWorkoutForChallenge,
      springSlimDownChallenges: this.props.springSlimDownChallenges
    };
    return (
      <View style={{ flex: 1 }}>
        <ChallengeDashboard
          navigation={this.props.navigation}
          screenProps={screenProps}
        />
      </View>
    );
  }
}

mapStateToProps = ({ userData }) => ({ 
  bootyChallenges: userData.bootyChallenges,
  sleighChallenges: userData.sleighChallenges,
  refreshIn21Challenges: userData.refreshIn21Challenges,
  lotsOfLoveChallenges: userData.lotsOfLoveChallenges,
  springSlimDownChallenges: userData.springSlimDownChallenges
});
const actions = {
  flagChallenge,
  saveChallengeWorkout,
  saveWorkoutForChallenge
};

export default connect(mapStateToProps, actions)(ChallengeDashboardWrapper);