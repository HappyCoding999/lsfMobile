/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Modal, AppState, Alert } from "react-native";
import { YellowBox, View, Text, Platform, StatusBar } from "react-native";
import TabBar from "./src/screens/TabBar";
import firebase from "react-native-firebase";
import Welcome from "./src/screens/Onboarding/Welcome";
import Loading from "./src/screens/Onboarding/Loading";
import Orientation from "react-native-orientation-locker";
import { LoginManager } from "react-native-fbsdk";
import { User } from "./src/DataStore";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
]);

export default class App extends Component {
  state = {
    loading: true,
    videoUrl: null,
    userCompletedAuthFlow: false,
    userHasBeenOnboarded: false,
    userDataFetched: false,
  };

  androidVideoPlayer = null;

  componentDidMount() {
    Orientation.lockToPortrait();
    const currentUser = firebase.auth().currentUser;
    console.log(currentUser);
    // if (currentUser) {
    //   this._checkForOnboardStatus(currentUser.uid);
    // }
    // console.log("currentUser: ", currentUser);
  }

  _deleteUser = () => {
    var user = firebase.auth().currentUser;

    // user.reauthenticateWithCredential

    user
      .delete()
      .then(() => {
        this.setState({
          userCompletedAuthFlow: false,
        });
      })
      .catch((err) =>
        Alert.alert(
          "LSF",
          "It's sad to see you go.\n\nDeleting your account permanently requires recent login. Please logout and login again, then delete your account."
        )
      );
    // .catch((err) => console.log(err));
  };

  _logoutUser = () => {
    LoginManager.logOut();
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({
          userCompletedAuthFlow: false,
        });
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (Text.defaultProps == null) {
      Text.defaultProps = {};
    }
    Text.defaultProps.allowFontScaling = false;

    const { loading } = this.state;
    const newAppState = !AppState.currentState.match(/active/);
    console.log("Vishal : render app.js called");
    console.log("Vishal : newAppState -", newAppState);
    console.log("Vishal : loading -", loading);

    // const isVisible = newAppState && loading;
    const isVisible = loading;
    console.log("Vishal : isVisible -", isVisible);

    return (
      <View style={{ flex: 1 }}>
        <Modal onRequestClose={() => ""} visible={isVisible}>
          <Loading onCompletion={this._loadingComplete} />
        </Modal>
        {this._renderNavigator()}
      </View>
    );
  }

  _renderNavigator() {
    const { userCompletedAuthFlow, userHasBeenOnboarded, userDataFetched } =
      this.state;
    const currentUser = firebase.auth().currentUser;
    const { loading } = this.state;
    if (loading == false) {
      if (userCompletedAuthFlow || currentUser) {
        return (
          <View style={{ backgroundColor: "white" }}>
            <StatusBar hidden={true} />
            <TabBar
              onLogout={this._logoutUser}
              onDeleteUser={this._deleteUser}
            />
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <Welcome authSuccess={this._authSuccess} />
          </View>
        );
      }
    }
  }

  _authSuccess = () => this.setState({ userCompletedAuthFlow: true });

  _playAndroidVideo = (videoUrl) => {
    this.setState(
      {
        videoUrl,
      },
      this.androidVideoPlayer._playVideo
    );
  };

  _loadingComplete = () => {
    this.setState({ loading: false });
  };

  // _checkForOnboardStatus = id => User.findById(id)
  //   .then(user => {
  //     let newState = {};
  //     if (user) {
  //       newState = { ...newState, userHasBeenOnboarded: user.onBoarded };
  //     }

  //     console.log("setting state");

  //     newState = { ...newState, userDataFetched: true };

  //     this.setState(newState);
  //   })
  //   .catch(err => console.log(err));
}
