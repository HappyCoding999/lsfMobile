import React, { Component } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import DailySweat from "./DailySweat"
import { plainModalHeaderWrapper } from "../../../components/common";
import { color } from "../../../modules/styles/theme";

const WrappedDailySweat = plainModalHeaderWrapper(DailySweat);
const headerProps = {
  closeButtonType: "white",
  headerText: "LSF DAILY 10",
  containerViewStyle: {
    backgroundColor: "transparent",
    zIndex: 1
  },
  headerTextStyle: {
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "center",
    color: 'white',
    width: 220
  }
};

export default class extends Component {

  state = {
    currentIdx: 0,
  };

  render() {
    const { onClose, visible, animType } = this.props;
    const { imgUrl, name, reps } = this._getMoveData();

    const passedHeaderProps = {
      ...headerProps,
      onClose
    }

    return (
      <Modal onRequestClose={() => ""} visible={visible} animationType={animType || "slide"}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }} forceInset={{ top: "always" }}>
          <WrappedDailySweat
            imgUrl={imgUrl}
            name={name}
            reps={reps}
            onRightArrowPress={this._nextMove}
            onLeftArrowPress={this._previousMove}
            headerProps={passedHeaderProps}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  _nextMove = () => {
    const { currentIdx } = this.state;
    const { onWorkoutComplete, move4 } = this.props;

    if (move4.imgUrl != undefined && currentIdx < 9) {
      return this.setState({ currentIdx: currentIdx + 1 })
    }
    else if (move4.imgUrl == undefined && currentIdx < 8) {
      return this.setState({ currentIdx: currentIdx + 1 })
    }

    onWorkoutComplete();
  }

  _previousMove = () => {
    const { currentIdx } = this.state;
    if (currentIdx > 0) {
      this.setState({
        currentIdx: currentIdx - 1
      });
    }
  }

  _getMoveData() {
    const { move1, move2, move3, move4 } = this.props

    if (move4 && move4.imgUrl != undefined) {
      var moves = [move1, move2, move3, move1, move2, move3, move1, move2, move3, move4];
    } else {
      var moves = [move1, move2, move3, move1, move2, move3, move1, move2, move3];
    }

    const move = moves[this.state.currentIdx]; 

    if (move) {
      const { imgUrl, name, reps } = move;
      return {
        imgUrl, 
        name,
        reps
      };
    }

    return {
      imgUrl: null,
      name: null,
      reps: null
    };
  }

}
