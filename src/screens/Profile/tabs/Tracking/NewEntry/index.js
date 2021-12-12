import React, { Component } from "react";
import { Modal, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import { flow, sortBy, last } from "lodash/fp";
import { connect } from "react-redux";
import { saveMeasurement,updateMeasurement } from "../../../../../actions";
import NewEntry from "./NewEntry";
import { howToMeasurements } from "../../../../../utils/videoData";
// import { User } from "../../../../../DataStore";


class NewEntryWrapper extends Component {

  render() {
    const { measurements } = this.props.screenProps;
    const defaultLatestMeasurement = {
      weight: 0,
      waist: 0,
      biceps: 0,
      thighs: 0,
      hips: 0
    };
    const { isForEdit,editIndex} = this.props;
    const passedProps = {
      onSubmit: data => this.props.saveMeasurement(data),
      updateMeasurement: data => this.props.updateMeasurement(data),
      howToPress: this._playHowToVideo,
      latestMeasurement: flow(sortBy(m => m.createdAt), last)(measurements) || defaultLatestMeasurement,
      measurements,
      isForEdit,
      editIndex,
      onClose: this.props.onClose
    };

    return (
      <>
        <NewEntry
          {...passedProps}
        />
        {this._renderVideoModal()}
      </>
    );
  }

  _renderVideoModal = () => {
    const { screenProps } = this.props;

    const { videoUrl, thumbnailUrl, videoName, videoDescription } = howToMeasurements
    return screenProps.renderVideoModal(videoUrl, thumbnailUrl, videoName, videoDescription);
  };

  _playHowToVideo = () => {
    const { screenProps } = this.props;

    const { videoUrl, thumbnailUrl, videoName, videoDescription } = howToMeasurements
    screenProps.openVideoModal(videoUrl, thumbnailUrl, videoName, videoDescription);
  };
}

export default connect(null, { saveMeasurement,updateMeasurement })(NewEntryWrapper);