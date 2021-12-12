import React, { Component } from "react";
import { View, Text, Dimensions, ImageBackground, Modal, TouchableOpacity,Platform } from "react-native";
import { sample, range } from "lodash";
import { color } from "../../../modules/styles/theme"
import { Subscriptions } from "../../../components/common"
import { EventRegister } from "react-native-event-listeners";

const { height, width } = Dimensions.get('window');

export default class extends Component {
  constructor(props) {

    super(props);

    this.state = {
      showSubscriptionModal: false
    };
  }

  _navigateToWorkouts = ()=> {
    this.props.close();
    this.props.navigation.navigate('Menu');
  }

  _closeModal = () => { this.setState({ showSubscriptionModal: false }) }

  _renderSubscriptionModal(){
    const {showSubscriptionModal} = this.state

    return (<Modal
      visible={showSubscriptionModal}
      onRequestClose={()=> alert("close")}>
      <Subscriptions onClose={this._closeModal}/>
    </Modal>);

  }

  isIphoneXorAbove() {

    const dimen = Dimensions.get('window');

    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
    );
  }

  _renderEndscreen = () => {

    const { endScreen } = this.props;

    return (endScreen != null || endScreen != undefined) ? 
      <ImageBackground style={imageStyle} source={{ uri: endScreen }} />
    : 
      <ImageBackground style={imageStyle} source={require('../images/Daily_10_End_Screen_Sept-02.jpg')} />
  }

  render() {
    if (Platform.OS === "ios") {

      if (this.isIphoneXorAbove()) {
        imageStyle = {flex: 1, height: height, width: width, top: -64, resizeMode: 'contain', backgroundColor: 'white'};
      } else {
        imageStyle = {flex: 1, height: height + 20, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
      }

    } else {
      imageStyle = {flex: 1, height: height, width: width, top: -50, resizeMode: 'contain', backgroundColor: 'white'};
    }

    return (
      <View style={styles.container}>
        {this._renderEndscreen()}
          <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>
            <TouchableOpacity
              style={styles.buttonView}
              onPress={this._navigateToWorkouts}
            >
              <Text style={styles.buttonText}>WANT MORE?</Text>
            </TouchableOpacity>
          </View>
        {this._renderSubscriptionModal()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    top : Platform.OS === "ios" ? -20 : 10,
  },
  buttonText: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center",
    color: 'white'
  },
  buttonView: {
    height: 48,
    width: 240,
    borderRadius: 100,
    backgroundColor: '#F493A7',
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: "center"
  }
}

