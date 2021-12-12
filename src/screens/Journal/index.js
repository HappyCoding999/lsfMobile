import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import { plainModalHeaderWrapper } from "../../components/common";
import Journal from "./Journal";

const WrappedJournalWrapper = plainModalHeaderWrapper(Journal);
const headerProps = {
  closeButtonType: "white",
  headerText: "Journal",
  containerViewStyle: {
    backgroundColor: "transparent",
    zIndex: 1,
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
    color: "white",
    width: 220,
  },
};
export default class extends Component {
  render() {
    console.log("render JournalWrapper");
    const { visible, onClose, userName, name } = this.props;
    console.log("userName");
    console.log(userName);
    console.log("name");
    console.log(name);

    const journalHeaderProps = {
      ...headerProps,
      name,
      userName,
      onClose,
    };
    console.log("render JournalWrapper1");
    return (
      <Journal
        {...this.props}
        close={onClose}
        headerProps={journalHeaderProps}
        navigation={this.props.navigation}
      />
    );
  }
}
