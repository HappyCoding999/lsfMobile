import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  Alert,
  Linking,
  ScrollView,
  Platform,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import firebase from "react-native-firebase";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";
import LinearGradient from "react-native-linear-gradient";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");
import {
  appleAuthAndroid,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import jwt_decode from "jwt-decode";
// import { AppleButton, appleAuthAndroid, appleAuth } from '@invertase/react-native-apple-authentication';
// import { v4 as uuidv4 } from 'uuid';

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

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.onSignUpButtonPressed = this.onSignUpButtonPressed.bind(this);
    this.authCredentialListener = null;
    this.user = null;

    this.state = {
      emailValue: "",
      passwordValue: "",
      nameValue: "",
      lastnameValue: "",
      isTermsSelected: false,
      credentialStateForUser: -1,
      loading: false,
    };
  }
  termsClick() {
    console.log("termsClick");
    let isTermsSelected = !this.state.isTermsSelected;
    this.setState({ isTermsSelected: isTermsSelected });
  }

  componentDidMount() {
    this.configureGoogleSignIn();
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

  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    // if (appleAuth.isSupported) {
    //   this.authCredentialListener();
    // }
  }
  signIn = async () => {
    // console.warn('Beginning Apple Authentication');
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

      console.log("appleAuthRequestResponse", appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      this.user = newUser;

      this.fetchAndUpdateCredentialState()
        .then((res) => this.setState({ credentialStateForUser: res }))
        .catch((error) =>
          this.setState({ credentialStateForUser: `Error: ${error.code}` })
        );

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }

      console.warn(`Apple Authentication Completed, ${this.user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn("User canceled Apple Sign in.");
      } else {
        console.error(error);
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
  facebookLogin() {
    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then((result) => {
        if (result.isCancelled) {
          Alert.alert("Whoops!", "You cancelled the sign in.");
        } else {
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              console.log(data);

              const { accessToken } = data;
              fetch(
                "https://graph.facebook.com/v9.0/me?fields=email,name,first_name,last_name,friends&access_token=" +
                  accessToken
              )
                .then((response) => response.json())
                .then((json) => {
                  console.log(json);

                  var user = {
                    name: json.name,
                    firstName: json.first_name,
                    lastName: json.last_name,
                    email: json.email,
                    token: accessToken,
                    type: "facebook",
                  };

                  this._checkIfUserExists(user.email).then(
                    this._navigateToSignupForm(
                      user.email,
                      null,
                      user,
                      json.first_name,
                      json.last_name
                    )
                  );

                  // this.props.navigation.navigate("OnboardingForms", { email: json.email, facebookUser: user })
                })
                .catch(() => {
                  reject("ERROR GETTING DATA FROM FACEBOOK");
                });
            })
            .catch((err) => {
              console.log(err.stack);
            });
        }
      })
      .catch((err) => {
        console.log(err.stack);
      });
  }
  configureGoogleSignIn = () => {
    try {
      GoogleSignin.configure({
        webClientId:
          "34610947007-lkc5lpsf32q71bpnjsc8o2cki1j690l8.apps.googleusercontent.com",
      });
    } catch (ex) {}
  };
  googleLogin = async () => {
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
      this._checkIfUserExists(userData.email).then(
        this._navigateToSignupForm(
          userData.email,
          null,
          googleUser,
          userData.givenName,
          userData.familyName
        )
      );
    } else {
      alert("no response=>>>");
    }
  };
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
        const rawNonce = this.getRandomString(20);
        const state = this.getRandomString(20);

        appleAuthAndroid.configure({
          // clientId: "org.reactjs.native.example.lsfmobile-androidAppleLogin",
          clientId: "com.lsfmobile",
          // redirectUri: "https://lovesweatfitness.com/auth/callback",
          redirectUri:
            "https://lsf-development.firebaseapp.com/__/auth/handler",
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });

        const response = await appleAuthAndroid.signIn();

        if (response) {
          // const code = response.code;
          const id_token = response.id_token;
          const user = response.user;

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

          const appleUser = {
            name: f_name.trim() + " " + l_name.trim(),
            firstName: f_name,
            lastName: l_name,
            email: email,
            token: id_token,
            type: "apple",
          };

          this._checkIfUserExists(email).then(
            this._navigateToSignupForm(
              email,
              null,
              appleUser,
              f_name.trim(),
              l_name.trim()
            )
          );
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

          const appleUser = {
            name: f_name.trim() + " " + l_name.trim(),
            firstName: f_name,
            lastName: l_name,
            email: em,
            token: identityToken,
            type: "apple",
          };

          this._checkIfUserExists(em).then(
            this._navigateToSignupForm(
              em,
              null,
              appleUser,
              f_name.trim(),
              l_name.trim()
            )
          );
        } else {
          // no token - failed sign-in?
          Alert.alert("Apple Sign-in Failed");
        }

        // if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        //   console.log("I'm a real person!");
        // }

        console.warn(`Apple Authentication Completed, ${this.user}, ${em}`);
      } catch (error) {
        if (error.code === appleAuth.Error.CANCELED) {
          console.warn("User canceled Apple Sign in.");
        } else {
          console.error(error);
        }
      }
    }
  };
  onSignUpButtonPressed = () => {
    const { emailValue, passwordValue, nameValue, lastnameValue } = this.state;
    // const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (
      emailValue.trim() == "" ||
      passwordValue == "" ||
      nameValue.trim() == "" ||
      lastnameValue.trim() == ""
    ) {
      Alert.alert("Please Enter All the Values.");
    } else if (reg.test(emailValue.trim()) == false) {
      Alert.alert("Please enter valid email.");
    } else {
      if (this.state.isTermsSelected == false) {
        Alert.alert("Please agree to the terms of service and privacy policy.");
      } else {
        this.setState({ loading: true });
        this._checkIfUserExists(emailValue.trim()).then(
          this._navigateToSignupForm(
            emailValue.trim(),
            passwordValue,
            null,
            nameValue.trim(),
            lastnameValue.trim()
          )
        );
      }
    }
  };
  clearGoogleLogin = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
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
  _checkIfUserExists(email) {
    if (email === undefined || email === null || email === "") {
      Alert.alert("Error", "No email passed");
      this.setState({ loading: false });
      return false;
    } else {
      return firebase
        .auth()
        .fetchSignInMethodsForEmail(email)
        .then((result) => {
          if (result.length > 0) {
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          window.alert(err);
          console.log(err);
          console.log(err.message);
          this.setState({ loading: false });
        });
    }
  }

  _navigateToSignupForm =
    (email, password, data, name, lastname) => (userAlreadyExists) => {
      if (userAlreadyExists !== undefined) {
        if (userAlreadyExists) {
          this.setState({ loading: false }, () => {
            this.clearGoogleLogin();
            this.clearAppleLogin();
            this.clearFacebookLogin();
            Alert.alert("Email already in use.");
          });
        } else {
          let passedParams;

          if (data) {
            passedParams = {
              email: email,
              data,
              // authorizedUser: true,
            };
          } else {
            passedParams = {
              email: emailValue,
              password: passwordValue,
              // authorizedUser: true,
            };
          }

          this.setState({ loading: false }, () => {
            // this.props.navigation.navigate("OnboardingForms", {
            //   email,
            //   password,
            //   data,
            //   name,
            //   lastname,
            // });
            this.props.navigation.navigate("OnboardingForms", passedParams);
          });
        }
      }
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
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: 15,
                  backgroundColor: "#fff",
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
                  style={{ tintColor: "#000", width: "100%", height: "100%" }}
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
                    marginLeft: -25,
                    textAlign: "center",
                    color: "#000",
                  }}
                >
                  Connect with Apple
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  render() {
    const { emailValue, passwordValue, loading, nameValue, lastnameValue } =
      this.state;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    return (
      <KeyboardAwareScrollView
        style={{ width: width, backgroundColor: color.mediumPink }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={colors}
          style={styles.linearGradient}
        >
          {/* <ImageBackground
            style={{ width: width, height: height, resizeMode: "contain" }}
          > */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              justifyContent: "flex-start",
              alignItems: "center",
              // width: width,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  height: height * 0.3,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    marginTop: "20%",
                    height: "80%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text allowFontScaling={false} style={styles.primaryText}>
                    Create
                  </Text>
                  <Text allowFontScaling={false} style={styles.primaryText}>
                    your account
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center", marginTop: 0 }}>
                <View style={styles.sectionStyle}>
                  <Image
                    style={styles.imageStyle}
                    source={require("./images/your_name_white_.png")}
                  />
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"First Name"}
                    placeholderTextColor={"#fff"}
                    onChangeText={(nameValue) => {
                      this.setState({ nameValue: nameValue });
                    }}
                  >
                    {nameValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <Image
                    style={styles.imageStyle}
                    source={require("./images/your_name_white_.png")}
                  />
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"Last Name"}
                    placeholderTextColor={"#fff"}
                    onChangeText={(lastnameValue) => {
                      this.setState({ lastnameValue: lastnameValue });
                    }}
                  >
                    {lastnameValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <Image
                    style={styles.imageStyle}
                    source={require("./images/mail_white_.png")}
                  />
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"Email"}
                    placeholderTextColor={"#fff"}
                    onChangeText={(emailValue) => {
                      this.setState({ emailValue: emailValue.trim() });
                    }}
                  >
                    {emailValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <Image
                    style={styles.imageStyle}
                    source={require("./images/password_white_.png")}
                  />
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"Password"}
                    placeholderTextColor={"#fff"}
                    secureTextEntry={true}
                    onChangeText={(passwordValue) => {
                      this.setState({ passwordValue });
                    }}
                  >
                    {passwordValue}
                  </TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: width,
                    marginTop: 8,
                  }}
                >
                  <View
                    style={{
                      width: width * 0.84,
                      height: 48,
                      alignItems: "flex-start",
                      justifyContent: "center",
                      flexDirection: "row",
                      marginTop: 10,
                      padding: 15,
                    }}
                  >
                    <TouchableOpacity onPress={() => this.termsClick()}>
                      <View
                        style={{
                          width: "15%",
                          height: "100%",
                          alignItems: "flex-start",
                          justifyContent: "center",
                        }}
                      >
                        {this.state.isTermsSelected ? (
                          <Image
                            style={styles.imageStyle}
                            source={require("./images/check_.png")}
                          />
                        ) : (
                          <Image
                            style={styles.imageStyle}
                            source={require("./images/uncheck_.png")}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <Text allowFontScaling={false} style={styles.termsText}>
                        by signing up you agree to our{" "}
                        <Text
                          allowFontScaling={false}
                          style={{ textDecorationLine: "underline" }}
                          onPress={() => {
                            Linking.openURL(
                              "https://lovesweatfitness.com/terms-conditions/"
                            );
                          }}
                        >
                          Terms and Conditions
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: 15 }}>
                  <TouchableHighlight
                    style={styles.buttonStyle}
                    onPress={this.onSignUpButtonPressed}
                    underlayColor={"#ffffff"}
                  >
                    {loading ? (
                      <ActivityIndicator
                        animating={true}
                        color="white"
                        size="small"
                      />
                    ) : (
                      <Text allowFontScaling={false} style={styles.buttonText}>
                        Create Account
                      </Text>
                    )}
                  </TouchableHighlight>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 20,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.smallButtonText,
                      color: "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    OR
                  </Text>
                </View>
                {this.renderAppleButton()}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: width,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity onPress={() => this.facebookLogin()}>
                    <View
                      style={[
                        this.addShadow(7),
                        {
                          width: width * 0.8,
                          height: 48,
                          borderColor: "white",
                          borderWidth: 2,
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          marginTop: 15,
                          backgroundColor: "#fff",
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
                          style={{
                            tintColor: "#3B5998",
                            width: "100%",
                            height: "100%",
                          }}
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
                            marginLeft: -25,
                            textAlign: "center",
                            color: "#3B5998",
                          }}
                        >
                          Connect with Facebook
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: width,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity onPress={() => this.googleLogin()}>
                    <View
                      style={[
                        this.addShadow(7),
                        {
                          width: width * 0.8,
                          height: 48,
                          borderColor: "white",
                          borderWidth: 2,
                          borderRadius: 24,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          marginTop: 15,
                          backgroundColor: "#fff",
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
                          source={require("./images/google_logo.png")}
                          style={{
                            // tintColor: "#3B5998",
                            width: "100%",
                            height: "100%",
                          }}
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
                            marginLeft: -25,
                            textAlign: "center",
                            color: "#E43E2B",
                          }}
                        >
                          Connect with Google
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {/*<View style={{ flexDirection: "row", justifyContent: "space-evenly", width: width, marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => this.googleLogin()}>
                  <View style={{ width: width * 0.8, height: 48, borderColor: "white", borderWidth: 2, borderRadius: 24, alignItems: "center", justifyContent: "center", flexDirection: "row", marginTop:15,backgroundColor:"#fff"}}>
                    <View style={{ width: "25%", height: "100%", alignItems: "flex-end", justifyContent: "center",padding:10}}>
                    </View>
                    <View style={{ width: "75%", height: "100%", alignItems: "flex-start", justifyContent: "center"}}>
                      <Text allowFontScaling={false} style={styles.smallButtonText}>Sign up with Google</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>*/}
                <View style={styles.bottomStyle}>
                  <Text allowFontScaling={false} style={styles.loginText}>
                    Already have account?{" "}
                    <Text
                      allowFontScaling={false}
                      style={{ textDecorationLine: "underline" }}
                      onPress={() => this.props.navigation.navigate("Login")}
                    >
                      Log In
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {/* </ImageBackground> */}
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  primaryText: {
    width: 220,
    height: 38,
    fontFamily: "SF Pro Text",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "left",
    color: "#000",
  },
  termsText: {
    width: 290,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
  },
  loginText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    color: "#000",
    textAlign: "center",
    marginBottom: 50,
    top: height - height * 0.94,
  },
  sectionStyle: {
    height: 40 + height * 0.034,
    width: width * 0.84,
    marginTop: height * 0.004,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomStyle: {
    height: 40 + height * 0.01,
    width: width * 0.84,
    marginTop: height * 0.005,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderWidth: 1,
    bottom: 10,
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
    padding: 2,
    fontFamily: "SF Pro Text",
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#ffffff",
  },
  buttonStyleBlack: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: "#22242A",
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
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 7,
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
    color: color.mediumPink,
  },
};
