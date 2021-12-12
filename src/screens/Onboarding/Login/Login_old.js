import React, { Component } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Alert
} from "react-native";
import { color } from "../../../modules/styles/theme";
import firebase from 'react-native-firebase'
import { AccessToken, LoginManager } from "react-native-fbsdk"
import { User } from "../../../DataStore";
import Analytics from 'appcenter-analytics';
import AppCenter from 'appcenter';

const { width, height } = Dimensions.get('window');

export default class Login extends Component {

  constructor(props) {

    super(props);

    this.onLogin = this.onLogin.bind(this);

    this.state = {
      emailValue: "",
      passwordValue: ""
    };
  }

  facebookLogin() {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          Alert.alert('Whoops!', 'You cancelled the sign in.');
          Analytics.trackEvent('Facebook login error: ', result);
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              const { accessToken } = data;
              const credential = firebase.auth.FacebookAuthProvider.credential(accessToken)

              fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
                .then((response) => response.json())
                .then((json) => {

                  const facebookUser = {
                    name: json.name,
                    email: json.email,
                    token: accessToken
                  }
                  return firebase.auth().signInWithCredential(credential)
                    .then(this._checkForOnBoardStatus)
                    .then(this._handleOnBoardStatus(facebookUser))
                }).catch(err => alert(err));
            })
            .catch((error) => {
              console.log(error)
              alert(error.message);
            })
        }
      }).catch((error) => {
        console.log(error.stack)
        alert(error.message);
      })

  }

  onLogin = () => {
    const { emailValue, passwordValue } = this.state;

    if (emailValue.length === 0 || passwordValue.length === 0) {
      return Alert.alert("Email and password required.");
    }

    firebase.auth().signInWithEmailAndPassword(emailValue.trim(), passwordValue)
      .then(this._checkForOnBoardStatus)
      .then(this._handleOnBoardStatus(null))
      .catch(error => {
        const { code, message } = error;
        console.log(code, message)
        Alert.alert("An error occured.", message);
        Analytics.trackEvent('Firebase sign-in error: ', message);

        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  }

  _checkForOnBoardStatus = () => {
    const id = firebase.auth().currentUser.uid;
    return User.findById(id)
      .then(user => {
        if (user && user.onBoarded) {

          // set logged in user id for app center tracking
          AppCenter.setUserId(id);
          return true;
        }

        return false;
      })
      .catch(err => Promise.reject(err));
  };

  _handleOnBoardStatus = facebookUser => isOnBoarded => {
    const { onLoginSuccess } = this.props;
    const { emailValue, passwordValue } = this.state;
    let passedParams;

    if (isOnBoarded) {
      return onLoginSuccess();
    }

    if (facebookUser) {
      passedParams = {
        email: facebookUser.email,
        facebookUser,
        authorizedUser: true
      };
    } else {
      passedParams = {
        email: emailValue,
        password: passwordValue,
        authorizedUser: true
      }
    }

    return firebase.auth().signOut().then(() => {
      this.props.navigation.navigate("OnboardingForms", passedParams);
    }).catch(err => Promise.reject(err));
  };

  render() {

    const { emailValue, passwordValue } = this.state

    return (
      <ScrollView contentContainerStyle={{ width: width, flex: 1 }}>
        <ImageBackground
          style={{ width: width, height: height, resizeMode: 'contain' }}
          source={require("./images/log-in.png")}>
          <View style={{ alignItems: "center", marginTop: height * .40 }}>
            <View style={styles.sectionStyle}>
              <Image style={styles.imageStyle} source={require('./images/person.png')} />
              <TextInput
                style={styles.textInputStyle}
                placeholder={"Email"}
                placeholderTextColor={"#fff"}
                onChangeText={emailValue => { this.setState({ emailValue }) }}>{emailValue}</TextInput>
            </View>
            <View style={styles.sectionStyle}>
              <Image style={styles.imageStyle} source={require('./images/lock.png')} />
              <TextInput
                style={styles.textInputStyle}
                placeholder={"Password"}
                placeholderTextColor={"#fff"}
                secureTextEntry={true}
                onChangeText={passwordValue => { this.setState({ passwordValue }) }}>{passwordValue}</TextInput>
            </View>
            <Text allowFontScaling={false} style={styles.forgotText}><Text allowFontScaling={false} style={{ textDecorationLine: "underline" }} onPress={() => this.props.navigation.navigate("Forgot")}>Forgot your password?</Text></Text>
            <View style={{ marginTop: 48 }}>
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={this.onLogin}
                underlayColor={'#ee90af'}>
                <Text allowFontScaling={false} style={styles.buttonText}>LOG IN</Text>
              </TouchableHighlight>
            </View>
            <Text allowFontScaling={false} style={styles.connectText}>Or, connect with:</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: width, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => this.facebookLogin()}>
                <View style={{ width: 315, height: 48, borderColor: "white", borderWidth: 2, borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                  <Image source={require('./images/iconFacebook.png')} />
                  <Text allowFontScaling={false} style={styles.smallButtonText}>FACEBOOK</Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity>
                        <View style={{width: 150, height: 48, borderColor: "white", borderWidth:2,  borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                            <Image source={require('./images/iconInstagram.png')}/>
                            <Text allowFontScaling={false} style={styles.smallButtonText}>INSTAGRAM</Text>
                        </View>
                    </TouchableOpacity> */}
            </View>
            <Text allowFontScaling={false} style={styles.loginText}>New to Love Sweat Fitness? <Text allowFontScaling={false} style={{ textDecorationLine: "underline" }} onPress={() => this.props.navigation.navigate("SignUp")}>Sign Up</Text></Text>
          </View>

        </ImageBackground>
      </ScrollView>
    );
  }

}

const styles = {
  connectText: {
    width: 110,
    height: 22,
    fontFamily: "SF Pro Text",
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
    fontFamily: "SF Pro Text",
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
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff",
    textAlign: "center",
    top: height - (height * .94)
  },
  forgotText: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 10
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
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#ffffff"
  },
  textInputStyle: {
    flex: 1,
    fontFamily: "SF Pro Text",
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
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  }
}

