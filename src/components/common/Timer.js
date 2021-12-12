import React, { Component } from "react";
import { Text } from "react-native";
import BackgroundTimer from 'react-native-background-timer';
import { color,colorNew} from "../../modules/styles/theme"

import { EventRegister } from "react-native-event-listeners";

export class Timer extends Component {

  state = {
    totalSeconds: 0
  };
  listener = null;
  timer = null;

  componentDidMount() {
    listener = EventRegister.addEventListener("resetTimer", this._resetTimer);
  }

  _resetTimer = () => {
    this.setState({
      totalSeconds: 0
    });
  };

  componentWillUnmount() {
    this._stopTimer();
    EventRegister.removeEventListener(listener);
  }

  render() {
    const { text } = styles;
    const { start } = this.props

    if (start) {
      this._startTimer();
    } else {
      this._stopTimer();
    }

    return (
      <Text allowFontScaling={false} style={text}>{this._formatTime()}</Text>
    );
  }

  _formatTime() {
    const { totalSeconds } = this.state;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = (totalSeconds - (hours * 3600) - (minutes * 60))

    return `${this._twoDigitFormat(hours)}:${this._twoDigitFormat(minutes)}:${this._twoDigitFormat(seconds)}`;
  }

  _twoDigitFormat(num) {
    const str = num.toString();
    if (str.length <= 1) {
      return "0" + str;
    }

    return str;
  }


  /*_startTimer = () => {
    if (this.timer === null) {
      this.timer = setInterval(() => {
        const { totalSeconds } = this.state;
        this.setState({
          totalSeconds: totalSeconds + 1
        });
      }, 1000);
    }
  };

  _stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }*/


   _startTimer = () => 
   {
      const { totalSeconds } = this.state;
      if (this.timer === null) {
        this.timer = setInterval(() => {
        }, 1000);
        BackgroundTimer.runBackgroundTimer(() => { 
          const { totalSeconds } = this.state;
          this.setState({
            totalSeconds: totalSeconds + 1,
          });
          this.props.updateTimer(this._formatTime());
        }, 
        1000);
      }
    }

  _stopTimer() {
    if (this.timer) 
    {
      clearInterval(this.timer);
      this.timer = null;
      BackgroundTimer.stopBackgroundTimer();
    }
  };
}

const styles = {
  text: {
    width:"100%",
    fontFamily: "SF Pro Text",
    fontSize: 60,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 75,
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink
  }
};

// 60 seconds in a minute 

// 3600 seconds in an hour