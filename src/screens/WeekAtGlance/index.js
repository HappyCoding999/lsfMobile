import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import WeekAtGlance from "./WeekAtGlance";

export default class extends Component {
  render() {
    console.log("render WeekAtGlance");
    return <WeekAtGlance {...this.props} />;
  }
}
