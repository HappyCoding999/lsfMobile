import React, { Component } from "react";
import { View, Text } from "react-native";
import BackgroundTimer from 'react-native-background-timer';

export class CountDown extends Component {

  constructor(props) {
    super(props);

    this.timer = null;

    this.state = {
      secondsLeft: props.initial
    };
  }


  componentWillUnmount() {
    this._stopTimer();
  }

  render() {
    const { start,isTextBlack } = this.props;
    const { secondsLeft } = this.state;
    var textColor = "#fff"
    if (isTextBlack != undefined) {
      if (isTextBlack) {
        textColor = "#000"
      }
    }

    if (start) {
      if (secondsLeft == this.props.initial) 
      {
        this._startTimer();  
      }     
    } else {
      this._stopTimer();
    }
    
    return <Text style={{...styles.text,color: textColor}}>{secondsLeft}</Text>;
  }

/*
  _startTimer = () => {

    const { onClose } = this.props;

    if (this.timer === null) {
      this.timer = setInterval(() => {
        const { secondsLeft } = this.state;

        console.log(secondsLeft)

        if (secondsLeft === 0){
          this._stopTimer()
          onClose()
        }else{
          this.setState({
            secondsLeft: secondsLeft - 1
          });
        }
      }, 1000); 
    }
  }

  _stopTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
  */

  _startTimer = () => 
   {
      const { onClose } = this.props;
      if (this.timer === null) {
        BackgroundTimer.stopBackgroundTimer();
        this.timer = setInterval(() => {
        }, 1000);
        BackgroundTimer.runBackgroundTimer(() => { 
          const { secondsLeft } = this.state;

        if (this.timer) {
             if (secondsLeft === 0)
             {
                BackgroundTimer.stopBackgroundTimer();
                this._stopTimer()
                onClose()
              }else{
                  this.setState({
                secondsLeft: secondsLeft - 1
                });
              }
        }
        else
        {
          setTimeout(() => {BackgroundTimer.stopBackgroundTimer()}, 100)
        }       
        }, 
        1000);
      }
    }

  _stopTimer() {
    BackgroundTimer.stopBackgroundTimer();
    if (this.timer) 
    {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

}


const styles = {
  text: {
    height: 75,
    fontFamily: "Sofia Pro",
    fontSize: 72,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 75,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff"
  }
};