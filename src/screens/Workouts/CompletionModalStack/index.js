import React, { Component } from "react";
import { View, Linking, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { saveSweatLog, saveWorkoutForChallenge } from "../../../actions";
import Completion from "./Completion";
import PremiumEndScreen from "../../../screens/PremiumEndScreen";
import WhatsNext from "./WhatsNext";
import SweatLog from "./SweatLog";
//import SweatLog from "../../../screens/Journal/SweatLog";
import { getAchievements } from "../../../DataStore";
import { SELECTED_TAB_INDEX } from "../../../actions/types";

class CompletionModalStackWrapper extends Component {
  state = {
    showCompletionModal: true,
    showWhatsNextModal: false,
    showSweatLogModal: false,
  };

  constructor(props) {
    super(props);

    this._closeWhatsNext = this._closeWhatsNext.bind(this);

    this.getStarted();
  }

  getStarted = async () => {
    this.props.change_tab_index(0);
  };

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    const {
      title,
      start,
      screenAfterWorkout,
      quote,
      day,
      challengeActive,
      workout,
    } = this.props;
    const { showWhatsNextModal, showSweatLogModal, showCompletionModal } =
      this.state;
    console.log("CompletionModalStackWrapper render called");
    console.log(workout);
    return (
      <View>
        <PremiumEndScreen
          quote={quote}
          day={day}
          title={title}
          shift={this._openSweatLog}
          challengeActive={challengeActive}
          visible={start && showCompletionModal}
        />
        <SweatLog
          headerText={title}
          workout={workout}
          logButtonPressed={this._openWhatsNextAndLog}
          shift={this._openWhatsNext}
          visible={showSweatLogModal}
          isForEdit={false}
        />
        <WhatsNext
          headerText={(title || "").toUpperCase()}
          shift={this._done(screenAfterWorkout)}
          onBonusChallengePressed={this._viewBonusChallengeClicked()}
          // onStretchPressed={this._done("VideoLibraryDetail", {
          //   videoListTitle: "Stretching",
          // })}
          onStretchPressed={this._done("VideoLibraryNew", {
            // selected_tab_index: 1,
          })}
          onJournalPressed={this._done("RootNavigator1")}
          onTrophiePressed={this._viewTrophieClicked()}
          onShopClicked={this._shopClicked()}
          close={this._closeWhatsNext}
          screenProps={this.props.screenProps}
          visible={showWhatsNextModal}
        />
      </View>
    );
  }
  _closeWhatsNext = () => {
    console.log("_closeWhatsNext called");
    const { onStackComplete } = this.props;
    setTimeout(() => {
      this.setState(
        {
          showWhatsNextModal: false,
        },
        () => {
          onStackComplete();
        }
      );
    }, 100);
  };
  _done = (screenName, props) => () => {
    console.log("_done clicked : " + screenName);
    const { onStackComplete } = this.props;
    this.setState(
      {
        showCompletionModal: true,
        showWhatsNextModal: false,
        showSweatLogModal: false,
      },
      () => {
        if (screenName) {
          if (screenName === "VideoLibraryNew") {
            this.props.change_tab_index(1);
          }
          onStackComplete(screenName, props);
        }
      }
    );
  };
  _viewBonusChallengeClicked = () => () => {
    console.log("_viewBonusChallengeClicked check");
    const { onStackComplete } = this.props;
    this.setState(
      {
        showCompletionModal: false,
        showWhatsNextModal: false,
        showSweatLogModal: false,
      },
      () => {
        if (this.props.viewTrophie != undefined) {
          this.props.viewBonusChallange();
          onStackComplete();
        }
      }
    );
  };

  _viewTrophieClicked = () => () => {
    console.log("_viewTrophieClicked check");
    const { onStackComplete } = this.props;
    this.setState(
      {
        showCompletionModal: false,
        showWhatsNextModal: false,
        showSweatLogModal: false,
      },
      () => {
        if (this.props.viewTrophie != undefined) {
          this.props.viewTrophie();
          onStackComplete();
        }
      }
    );
  };

  _shopClicked = () => () => {
    console.log("_shopClicked");
    const { onStackComplete } = this.props;
    this.setState(
      {
        showCompletionModal: false,
        showWhatsNextModal: false,
        showSweatLogModal: false,
      },
      () => {
        onStackComplete();
        Linking.openURL("https://my.lovesweatfitness.com");
      }
    );
  };

  _openWhatsNextAndLog = (sweatLog) => {
    const { workout } = this.props;
    // console.log("workout");
    // console.log(workout);

    // let isFromChallangeDashboard = this.props.isFromChallangeDashboard ? this.props.isFromChallangeDashboard : false;
    // console.log("_openWhatsNextAndLog");
    // if (isFromChallangeDashboard)
    // {
    //   const { challangeDetail} = this.props.workout;
    //   console.log("_openWhatsNextAndLog isFromChallangeDashboard : " + isFromChallangeDashboard);
    //   console.log(challangeDetail)
    //   const createdAt = Date.now();
    //   const today = new Date(createdAt);
    //   const name = "regular";/* "d10" or "bonus" */

    //   const { validPurchase } = this.props.screenProps;
    //   this.props.saveWorkoutForChallenge({createdAt, validPurchase, name});
    // }
    // else
    // {
    // console.log("workout : " + workout);
    // console.log("sweatLog : " + sweatLog);

    if (workout == undefined) {
      return;
    }
    if (workout && workout.isCompleted != undefined && workout.isCompleted) {
      // workout isCompleted so not log it again

      console.log(
        "workout::::--::: 3: workout isCompleted so not log it again"
      );

      // REMOVE if anything Goes Wrong
      // const newSweatLog = { ...sweatLog, createdAt: Date.now() };
      // this.props.saveSweatLog(newSweatLog);

      // OR

      // this.props.saveSweatLog(sweatLog);
      // REMOVE
    } else {
      console.log("workout::::--::: 3: " + JSON.stringify(workout));

      if (
        workout &&
        workout.isPreviousWorkoutCompleted != undefined &&
        workout.isPreviousWorkoutCompleted
      ) {
        console.log("saveSweatLog called");
        this.props.saveSweatLog(sweatLog);
      }
    }
    // }

    // User.saveSweatLog(sweatLog)
    this._openWhatsNext();
  };

  _openWhatsNext = () => {
    this.setState({
      showWhatsNextModal: true,
      showSweatLogModal: false,
    });
  };

  _openSweatLog = () => {
    console.log("open sweat log");
    this.setState({
      showSweatLogModal: true,
      showCompletionModal: false,
    });
  };
}

mapStateToProps = ({ userData }) => ({
  challengeActive: userData.challengeActive,
});

// const mapDispatchToProps = (dispatch) => ({
//   selected_tab_index: (status) =>
//     dispatch({
//       type: "selected_tab_index",
//       payload: {
//         status,
//       },
//     }),
// });

// export default connect(mapStateToProps, {
//   saveSweatLog,
//   saveWorkoutForChallenge,
//   mapDispatchToProps,
// })(CompletionModalStackWrapper);

const mapDispatchToProps = (dispatch) => ({
  saveSweatLog,
  saveWorkoutForChallenge,
  change_tab_index: (status) =>
    dispatch({
      type: SELECTED_TAB_INDEX,
      payload: status,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletionModalStackWrapper);
