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
  Platform,
  TouchableHighlight,
  Alert,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import firebase from "react-native-firebase";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";
import { User } from "../../../DataStore";
import Analytics from "appcenter-analytics";
import AppCenter from "appcenter";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  appleAuthAndroid,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import jwt_decode from "jwt-decode";
import { v4 as uuid } from "uuid";

// import { AppleButton, appleAuthAndroid, appleAuth } from '@invertase/react-native-apple-authentication';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get("window");

// const doAppleLogin = async () => {
//     // Generate secure, random values for state and nonce

//     console.log("doAppleLogin called");

//     const rawNonce = uuidv4();
//     const state = uuidv4();
//     // const rawNonce = "1234";
//     // const state = "1234";

//     try {
//       // Initialize the module
//       appleAuthAndroid.configure({
//         // The Service ID you registered with Apple
//         clientId: "org.reactjs.native.example.lsfmobile-androidAppleLogin",

//         // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
//         // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
//         redirectUri: "https://lovesweatfitness.com/auth/callback",

//         // [OPTIONAL]
//         // Scope.ALL (DEFAULT) = 'email name'
//         // Scope.Email = 'email';
//         // Scope.Name = 'name';
//         scope: appleAuthAndroid.Scope.ALL,

//         // [OPTIONAL]
//         // ResponseType.ALL (DEFAULT) = 'code id_token';
//         // ResponseType.CODE = 'code';
//         // ResponseType.ID_TOKEN = 'id_token';
//         responseType: appleAuthAndroid.ResponseType.ALL,

//         // [OPTIONAL]
//         // A String value used to associate a client session with an ID token and mitigate replay attacks.
//         // This value will be SHA256 hashed by the library before being sent to Apple.
//         // This is required if you intend to use Firebase to sign in with this credential.
//         // Supply the response.id_token and rawNonce to Firebase OAuthProvider
//         nonce: rawNonce,

//         // [OPTIONAL]
//         // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
//         state,
//       });

//       const response = await appleAuthAndroid.signIn();
//       if (response) {
//         const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
//         const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN
//         const user = response.user; // Present when user first logs in using appleId
//         const state = response.state; // A copy of the state value that was passed to the initial request.
//         console.log("Got auth code", code);
//         console.log("Got id_token", id_token);
//         console.log("Got user", user);
//         console.log("Got state", state);
//       }
//     } catch (error) {
//       if (error && error.message) {
//         switch (error.message) {
//           case appleAuthAndroid.Error.NOT_CONFIGURED:
//             console.log("appleAuthAndroid not configured yet.");
//             break;
//           case appleAuthAndroid.Error.SIGNIN_FAILED:
//             console.log("Apple signin failed.");
//             break;
//           case appleAuthAndroid.Error.SIGNIN_CANCELLED:
//             console.log("User cancelled Apple signin.");
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   };

// async function onAppleButtonPress() {
//   // performs login request
//   const appleAuthRequestResponse = await appleAuth.performRequest({
//     requestedOperation: appleAuth.Operation.LOGIN,
//     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
//   });

//   // get current authentication state for user
//   // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
//   const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

