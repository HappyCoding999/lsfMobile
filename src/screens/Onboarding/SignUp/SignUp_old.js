import React, { Component } from "react";
import { View, ImageBackground, Image, Text, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, TouchableHighlight, Alert } from "react-native";
import { color } from "../../../modules/styles/theme";
import firebase from "react-native-firebase"
import { AccessToken, LoginManager } from "react-native-fbsdk"


const { width, height } = Dimensions.get('window');


export default class SignUp extends Component {

  constructor(props) {
    super(props);

    this.onSignUpButtonPressed = this.onSignUpButtonPressed.bind(this)

    this.state = {
      emailValue: "",
      passwordValue: "",
      loading: false
    };
  }

  facbookLogin() {

    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          Alert.alert('Whoops!', 'You cancelled the sign in.');
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {

              console.log(data)

              const { accessToken } = data
              fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
                .then((response) => response.json())
                .then((json) => {

                  console.log(json)

                  var user = {
                    name: json.name,
                    email: json.email,
                    token: accessToken
                  }

                  this._checkIfUserExists(user.email)
                    .then(this._navigateToSignupForm(user.email, null, user));

                  // this.props.navigation.navigate("OnboardingForms", { email: json.email, facebookUser: user })
                })
                .catch(() => {
                  reject('ERROR GETTING DATA FROM FACEBOOK')
                })
            }).catch((err) => { console.log(err.stack) })
        }
      }).catch((err) => { console.log(err.stack) })

  }

  onSignUpButtonPressed = () => {
    const { emailValue, passwordValue } = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;

    if (reg.test(emailValue) == false) {
      Alert.alert("Please enter valid email.");
    } else {
      if (emailValue == '' || passwordValue == '') {
        Alert.alert("Please Enter All the Values.");
      } else {
        this.setState({ loading: true });
        this._checkIfUserExists(emailValue)
          .then(this._navigateToSignupForm(emailValue, passwordValue));
      }
    }
  }

  _checkIfUserExists(email) {
    return firebase.auth().fetchSignInMethodsForEmail(email)
      .then(result => {

        if (result.length > 0) {
          return true;
        } else {
          return false
        }
      })
      .catch(err => {window.alert(err); console.log(err);console.log(err.message);this.setState({ loading: false });});
  }

  _navigateToSignupForm = (email, password, facebookUser) => userAlreadyExists => {
    if (userAlreadyExists !== undefined) 
    {
      if (userAlreadyExists) {
        this.setState({ loading: false }, () => Alert.alert("Email already in use."));
      } else {
        this.setState({ loading: false }, () => this.props.navigation.navigate("OnboardingForms", { email, password, facebookUser }));
      }      
    }
  }

  render() {

    const { emailValue, passwordValue, loading } = this.state

    return (
      <View style={{ width: width }}>
        <ImageBackground
          style={{ width: width, height: height, resizeMode: 'contain' }}
          source={require("./images/sign-up.png")}>
          <View style={{ alignItems: "center", marginTop: height * .40 }}>
            <View style={styles.sectionStyle}>
              <Image style={styles.imageStyle} source={require('./images/person.png')} />
              <TextInput
                style={styles.textInputStyle}
                placeholder={"Email"}
                placeholderTextColor={"#fff"}
                onChangeText={(emailValue) => {this.setState({ emailValue: emailValue.trim() }) }}>
                {emailValue}
              </TextInput>
            </View>
            <View style={styles.sectionStyle}>
              <Image style={styles.imageStyle} source={require('./images/lock.png')} />
              <TextInput
                style={styles.textInputStyle}
                placeholder={"Password"}
                placeholderTextColor={"#fff"}
                secureTextEntry={true}
                onChangeText={(passwordValue) => { this.setState({ passwordValue }) }}>{passwordValue}</TextInput>
            </View>
            <View style={{ marginTop: 48 }}>
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={this.onSignUpButtonPressed}
                underlayColor={'#ee90af'}>
                {loading ?
                  <ActivityIndicator
                    animating={true}
                    color="white"
                    size="small"
                  />
                  :
                  <Text allowFontScaling={false} style={styles.buttonText}>SIGN UP</Text>
                }
              </TouchableHighlight>
            </View>
            <Text allowFontScaling={false} style={styles.connectText}>Or, connect with:</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: width, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => this.facbookLogin()}>
                <View style={{ width: 315, height: 48, borderColor: "white", borderWidth: 2, borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                  <Image source={require('./images/iconFacebook.png')} />
                  <Text allowFontScaling={false} style={styles.smallButtonText}>FACEBOOK</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text allowFontScaling={false} style={styles.loginText}>Already a member? <Text allowFontScaling={false} style={{ textDecorationLine: "underline" }} onPress={() => this.props.navigation.navigate("Login")}>Log In</Text></Text>
          </View>

        </ImageBackground>
      </View>
    );
  }

}

const styles = {
  connectText: {
    width: 110,
    height: 22,
    fontFamily: "Sofia Pro",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff",
    marginTop: 15
  },
  smallButtonText: {
    width: 105,
    height: 20,
    fontFamily: "Sofia Pro",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  loginText: {
    width: "100%",
    height: 22,
    fontFamily: "Sofia Pro",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff",
    textAlign: "center",
    top: height - (height * .94)

  },
  sectionStyle: {
    height: 40,
    width: width * .84,
    marginTop: height * .034,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "#fff",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'center',
    alignItems: 'center',
  },
  textStyle: {
    width: "100%",
    height: 22,
    fontFamily: "Sofia Pro",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff"
  },
  textInputStyle: {
    flex: 1,
    fontFamily: "Sofia Pro",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#ffffff"
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
    fontFamily: "Sofia Pro",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  }

}