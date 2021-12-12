import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Modal, Image } from "react-native";
import { SafeAreaView } from "react-navigation";
import whiteLSFModalHeaderWrapper from "../../../components/common/ModalHeaderWrapper/WhiteLSFModalHeaderWrapper";
import JournalReview from "./JournalReview";
import { logo_white_love_seat_fitness } from "../../../images";
import { saveSweatLog } from "../../../actions";

const WrappedJournalWrapper = whiteLSFModalHeaderWrapper(JournalReview);
const headerProps = {
  closeButtonType: "white",
  headerTitle: (
    <Image
      style={{ width: "100%", top: 0 }}
      resizeMode="contain"
      source={logo_white_love_seat_fitness}
    />
  ),
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
// export default class extends Component {
class JournalWrapper extends Component {
  render() {
    const { visible, onClose, saveSweatLog } = this.props;
    const JournalReviewHeaderProps = {
      ...headerProps,
      onClose,
    };
    console.log("render JournalWrapper1 Vishal");
    return (
      <JournalReview
        close={this.props.navigation.goBack}
        headerProps={JournalReviewHeaderProps}
        saveSweatLog={saveSweatLog}
        navigation={this.props.navigation}
      />
    );
  }
}
mapStateToProps = ({ userData }) => ({});
export default connect(mapStateToProps, { saveSweatLog })(JournalWrapper);