//   // use credentialState response to ensure the user is authenticated
//   if (credentialState === appleAuth.State.AUTHORIZED) {
//     console.log("onAppleButtonPress AUTHORIZED")
//       console.log(appleAuthRequestResponse.user)
//     // user is authenticated
//   }
//   else
//   {
//     console.log("onAppleButtonPress UNAUTHORIZED")
//   }
// }
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.authCredentialListener = null;
    this.user = null;
    this.onLogin = this.onLogin.bind(this);
    this.onShow = this.onShow.bind(this);

    this.state = {
      emailValue: "",
      passwordValue: "",
      credentialStateForUser: -1,
      isSecure: true,
    };
  }
  componentDidMount() {
    this.configureGoogleSignIn();

    // Clear Social Access
    this.clearGoogleLogin();
    this.clearFacebookLogin();
    this.clearAppleLogin();
    // if (appleAuth.isSupported) {
    //       /**
    //  * subscribe to credential updates.This returns a function which can be used to remove the event listener
    //  * when the component unmounts.
    //  */
    // this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
    //   console.warn('Credential Revoked');
    //   this.fetchAndUpdateCredentialState().catch(error =>
    //     this.setState({ credentialStateForUser: `Error: ${error.code}` }),
    //   );
    // });
    // this.fetchAndUpdateCredentialState()
    //   .then(res => this.setState({ credentialStateForUser: res }))
    //   .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
    // }
  }

  configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "34610947007-lkc5lpsf32q71bpnjsc8o2cki1j690l8.apps.googleusercontent.com",
    });
  };

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    // if (appleAuth.isSupported) {
    //   this.authCredentialListener();
    // }
  }

  getRandomString = (length) => {
    let randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  };

  appleLogin = async () => {
    if (Platform.OS === "android") {
      try {
        // const rawNonce = this.getRandomString(20);
        // const state = this.getRandomString(20);
        const rawNonce = uuid();
        const state = uuid();

        appleAuthAndroid.configure({
          clientId: "com.lsf.signin",
          redirectUri:
            "https://lsf-development.firebaseapp.com/__/auth/handler",
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });

        const response = await appleAuthAndroid.signIn();

        if (response) {
          const { code, id_token, nonce, user, state } = response;

          var decoded_token = jwt_decode(id_token);

          var email = decoded_token["email"];
          var f_name = "";
          var l_name = "";

          if (user) {
            f_name = user["name"]["firstName"];
            l_name = user["name"]["lastName"];

            if (f_name === undefined || f_name === null) {
              f_name = "";
            }
            if (l_name === undefined || l_name === null) {
              l_name = "";
            }
          }

          // Alert.alert(
          //   "credential: ",
          //   rawNonce + "\n\n" + nonce
          // );

          // const credential = firebase.auth.AppleAuthProvider.credential(
          //   id_token,
          //   rawNonce
          // );
          const credential = firebase.auth.AppleAuthProvider.credential(
            id_token,
            rawNonce
          );

          const appleUser = {
            name: f_name.trim() + " " + l_name.trim(),
            firstName: f_name,
            lastName: l_name,
            email: email,
            token: id_token,
            type: "apple",
          };
          return firebase
            .auth()
            .signInWithCredential(credential)
            .then(this._checkForOnBoardStatus)
            .then(this._handleOnBoardStatus(appleUser))
            .catch((error) => {
              const { code, message } = error;
              console.log(code, message);
              Alert.alert("An error occured.", code + "\n" + message);
              Analytics.trackEvent("Firebase apple sign-in error: ", message);
            });
        }
      } catch (error) {
        console.log("Apple Resp: ERROR: ", error.toString());
        if (error && error.message) {
          switch (error.message) {
            case appleAuthAndroid.Error.NOT_CONFIGURED:
              Alert.alert(
                "Apple Sign-in",
                "appleAuthAndroid not configured yet."
              );
              break;
            case appleAuthAndroid.Error.SIGNIN_FAILED:
              Alert.alert("Apple Sign-in", "Apple signin failed.");
              break;
            case appleAuthAndroid.Error.SIGNIN_CANCELLED:
              Alert.alert("Apple Sign-in", "You cancelled Apple signin.");
              break;
            default:
              Alert.alert("Apple Sign-in", error.toString());
              break;
          }
        }
      }
    } else {
      if (appleAuth.isSupported == false) {
        Alert.alert(
          "Whoops!",
          "Apple Authentication is not supported on this device. Currently Apple Authentication works on iOS devices running iOS 13 or later."
        );
        return;
      }
      // start a login request
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // console.log("appleAuthRequestResponse", appleAuthRequestResponse);

        const {
          user: newUser,
          email,
          nonce,
          identityToken,
          realUserStatus,
          fullName,
        } = appleAuthRequestResponse;

        // this.user = newUser;

        // this.fetchAndUpdateCredentialState()
        //   .then((res) => this.setState({ credentialStateForUser: res }))
        //   .catch((error) =>
        //     this.setState({ credentialStateForUser: `Error: ${error.code}` })
        //   );

        if (identityToken) {
          // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
          // console.log(nonce, identityToken);

          var em = email;

          if (email === undefined || email === null || email.trim() === "") {
            var decoded_token = jwt_decode(identityToken);
            em = decoded_token["email"];
          }

          var f_name = fullName.givenName;
          var l_name = fullName.familyName;

          if (f_name === undefined || f_name === null) {
            f_name = "";
          }
          if (l_name === undefined || l_name === null) {
            l_name = "";
          }

          const credential = firebase.auth.AppleAuthProvider.credential(
            identityToken,
            nonce
          );

          const appleUser = {
            name: f_name.trim() + " " + l_name.trim(),
            firstName: f_name,
            lastName: l_name,
            email: em,
            token: identityToken,
            type: "apple",
          };
          return firebase
            .auth()
            .signInWithCredential(credential)
            .then(this._checkForOnBoardStatus)
            .then(this._handleOnBoardStatus(appleUser))
            .catch((error) => {
              const { code, message } = error;
              console.log(code, message);
              Alert.alert("An error occured.", message);
              Analytics.trackEvent("Firebase apple sign-in error: ", message);
            });
        } else {
          // no token - failed sign-in?
          Alert.alert("Apple Sign-in Failed");
        }

        // if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        //   console.log("I'm a real person!");
        // }

        // console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
      } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
          console.warn("User canceled Apple Sign in.");
        } else {
          console.error(error);
        }
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({ credentialStateForUser: "N/A" });
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(
        this.user
      );
      if (credentialState === appleAuth.State.AUTHORIZED) {
        this.setState({ credentialStateForUser: "AUTHORIZED" });
      } else {
        this.setState({ credentialStateForUser: credentialState });
      }
    }
  };
  googleLogin = async () => {
    // try {
    await GoogleSignin.hasPlayServices();
    const siginInData = await GoogleSignin.signIn();
    if (siginInData !== undefined) {
      let userData = siginInData.user;

      const credential = firebase.auth.GoogleAuthProvider.credential(
        siginInData.idToken
      );

      const googleUser = {
        name: userData.name,
        firstName: userData.givenName,
        lastName: userData.familyName,
        email: userData.email,
        token: siginInData.idToken,
        type: "google",
      };
      return firebase
        .auth()
        .signInWithCredential(credential)
        .then(this._checkForOnBoardStatus)
        .then(this._handleOnBoardStatus(googleUser));
    } else {
      alert("no response=>>>");
    }
  };
  facebookLogin() {
    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then((result) => {
        if (result.isCancelled) {
          Alert.alert("Whoops!", "You cancelled the sign in.");
          Analytics.trackEvent("Facebook login error: ", result);
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              const { accessToken } = data;
              const credential =
                firebase.auth.FacebookAuthProvider.credential(accessToken);

              fetch(
                "https://graph.facebook.com/v9.0/me?fields=email,name,first_name,last_name,friends&access_token=" +
                  accessToken
              )
                .then((response) => response.json())
                .then((json) => {
                  console.log(json);
                  const facebookUser = {
                    name: json.name,
                    firstName: json.first_name,
                    lastName: json.last_name,
                    email: json.email,
                    token: accessToken,
                    type: "facebook",
                  };
                  return firebase
                    .auth()
                    .signInWithCredential(credential)
                    .then(this._checkForOnBoardStatus)
                    .then(this._handleOnBoardStatus(facebookUser));
                })
                .catch((err) => alert("1. " + err));
            })
            .catch((error) => {
              console.log(error);
              alert("2. " + error.message);
            });
        }
      })
      .catch((error) => {
        console.log(error.stack);
        alert("3. " + error.message);
      });
  }
  onShow = () => {
    const { isSecure } = this.state;
    this.setState({
      isSecure: !isSecure,
    });
  };

  clearGoogleLogin = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (err) {
      console.log(err);
    }
  };
  clearFacebookLogin = async () => {
    try {
      var current_access_token = "";
      AccessToken.getCurrentAccessToken()
        .then((data) => {
          current_access_token = data.accessToken.toString();
        })
        .then(async () => {
          let logout = new GraphRequest(
            "me/permissions/",
            {
              accessToken: current_access_token,
              httpMethod: "DELETE",
            },
            async (error, result) => {
              if (error) {
                console.log("Error fetching data: " + error.toString());
              } else {
                await LoginManager.logOut();
              }
            }
          );
          await new GraphRequestManager().addRequest(logout).start();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };
  clearAppleLogin = async () => {
    try {
      appleAuth.onCredentialRevoked(async () => {
        console.log(
          "If this function executes, User Credentials have been Revoked"
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  onLogin = () => {
    const { emailValue, passwordValue } = this.state;

    if (emailValue.trim().length === 0 || passwordValue.length === 0) {
      return Alert.alert("Email and password required.");
    }
    console.log(emailValue.trim());
    console.log(passwordValue);

    firebase
      .auth()
      .signInWithEmailAndPassword(emailValue.trim(), passwordValue)
      .then(this._checkForOnBoardStatus)
      .then(this._handleOnBoardStatus(null))
      .catch((error) => {
        const { code, message } = error;
        console.log(code, message);
        Alert.alert("An error occured.", message);
        Analytics.trackEvent("Firebase sign-in error: ", message);

        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  };

  _checkForOnBoardStatus = () => {
    const id = firebase.auth().currentUser.uid;
    return User.findById(id)
      .then((user) => {
        if (user && user.onBoarded) {
          // set logged in user id for app center tracking
          AppCenter.setUserId(id);
          return true;
        }

        return false;
      })
      .catch((err) => Promise.reject(err));
  };

  _handleOnBoardStatus = (data) => (isOnBoarded) => {
    const { onLoginSuccess } = this.props;
    const { emailValue, passwordValue } = this.state;
    let passedParams;

    if (isOnBoarded) {
      return onLoginSuccess();
    }

    if (data) {
      passedParams = {
        email: data.email,
        data,
        authorizedUser: true,
      };
    } else {
      passedParams = {
        email: emailValue,
        password: passwordValue,
        authorizedUser: true,
      };
    }

    return firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("OnboardingForms", passedParams);
      })
      .catch((err) => Promise.reject(err));
  };

  addShadow(elevation) {
    return {
      elevation,
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 1,
      shadowRadius: 1 * elevation,
      backgroundColor: "white",
    };
  }
  renderAppleButton() {
    return (
      <View style={{ marginTop: 5, width: width }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: width,
            marginTop: 8,
          }}
        >
          <TouchableOpacity onPress={() => this.appleLogin()}>
            <View
              style={[
                this.addShadow(7),
                {
                  width: width * 0.8,
                  height: 48,
                  borderColor: "#000",
                  borderWidth: 2,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: 15,
                  backgroundColor: "#000",
                },
              ]}
            >
              <View
                style={{
                  width: "25%",
                  height: "100%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <Image
                  source={require("./images/Apple_White_Logo.png")}
                  style={{ tintColor: "#fff", width: "100%", height: "100%" }}
                />
              </View>
              <View
                style={{
                  width: "75%",
                  height: "100%",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.smallButtonText,
                    marginLeft: -10,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Sign in with Apple
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    const { emailValue, passwordValue, isSecure } = this.state;
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];

    return (
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ width: width }}
      >
        {/*<ImageBackground
          style={{ width: width, height: height, resizeMode: 'contain' }}
          source={require("./images/log-in.png")}>*/}
        <View
          style={{ alignItems: "center", flex: 1, backgroundColor: "#fff" }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: height * 0.45,
            }}
          >
            <Image
              style={{
                marginTop: 50,
                width: 95,
                height: 95,
                resizeMode: "center",
              }}
              source={require("./images/pink_heart_loginback.png")}
            />
            <Text allowFontScaling={false} style={styles.primaryText}>
              Welcome back!
            </Text>
            <Text allowFontScaling={false} style={styles.textBlock}>
              Log back into your account
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={styles.sectionStyle}>
              <Image
                style={styles.imageStyle}
                source={require("./images/email_pink.png")}
              />
              <TextInput
                style={styles.textInputStyle}
                placeholder={"Email"}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(emailValue) => {
                  this.setState({ emailValue });
                }}
              >
                {emailValue}
              </TextInput>
            </View>
            <View style={styles.sectionStyle}>
              <Image
                style={styles.imageStyle}
                source={require("./images/lock_pink.png")}
              />
              <TextInput
                style={styles.textInputStyle}
                placeholder={"Password"}
                placeholderTextColor={color.mediumGrey}
                secureTextEntry={isSecure}
                onChangeText={(passwordValue) => {
                  this.setState({ passwordValue });
                }}
              >
                {passwordValue}
              </TextInput>
              <TouchableOpacity onPress={this.onShow}>
                <Text allowFontScaling={false} style={styles.showButtonStyle}>
                  show
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 48 }}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={colors}
                style={styles.linearGradient}
              >
                <TouchableHighlight
                  style={styles.buttonStyle}
                  onPress={this.onLogin}
                  underlayColor={"#ee90af"}
                >
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    LOG IN
                  </Text>
                </TouchableHighlight>
              </LinearGradient>
            </View>
            <Text allowFontScaling={false} style={styles.forgotText}>
              <Text
                allowFontScaling={false}
                onPress={() => this.props.navigation.navigate("Forgot")}
              >
                Forgot password?
              </Text>
            </Text>
            {/*<Text allowFontScaling={false} style={styles.connectText}>Or, connect with:</Text>*/}
            {this.renderAppleButton()}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: width,
                marginTop: 15,
              }}
            >
              <TouchableOpacity onPress={() => this.facebookLogin()}>
                <View
                  style={[
                    this.addShadow(7),
                    {
                      width: width * 0.8,
                      height: 48,
                      borderColor: "#3B5998",
                      borderWidth: 2,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      backgroundColor: "#3B5998",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: "25%",
                      height: "100%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={require("./images/f_logo_White.png")}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <View
                    style={{
                      width: "75%",
                      height: "100%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{ ...styles.smallButtonText, marginLeft: -10 }}
                    >
                      Login with Facebook
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/*<TouchableOpacity>
                <View style={{width: 150, height: 48, borderColor: "white", borderWidth:2,  borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                    <Image source={require('./images/iconInstagram.png')}/>
                    <Text allowFontScaling={false} style={styles.smallButtonText}>INSTAGRAM</Text>
                </View>
            </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: width,
                marginTop: 15,
              }}
            >
              <TouchableOpacity onPress={() => this.googleLogin()}>
                <View
                  style={[
                    this.addShadow(7),
                    {
                      width: width * 0.8,
                      height: 48,
                      borderColor: "#E43E2B",
                      borderWidth: 2,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      backgroundColor: "#E43E2B",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: "25%",
                      height: "100%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={require("./images/google_sign_in.png")}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <View
                    style={{
                      width: "75%",
                      height: "100%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{ ...styles.smallButtonText, marginLeft: -10 }}
                    >
                      Login with Google
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/*<TouchableOpacity>
                <View style={{width: 150, height: 48, borderColor: "white", borderWidth:2,  borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                    <Image source={require('./images/iconInstagram.png')}/>
                    <Text allowFontScaling={false} style={styles.smallButtonText}>INSTAGRAM</Text>
                </View>
            </TouchableOpacity> */}
            </View>
            <Text allowFontScaling={false} style={styles.loginText}>
              Don't have an account?{" "}
              <Text
                allowFontScaling={false}
                style={styles.loginTextBold}
                onPress={() => this.props.navigation.navigate("SignUp")}
              >
                Sign Up!
              </Text>
            </Text>
          </View>
        </View>
        {/*</ImageBackground>*/}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  primaryText: {
    width: width * 0.9,
    height: 38,
    fontFamily: "SF Pro Text",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: colorNew.textPink,
  },
  textBlock: {
    width: width * 0.9,
    height: 20,
    color: "#000",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: 14,
    textAlign: "center",
  },
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
    marginTop: 15,
  },
  smallButtonText: {
    width: 200,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  loginTextBold: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#000",
    textAlign: "center",
    top: height - height * 0.92,
  },
  loginText: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#000",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    top: height - height * 0.98,
  },
  forgotText: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  sectionStyle: {
    height: 40,
    width: width * 0.84,
    marginTop: height * 0.034,
    marginBottom: 10,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: color.lightGrey,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "center",
    alignItems: "center",
  },
  showButtonStyle: {
    margin: 5,
    textAlign: "right",
    height: 22,
    width: 90,
    alignItems: "center",
    color: color.mediumGrey,
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
    color: "#ffffff",
  },
  textInputStyle: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000",
  },
  linearGradient: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: "color.mediumPink",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
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
    color: "#ffffff",
  },
};
