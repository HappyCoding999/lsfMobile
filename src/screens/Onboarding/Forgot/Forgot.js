import React, { Component } from "react";
import { View, Image, Text, Dimensions, TextInput, TouchableHighlight, Alert } from "react-native";
import { color } from "../../../modules/styles/theme"
import firebase from "react-native-firebase"

const { height, width } = Dimensions.get('window');

export default class extends Component {
  constructor(props) {
    console.log(props)

    super(props);

    this.state = {
      emailValue: "",
    };
  }

  _onReset = (email) => {

    if (!email || email == undefined) return Alert.alert('Alert', 'Please enter a valid email.');

    firebase.auth().sendPasswordResetEmail(email)
      .then(function (user) {
        console.log(user)
        Alert.alert('Success', 'Please check your email...')
      }).catch(function (e) {
        console.log('error resetting email: ', e)
        Alert.alert("There is no corresponding user with this email, or you have may entered your email wrong. Please try again.")
      })

  }

  render() {

    var { emailValue } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, width: width, alignItems: 'center', flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.textBlock}>Please enter the email associated to your LSF account, and click Reset Password. In a few moments, you will receive an email that contains a link to reset your password.</Text>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.textInputStyle}
              placeholder={"Enter Email"}
              placeholderTextColor={"grey"}
              onChangeText={emailValue => { this.setState({ emailValue }) }}>{emailValue}</TextInput>
          </View>
          <View style={{height: 100}}>
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={() => this._onReset(emailValue)}
              underlayColor={'#ee90af'}>
              <Text allowFontScaling={false} style={styles.buttonText}>RESET PASSWORD</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: color.lightPink
  },
  sectionStyle: {
    height: 40,
    width: width * .84,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "#fff",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 20
  },
  textInputStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#fff",
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
    margin: 20

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
  textBlock: {
    width: "80%",
    height: 100,
    color: "grey",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: 14,
    margin: 20

  }

}


