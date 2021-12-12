import React, { Component } from "react";
import { View, Text, Dimensions, ScrollView, TextInput, TouchableHighlight, Alert, Modal, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from 'react-navigation'
import { color } from "../../../modules/styles/theme";
import { GradientSlider } from './../../../components/common/'
import firebase from 'react-native-firebase'
import { GoalBubble } from "../../../components/common/GoalBubble";
import { User } from "../../../DataStore";

const { width, height } = Dimensions.get('window');

export default class MeasurementsForm extends Component {
  constructor(props) {
    super(props);
    this.onNextButtonPressed = this.onNextButtonPressed.bind(this);
    this.goalAdded = this.goalAdded.bind(this)
    this.authorizing = false;

    this.state = {
      feet: "",
      inches: "",
      weightValue: "",
      goals: [],
      showLoadingModal: false,
      authorizing: false
    };
  }

  goalAdded = goal => {
    if (this.state.goals.includes(goal)) {
      const filteredItems = this.state.goals.filter(function (item) {
        return item !== goal
      })
      this.state.goals = filteredItems
    } else {
      this.state.goals.push(goal)
    }

    this.setState({
      goals: this.state.goals
    })
  }

  onNextButtonPressed = () => {
    const { authorizedUser } = this.props.navigation.state.params;

    if (this.authorizing) { console.log("not authorizing!"); return; }

    this.authorizing = true;

    this.setState({
      showLoadingModal: true,
      authorizing: true
    }, authorizedUser ? this._create : this._authorizeAndCreateUser);
  }

  _create = () => {
    const { user } = this.props.navigation.state.params;
    const { feet, inches, weightValue } = this.state;
    if (feet === "" || inches === "" || weightValue === "") {
      const error = {
        message: "Please fill in missing fields",
        code: ""
      };

      return this.setState({ showLoadingModal: false }, () => this._onAuthErr(error));
    }

    if (user.token) {
      this._createFacebookUser(user);
    } else {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(() => this._createUser(true))
        .catch(err => {window.alert(err); this.authorizing = true;
    this.authorizing = false;
    this.setState({
      showLoadingModal: false,
      authorizing: false
    }); /*this._onAuthErr(err)*/});
    }
  }

  _authorizeAndCreateUser = () => {
    const { feet, inches, weightValue } = this.state;
    const { user } = this.props.navigation.state.params;

    if (feet === "" || inches === "" || weightValue === "") {
      const error = {
        message: "Please fill in missing fields",
        code: ""
      };

      return this.setState({ showLoadingModal: false }, () => this._onAuthErr(error));
    }


    if (user.token) {
      this._createFacebookUser(user);
    } else {
      this._createUserWithEmailAndPassword(user);
    }
  }

  _createFacebookUser(user) {
    const credential = firebase.auth.FacebookAuthProvider.credential(user.token)

    firebase.auth().signInWithCredential(credential)
      .then(() => {
        var authUser = firebase.auth().currentUser;

        authUser.updateProfile({
          displayName: user.name
        })
          .then(this._createUser)
          .catch(this._onAuthErr);
      })
      .catch(this._onAuthErr);
  }

  _createUserWithEmailAndPassword(user) {

    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(() => {

        var authUser = firebase.auth().currentUser;
        authUser.updateProfile({
          displayName: user.name

        }).then(this._createUser)
          .catch(this._onAuthErr);
      })
      .catch(err => {window.alert(err); this.authorizing = true;
    this.authorizing = false;
    this.setState({
      showLoadingModal: false,
      authorizing: false
    }); /*this._onAuthErr(err)*/});
  }

  _createUser = isStripeCustomer => {
    const authUser = firebase.auth().currentUser;
    const { user, weeklyWorkoutValue } = this.props.navigation.state.params;
    const { feet, inches, weightValue } = this.state;
    const newUser = {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      birthday: user.birthday,
      userName: user.userName,
      weight: weightValue,
      feet: feet,
      inches: inches,
      weekly: weeklyWorkoutValue || "",
      stripeCustomer: isStripeCustomer ? true : false
    };

    if (user.avatar.trim() != "") {
      this.uploadImage(user.avatar)
        .then(url => {
          User.create({ ...newUser, avatar: url, authorizedID: authUser.uid })
            .then(this._onUserCreated)
            .catch(this._onAuthErr);
        })
        .catch(this._onAuthErr)
    } else {
      User.create({ ...newUser, avatar: user.avatar, authorizedID: authUser.uid })
        .then(this._onUserCreated)
        .catch(this._onAuthErr);
    }

  }

  _onUserCreated = () => {
    const { onSignupSuccess } = this.props;
    this.setState({
      showLoadingModal: false
    }, onSignupSuccess);
  };

  _onAuthErr = error => {
    const { code, message } = error;

    this.authorizing = false;
    this.setState({
      showLoadingModal: false
    }, () => window.alert(message));
    // this.setState({
    //   showLoadingModal: false
    // }, () => Alert.alert("An Error Occurred", message, code));
  };

  uploadImage = (path, mime = 'application/octet-stream') => {
    return new Promise((resolve, reject) => {


      const sessionId = new Date().getTime();
      const imageRef = firebase.storage().ref('profileimages/').child(sessionId + ".png");

      return imageRef.put(path, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
          console.log('Error uploading image: ', error);
        });
    });
  };


  sliderChanged = (value) => {

    console.log(value)

  }

  renderLoadingModal() {
    return (
      <Modal
        visible={this.state.showLoadingModal}
        animationType={"fade"}
        backgroundColor={"#fff"}
        onRequestClose={() => console.log("")}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", flexDirection: "column" }}>
          <Image style={{ marginBottom: 20 }} source={require("./images/illustrationPineapple.png")} />
          <ActivityIndicator
            animating={true}
            color={color.lightPink}
            size={"large"}
          />
          <Text style={styles.modalText}>LOADING ...</Text>
        </View>
      </Modal>
    );
  }

  renderBubbleGridView() {
    return (
      <View style={{ flexDirection: "column", marginTop: 20, alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "80%" }}>
          <View>
            <GoalBubble word={"LOSE WEIGHT"} action={this.goalAdded} />
          </View>
          <View>
            <GoalBubble word={"TIGHTEN UP"} action={this.goalAdded} />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", marginLeft: 65, marginTop: -20 }}>
          <View>
            <GoalBubble word={"EAT HEALTHIER"} action={this.goalAdded} />
          </View>
          <View>
            <GoalBubble word={"BUILD ENDURANCE"} action={this.goalAdded} />
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "80%", marginTop: -20 }}>
          <View>
            <GoalBubble word={"FEEL HAPPIER"} action={this.goalAdded} />
          </View>

          <View>
            <GoalBubble word={"GET STRONGER"} action={this.goalAdded} />
          </View>
        </View>
      </View>
    );
  }

  render() {

    const { heightValue, weightValue, feet, inches } = this.state;

    return (
      <View style={{ width: width, height: height, backgroundColor: "#fff", alignItems: "center", flexDirection: "column" }}>
        <SafeAreaView style={{ marginTop: 72 }} />
        <ScrollView horizontal={false} width={width}>
          <View style={{ alignItems: "center", width: width }}>
            <Text allowFontScaling={false} style={styles.primaryText}>Welcome to the first day of the rest of your life!</Text>
          </View>

          <View style={{ justifyContent: "flex-start", width: width }}>
            <Text allowFontScaling={false} style={styles.secondaryHeader}>Tell us about you!</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-around", width: width }}>
            <View style={styles.sectionStyle}>

              <TextInput
                maxLength={1}
                keyboardType='numeric'
                style={styles.textInputStyle}
                placeholder={"feet"}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(feet) => { this.setState({ feet }) }}>{feet}</TextInput>
            </View>

            <View style={styles.sectionStyle}>

              <TextInput
                maxLength={2}
                keyboardType='numeric'
                style={styles.textInputStyle}
                placeholder={"inches"}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(inches) => { this.setState({ inches }) }}></TextInput>
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                maxLength={3}
                keyboardType='numeric'
                style={styles.textInputStyle}
                placeholder={"pounds"}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(weightValue) => { this.setState({ weightValue }) }}>{weightValue}</TextInput>
            </View>

          </View>
          <Text allowFontScaling={false} style={styles.bodyText}>How many workouts do you do per week?</Text>
          <View style={{ marginTop: 20, justifyContent: "center", alignItems: "center" }}>
            <GradientSlider width={320} onMove={this.sliderChanged} />
            <View style={{ width: 300, flexDirection: "row", justifyContent: "space-between", marginLeft: 0, marginTop: 20 }}>
              <Text>0</Text>
              <Text>1</Text>
              <Text>2</Text>
              <Text>3</Text>
              <Text>4</Text>
              <Text>5</Text>
              <Text>6</Text>
              <Text>7</Text>
            </View>
          </View>
          <Text allowFontScaling={false} style={styles.bodyText}>What are your fitness goals?</Text>

          {this.renderBubbleGridView()}

          <View style={{ marginTop: 24, alignItems: "center", marginBottom: 40 }}>
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={this.onNextButtonPressed}
              underlayColor={'#ee90af'}>
              <Text allowFontScaling={false} style={styles.buttonText}>NEXT</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }

}

const styles = {
  primaryText: {
    flex: 0,
    width: 283,
    height: 48,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  },
  secondaryHeader: {
    width: 128,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
    marginTop: 24,
    textAlign: "left",
    marginLeft: 24
  },
  bodyText: {
    width: 327,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
    marginTop: 48,
    marginLeft: 24
  },
  bubbleText: {
    width: 88,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.hotPink,
    textAlign: "center"
  },
  textInputStyle: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.mediumGrey,
    fontSize: 16
  },
  sectionStyle: {
    height: 46,
    width: 80,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    width: 155,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  bubbleChoiceSelected: {
    width: 88,
    height: 88,
    backgroundColor: color.lightPink,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  bubbleChoiceDefault: {
    width: 88,
    height: 88,
    backgroundColor: "#fff",
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.hotPink,
    borderWidth: 2
  },
  modalText: {
    width: "80%",
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.lightPink,
    textAlign: "center",
    marginTop: 20
  },


}