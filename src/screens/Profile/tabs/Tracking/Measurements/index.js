import React, { Component } from "react";
import { View } from "react-native";
import { sortBy } from "lodash";
import Measurements from "./Measurements";
import { saveMeasurement,updateMeasurement } from "../../../../../actions";
import { connect } from "react-redux";
import { howToMeasurements } from "../../../../../utils/videoData";

class MeasurementWrapper extends Component {
render() {

  const { measurements } = this.props.screenProps;
  console.log("measurements");
  console.log(measurements);
  const passedProps = {
    navigation: this.props.navigation,
    onSubmit: data => this.props.saveMeasurement(data),
    updateMeasurement: data => this.props.updateMeasurement(data),
    addButtonPress: () => this.props.navigation.navigate("NewEntry",{
      backToScreen: this.props.navigation.state.params.backToScreen == undefined ? '' : this.props.navigation.state.params.backToScreen,
    }),
    measurements: measurements,//sortBy(measurements, m => m.createdAt).reverse()
  };


    return (
      <View style={{ width: "100%", backgroundColor: "white", flex: 1 }}>
        <Measurements {...passedProps} />
        {this._renderVideoModal()}
      </View>
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

export default connect(null, { saveMeasurement,updateMeasurement })(MeasurementWrapper);

/*
export default props => {
  const { measurements } = props.screenProps;
  const passedProps = {
    navigation: props.navigation,
    addButtonPress: () => props.navigation.navigate("NewEntry",{
      backToScreen: props.navigation.state.params.backToScreen == undefined ? '' : props.navigation.state.params.backToScreen,
    }),
    measurements: sortBy(measurements, m => m.createdAt).reverse()
  };

  return (
    <View style={{ width: "100%", backgroundColor: "white", flex: 1 }}>
      <Measurements {...passedProps} />
    </View>
  );
}
*/