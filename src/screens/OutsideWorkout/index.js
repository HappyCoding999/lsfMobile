import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import OutsideWorkout from "./OutsideWorkout";

export default class extends Component {
  render() {
    console.log("render OutsideWorkoutWrapper");
    return <OutsideWorkout navigation={this.props.navigation} />;
  }
}
