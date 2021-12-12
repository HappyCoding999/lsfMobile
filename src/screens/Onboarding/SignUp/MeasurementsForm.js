import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableHighlight,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { color, colorNew } from "../../../modules/styles/theme";
import { GradientSlider } from "./../../../components/common/";
import firebase from "react-native-firebase";
import { GoalBubble } from "../../../components/common/GoalBubble";
import { User } from "../../../DataStore";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-material-dropdown";
import {
  goal_lose_weight,
  goal_eat_halthier,
  goal_feel_hapier,
  goal_get_stronger,
  goal_build_edurance,
  goal_tighten_up,
} from "../../../images";
import { DoneCongratsButton } from "../../../components/common/AnimatedComponents/DoneCongratsButton";
import { Animated } from "react-native";
import { CurrentStep } from "../../../components/common/AnimatedComponents/CurrentStep";
import { StepCard } from "./StepCard";
import { verticalScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("window");
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class MeasurementsForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);

    this.onNextButtonPressed = this.onNextButtonPressed.bind(this);
    this.onContinueButtonPressed = this.onContinueButtonPressed.bind(this);
    this.onSkipButtonPressed = this.onSkipButtonPressed.bind(this);
    this.onInfoButtonPressed = this.onInfoButtonPressed.bind(this);

    this._onPress = this._onPress.bind(this);
    this.goalAdded = this.goalAdded.bind(this);
    this.authorizing = false;

    const { MeasurementsInfo } = this.props || {};
    console.log("MeasurementsInfo");
    console.log(MeasurementsInfo);

    this.step3Scale = new Animated.Value(1);
    this.step3Opacity = new Animated.Value(1);
    this.state = {
      step3Size: undefined,
      submitAnimationEnded: false,
      feet: MeasurementsInfo == undefined ? "" : MeasurementsInfo.feet,
      inches: MeasurementsInfo == undefined ? "" : MeasurementsInfo.inches,
      weightValue:
        MeasurementsInfo == undefined ? "" : MeasurementsInfo.weightValue,
      heightValue:
        MeasurementsInfo == undefined ? "" : MeasurementsInfo.heightValue,
      ageValue: MeasurementsInfo == undefined ? "" : MeasurementsInfo.ageValue,
      fitnessLevel:
        MeasurementsInfo == undefined
          ? "BEGINNER"
          : MeasurementsInfo.fitnessLevel == undefined
          ? "BEGINNER"
          : MeasurementsInfo.fitnessLevel,
      workoutdays: "5",
      currentStep: 1,
      goals: [],
      heightFormate: [{ value: "ft/in" }, { value: "cm" }, { value: "meter" }],
      heightSelectedFormate:
        MeasurementsInfo == undefined
          ? "ft/in"
          : MeasurementsInfo.heightSelectedFormate,
      showLoadingModal: false,
      authorizing: false,
    };
  }

  _onPress = (text) => {
    console.log("_onPress");
    console.log(text);
    this.setState({ fitnessLevel: text });
  };

  onChangeText(text) {
    this.setState({ heightSelectedFormate: text });
  }

  onStep3Layout = (e) => {
    const { step3Size } = this.state;
    if (step3Size) {
      return;
    }

    this.setState({
      step3Size: {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      },
    });
  };

  goalAdded = (goal) => {
    console.log("goalAdded called");
    console.log(goal);
    console.log(this.state.goals);
    if (this.state.goals.includes(goal)) {
      const filteredItems = this.state.goals.filter(function (item) {
        return item !== goal;
      });
      this.state.goals = filteredItems;
    } else {
      this.state.goals.push(goal);
    }

    this.setState({
      goals: this.state.goals,
    });
  };

  onInfoButtonPressed = () => {
    Alert.alert("Alert", "Info Button Pressed");
  };
  onSkipButtonPressed = () => {
    this.setState({ currentStep: 3 });
  };
  onContinueButtonPressed = () => {
    // console.log("onContinueButtonPressed");
    const { user, authorizedUser } = this.props;
    // console.log("currentStep");
    // console.log(this.state.currentStep);
    if (this.state.currentStep == 1) {
      console.log("currentStep 1");
      /*let MeasurementsInfo = {feet:this.state.feet,
        inches:this.state.inches,
        heightValue:this.state.heightValue,
        heightSelectedFormate:this.state.heightSelectedFormate,
        ageValue:this.state.ageValue,
        weightValue:this.state.weightValue,
        currentStep:2,
        fitnessLevel:"INTERMIDIATE"
      }
      this.props.navigation.navigate("MeasurementsForm", { user, authorizedUser, MeasurementsInfo})*/
      this.setState({ currentStep: 2 });
    } else if (this.state.currentStep == 2) {
      console.log("currentStep 2");
      /*let MeasurementsInfo = {feet:this.state.feet,
        inches:this.state.inches,
        heightValue:this.state.heightValue,
        heightSelectedFormate:this.state.heightSelectedFormate,
        ageValue:this.state.ageValue,
        weightValue:this.state.weightValue,
        currentStep:3,
        fitnessLevel:this.state.fitnessLevel
      }
      this.props.navigation.navigate("MeasurementsForm", { user, authorizedUser, MeasurementsInfo})*/
      this.setState({ currentStep: 3 });
    } else {
      this.onNextButtonPressed();
    }
  };

  onNextButtonPressed = () => {
    const { authorizedUser } = this.props;

    if (this.authorizing) {
      console.log("not authorizing!");
      return;
    }

    this.authorizing = true;

    this.setState(
      {
        showLoadingModal: true,
        authorizing: true,
      },
      authorizedUser ? this._create : this._authorizeAndCreateUser
    );
  };

  _create = () => {
    const { user } = this.props;
    const { feet, inches, weightValue } = this.state;
    // if (feet === "" || inches === "" || weightValue === "") {
    //   const error = {
    //     message: "Please fill in missing fields",
    //     code: ""
    //   };

    //   return this.setState({ showLoadingModal: false }, () => this._onAuthErr(error));
    // }

    // alert("params:\n\n" + JSON.stringify(this.props.navigation.state.params));

    // if (user.token) {
    if (
      this.props.navigation.state.params.data &&
      this.props.navigation.state.params.data.token
    ) {
      this._createSocialUser(this.props.navigation.state.params.data);
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(
          this.props.navigation.state.params.email,
          this.props.navigation.state.params.password
        )
        .then(() => this._createUser(true))
        .catch((err) => {
          window.alert(err);
          this.authorizing = true;
          this.authorizing = false;
          this.setState({
            showLoadingModal: false,
            authorizing: false,
          }); /*this._onAuthErr(err)*/
        });
    }
  };

  _authorizeAndCreateUser = () => {
    const { feet, inches, weightValue } = this.state;
    const { user } = this.props;

    // if (feet === "" || inches === "" || weightValue === "") {
    //   const error = {
    //     message: "Please fill in missing fields",
    //     code: ""
    //   };

    //   return this.setState({ showLoadingModal: false }, () => this._onAuthErr(error));
    // }

    // alert("params:\n\n" + JSON.stringify(this.props.navigation.state.params));

    // if (user.token) {
    if (
      this.props.navigation.state.params.data &&
      this.props.navigation.state.params.data.token
    ) {
      this._createSocialUser(this.props.navigation.state.params.data);
    } else {
      this._createUserWithEmailAndPassword(
        this.props.navigation.state.params,
        user
      );
    }
  };

  _createSocialUser(user) {
    var credential;

    if (user.type === "apple") {
      credential = firebase.auth.AppleAuthProvider.credential(user.token);
    } else if (user.type === "google") {
      credential = firebase.auth.GoogleAuthProvider.credential(user.token);
    } else {
      credential = firebase.auth.FacebookAuthProvider.credential(user.token);
    }

    firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        var authUser = firebase.auth().currentUser;

        authUser
          .updateProfile({
            displayName: user.name,
          })
          .then(this._createUser)
          .catch(this._onAuthErr);
      })
      .catch(this._onAuthErr);
  }

  _createUserWithEmailAndPassword(params, user) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(params.email, params.password)
      .then(() => {
        var authUser = firebase.auth().currentUser;
        authUser
          .updateProfile({
            // displayName: user.name + " " + user.lastname,
            displayName: user.name,
          })
          .then(this._createUser)
          .catch(this._onAuthErr);
      })
      .catch((err) => {
        window.alert(err);
        this.authorizing = true;
        this.authorizing = false;
        this.setState({
          showLoadingModal: false,
          authorizing: false,
        }); /*this._onAuthErr(err)*/
      });
  }

  _createUser = (isStripeCustomer) => {
    const authUser = firebase.auth().currentUser;
    const { user, weeklyWorkoutValue } = this.props;
    const { feet, inches, weightValue } = this.state;
    const {
      heightValue,
      ageValue,
      fitnessLevel,
      heightSelectedFormate,
      goals,
    } = this.state;
    let goalsString = goals.join("|");

    const newUser = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar,
      birthday: user.birthday,
      userName: user.userName,
      weight: weightValue,
      feet: feet, //available if heightSelectedFormate is 'ft/in'
      inches: inches, //available if heightSelectedFormate is 'ft/in'
      height: heightValue, //available if heightSelectedFormate is not 'ft/in'
      heightFormate: heightSelectedFormate, //available if user created from version 2.0 and above.
      goals: goalsString, //available if user created from version 2.0 and above.
      fitnessLevel: fitnessLevel, //available if user created from version 2.0 and above.
      ageValue: ageValue, //available if user created from version 2.0 and above.
      country: user.country, //available if user created from version 2.0 and above.
      state: user.state, //available if user created from version 2.0 and above.
      city: user.city, //available if user created from version 2.0 and above.
      weekly: weeklyWorkoutValue || "",
      stripeCustomer: isStripeCustomer ? true : false,
    };

    // Old object for user creation.
    /*const newUser = {
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
    };*/

    if (user.avatar.trim() != "") {
      this.uploadImage(user.avatar)
        .then((url) => {
          User.create({ ...newUser, avatar: url, authorizedID: authUser.uid })
            .then(this._onUserCreated)
            .catch(this._onAuthErr);
        })
        .catch(this._onAuthErr);
    } else {
      User.create({
        ...newUser,
        avatar: user.avatar,
        authorizedID: authUser.uid,
      })
        .then(this._onUserCreated)
        .catch(this._onAuthErr);
    }
  };

  _onUserCreated = () => {
    const { onSignupSuccess } = this.props;
    const { submitAnimationEnded } = this.state;
    if (!submitAnimationEnded) {
      setTimeout(() => {
        this._onUserCreated();
      }, 100);
      return;
    }

    this.setState(
      {
        showLoadingModal: false,
      },
      onSignupSuccess
    );
  };

  _onAuthErr = (error) => {
    const { code, message } = error;

    this.authorizing = false;
    this.setState(
      {
        showLoadingModal: false,
      },
      () => window.alert(message)
    );
    // this.setState({
    //   showLoadingModal: false
    // }, () => Alert.alert("An Error Occurred", message, code));
  };

  uploadImage = (path, mime = "application/octet-stream") => {
    return new Promise((resolve, reject) => {
      const sessionId = new Date().getTime();
      const imageRef = firebase
        .storage()
        .ref("profileimages/")
        .child(sessionId + ".png");

      return imageRef
        .put(path, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
          console.log("Error uploading image: ", error);
        });
    });
  };

  sliderChanged = (value) => {
    console.log(value);
  };

  renderLoadingModal() {
    return (
      <Modal
        visible={this.state.showLoadingModal}
        animationType={"fade"}
        backgroundColor={"#fff"}
        onRequestClose={() => console.log("")}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            flexDirection: "column",
          }}
        >
          <Image
            style={{ marginBottom: 20 }}
            source={require("./images/illustrationPineapple.png")}
          />
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
      <View
        style={{
          flexDirection: "column",
          marginTop: 5,
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "50%" }}>
            <GoalBubble word={"LOSE WEIGHT"} action={this.goalAdded} />
          </View>
          <View style={{ width: "50%" }}>
            <GoalBubble word={"GET STRONGER"} action={this.goalAdded} />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            marginTop: 10,
          }}
        >
          <View style={{ width: "50%" }}>
            <GoalBubble word={"EAT HEALTHIER"} action={this.goalAdded} />
          </View>
          <View style={{ width: "50%" }}>
            <GoalBubble word={"BUILD ENDURANCE"} action={this.goalAdded} />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            marginTop: 10,
          }}
        >
          <View style={{ width: "50%" }}>
            <GoalBubble word={"FEEL HAPPIER"} action={this.goalAdded} />
          </View>
          <View style={{ width: "50%" }}>
            <GoalBubble word={"TIGHTEN UP"} action={this.goalAdded} />
          </View>
        </View>
      </View>
    );
  }

  onCompleteAccountPressed = () => {
    this.completeAccountButton.beginAnimation();
    Animated.timing(this.step3Scale, {
      toValue: 0.01,
      duration: 100,
      easing: Easing.ease,
    }).start();
    Animated.timing(this.step3Opacity, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
    }).start();
    this.onNextButtonPressed();
  };

  onSubmitAnimationEnded = () => {
    this.setState({ submitAnimationEnded: true });
  };

  renderSubmitButton() {
    const { submitAnimationEnded } = this.state;
    return (
      <View style={{ marginTop: 2, alignItems: "center", marginBottom: 40 }}>
        {submitAnimationEnded && (
          <View style={{ position: "absolute" }}>
            <ActivityIndicator />
          </View>
        )}
        <DoneCongratsButton
          ref={(view) => (this.completeAccountButton = view)}
          onButtonPressed={this.onCompleteAccountPressed}
          onAnimationEnded={this.onSubmitAnimationEnded}
        />
      </View>
    );
  }
  renderStepIndicatorView() {
    return (
      <View
        style={{
          height: 50,
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
        pointerEvents={"none"}
      >
        <CurrentStep
          showAnimated={this.state.currentStep == 1 && this.props.displaying}
          progress={this.state.currentStep > 1 ? 1 : 0}
        />
        <CurrentStep
          showAnimated={this.state.currentStep == 2}
          progress={this.state.currentStep > 2 ? 1 : 0}
        />
        <CurrentStep showAnimated={this.state.currentStep == 3} />
      </View>
    );
  }
  renderSkipButton() {
    return (
      <View style={{ top: 0, marginBottom: 15, alignItems: "center" }}>
        <TouchableHighlight
          style={styles.buttonStyle}
          onPress={this.onSkipButtonPressed}
          underlayColor={"#ee90af"}
        >
          <Text
            allowFontScaling={false}
            style={{
              ...styles.buttonText,
              fontFamily: "SF Pro Text Regular",
              fontSize: 13,
              textDecorationLine: "underline",
            }}
          >
            Skip
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
  renderHeight() {
    const { ageValue, weightValue, feet, inches, heightValue } = this.state;
    if (this.state.heightSelectedFormate == "ft/in") {
      return (
        <View
          style={{
            ...styles.sectionStyle,
            marginTop: 0,
            width: width * 0.7,
            borderBottomColor: "transparent",
          }}
        >
          <TextInput
            maxLength={1}
            keyboardType="numeric"
            textAlign={"center"}
            style={{
              ...styles.sectionStyleLight,
              marginTop: 0,
              width: width * 0.2,
              margin: 10,
            }}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(feet) => {
              this.setState({ feet });
            }}
          >
            {feet}
          </TextInput>
          <TextInput
            maxLength={2}
            keyboardType="numeric"
            textAlign={"center"}
            style={{
              ...styles.sectionStyleLight,
              marginTop: 0,
              width: width * 0.2,
              margin: 10,
            }}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(inches) => {
              this.setState({ inches });
            }}
          >
            {inches}
          </TextInput>
          <View
            style={{
              ...styles.sectionStyle,
              margin: 10,
              width: width * 0.18,
              marginTop: -5,
              borderBottomColor: "transparent",
              flexDirection: "row",
              backgroundColor: "#b2b2b230",
              borderRadius: 20,
              height: "40%",
            }}
          >
            <Dropdown
              label=""
              fontSize={15}
              labelFontSize={15}
              style={styles.dropdownFont}
              containerStyle={{ width: 60, marginTop: -20 }}
              onChangeText={(value, index, data) => {
                this.setState({ heightSelectedFormate: value });
              }}
              value={this.state.heightSelectedFormate}
              data={this.state.heightFormate}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            ...styles.sectionStyle,
            marginTop: 0,
            width: width * 0.7,
            borderBottomColor: "transparent",
          }}
        >
          <TextInput
            maxLength={3}
            keyboardType="numeric"
            textAlign={"center"}
            style={{
              ...styles.sectionStyle,
              marginTop: 0,
              width: width * 0.5,
              margin: 5,
            }}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(heightValue) => {
              this.setState({ heightValue });
            }}
          >
            {heightValue}
          </TextInput>
          <View
            style={{
              ...styles.sectionStyle,
              marginTop: 0,
              margin: 10,
              width: width * 0.18,
              borderBottomColor: "transparent",
              flexDirection: "row",
              backgroundColor: "#b2b2b230",
              borderRadius: 20,
              height: "40%",
            }}
          >
            <Dropdown
              label=""
              fontSize={15}
              labelFontSize={15}
              style={styles.dropdownFont}
              containerStyle={{ width: 70, marginTop: -20 }}
              onChangeText={(value, index, data) => {
                this.setState({ heightSelectedFormate: value });
              }}
              value={this.state.heightSelectedFormate}
              data={this.state.heightFormate}
            />
          </View>
        </View>
      );
    }
  }
  renderHeightWeightAge() {
    const { ageValue, weightValue, feet, inches, heightValue } = this.state;
    return (
      <View
        style={{
          flex: 1,
          height: verticalScale(460),
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ ...styles.containerStyle, marginBottom: 10 }}>
          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              width: width * 0.85,
              height: height * 0.45,
              marginTop: 20,
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                ...styles.buttonText,
                color: color.mediumGrey,
                marginTop: 15,
              }}
            >
              Height
            </Text>
            {this.renderHeight()}
            <Text
              allowFontScaling={false}
              style={{
                ...styles.buttonText,
                color: color.mediumGrey,
                marginTop: 10,
              }}
            >
              Age
            </Text>
            <View
              style={{
                ...styles.sectionStyle,
                marginTop: 0,
                width: width * 0.7,
                borderBottomColor: "transparent",
              }}
            >
              <TextInput
                maxLength={3}
                keyboardType="numeric"
                textAlign={"center"}
                style={{
                  ...styles.sectionStyle,
                  marginTop: 0,
                  width: width * 0.7,
                  margin: 10,
                }}
                placeholder={""}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(ageValue) => {
                  this.setState({ ageValue });
                }}
              >
                {ageValue}
              </TextInput>
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.buttonText,
                color: color.mediumGrey,
                marginTop: 10,
              }}
            >
              Weight
            </Text>
            <View
              style={{
                ...styles.sectionStyle,
                marginTop: 0,
                width: width * 0.7,
                borderBottomColor: "transparent",
              }}
            >
              <TextInput
                maxLength={3}
                keyboardType="numeric"
                textAlign={"center"}
                style={{
                  ...styles.sectionStyle,
                  marginTop: 0,
                  width: width * 0.7,
                  margin: 10,
                }}
                placeholder={""}
                placeholderTextColor={color.mediumGrey}
                onChangeText={(weightValue) => {
                  this.setState({ weightValue });
                }}
              >
                {weightValue}
              </TextInput>
            </View>
            <View
              style={{
                ...styles.sectionStyle,
                borderBottomColor: "transparent",
                height: "20%",
              }}
            >
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={this.onContinueButtonPressed}
                underlayColor={"#ee90af"}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.buttonText,
                    textDecorationLine: "underline",
                    color: colorNew.darkPink,
                    marginTop: 10,
                  }}
                >
                  Continue to next step
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    );
  }
  renderFitnessLevelSub(title, subtitle) {
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          width: width * 0.85,
          height: "25%",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          style={
            this.state.fitnessLevel == title
              ? styles.bubbleFitnessSelected
              : styles.bubbleFitnessDefault
          }
          onPress={() => this._onPress(title)}
          activeOpacity={1}
        >
          <Text
            style={{
              ...styles.bubbleFitnessText,
              fontSize: 17,
              lineHeight: 19,
              color:
                this.state.fitnessLevel == title
                  ? color.white
                  : color.mediumPink,
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
        <Text style={{ ...styles.bubbleFitnessText, color: colorNew.boxGrey }}>
          {subtitle}
        </Text>
      </View>
    );
  }
  renderContinueButton() {
    return (
      <View
        style={{
          ...styles.sectionStyle,
          borderBottomColor: "transparent",
          height: "20%",
        }}
      >
        <TouchableHighlight
          style={styles.buttonStyle}
          onPress={this.onContinueButtonPressed}
          underlayColor={"#ee90af"}
        >
          <Text
            allowFontScaling={false}
            style={{
              ...styles.buttonText,
              textDecorationLine: "underline",
              color: colorNew.darkPink,
              marginTop: 10,
            }}
          >
            Continue to next step
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
  renderFitnessLevel() {
    const { ageValue, weightValue, feet, inches, heightValue } = this.state;
    return (
      <View
        style={{
          flex: 1,
          height: verticalScale(460),
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ ...styles.containerStyle, marginBottom: 10 }}>
          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              width: width * 0.85,
              height: height * 0.55,
              marginTop: 20,
            }}
          >
            {this.renderFitnessLevelSub(
              "BEGINNER",
              "You are just starting your fitness journey or \n jumping back in after a while"
            )}
            {this.renderFitnessLevelSub(
              "INTERMEDIATE",
              "You are familiar with working out but still need\ninstructions and guidence"
            )}
            {this.renderFitnessLevelSub(
              "ADVANCED",
              "You already work out consistently and are\nconfident in your fitness abilities"
            )}
            {this.renderContinueButton()}
          </View>
        </View>
      </View>
    );
  }
  renderGoals(img, title) {
    let isSelected = this.state.goals.includes(title);
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          width: width * 0.85,
          height: "10%",
          flexDirection: "row",
          backgroundColor: isSelected ? colorNew.lightPink : "transparent",
          marginBottom: 10,
          borderRadius: 50,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => this.goalAdded(title)}
          activeOpacity={1}
        >
          <View
            style={{
              width: "30%",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Image
              source={img}
              resizeMode="contain"
              style={{ height: 35, width: 35 }}
            />
          </View>
          <View
            style={{
              width: "70%",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...styles.bubbleFitnessText,
                fontSize: 18,
                lineHeight: 20,
                marginLeft: 20,
                textAlign: "left",
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderFitnessGoals() {
    const { ageValue, weightValue, feet, inches, heightValue } = this.state;
    return (
      <View
        style={{
          flex: 1,
          height: verticalScale(460),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ ...styles.containerStyle, marginBottom: 10 }}>
          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              width: width * 0.85,
              height: height * 0.55,
              marginTop: 20,
            }}
          >
            <Text
              style={{ ...styles.bubbleFitnessText, color: colorNew.boxGrey }}
            >
              Select all that apply
            </Text>
            {this.renderGoals(goal_lose_weight, "LOSE WEIGHT")}
            {this.renderGoals(goal_eat_halthier, "EAT Healthier".toUpperCase())}
            {this.renderGoals(goal_feel_hapier, "feel happier".toUpperCase())}
            {this.renderGoals(goal_get_stronger, "get stronger".toUpperCase())}
            {this.renderGoals(
              goal_build_edurance,
              "build ENDURANCE".toUpperCase()
            )}
            {this.renderGoals(goal_tighten_up, "tighten up".toUpperCase())}
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { heightValue, weightValue, feet, inches, currentStep } = this.state;
    const scale = this.step3Scale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const opacity = this.step3Opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <View style={styles.linearGradient}>
          <SafeAreaView style={{ marginTop: 72 }} />
          <KeyboardAwareScrollView
            contentContainerStyle={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: width,
              flexDirection: "row",
            }}
            scrollEnabled={true}
          >
            <View style={{ alignItems: "center", width: width }}>
              <View
                style={[
                  {
                    alignItems: "center",
                    height: verticalScale(525),
                    marginBottom: 30,
                    width: width,
                  },
                ]}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    flexDirection: "column",
                    opacity,
                    transform: [{ scale }],
                  }}
                >
                  <View
                    style={{ height: verticalScale(495), marginBottom: 10 }}
                  >
                    <StepCard
                      stepNumber={1}
                      currentStep={currentStep}
                      primaryText={"Tell us about your goals!"}
                      secondaryText={"Help us build your perfect plan"}
                    >
                      {this.renderHeightWeightAge()}
                    </StepCard>
                    <StepCard
                      stepNumber={2}
                      currentStep={currentStep}
                      primaryText={"What is your fitness level?"}
                      secondaryText={"Help us build your perfect plan"}
                    >
                      {this.renderFitnessLevel()}
                    </StepCard>
                    <StepCard
                      stepNumber={3}
                      currentStep={currentStep}
                      primaryText={"What are your goals?"}
                      secondaryText={"Help us build your perfect plan"}
                    >
                      {this.renderFitnessGoals()}
                    </StepCard>
                  </View>
                  {this.renderStepIndicatorView()}
                </Animated.View>
              </View>
              {currentStep == 3
                ? this.renderSubmitButton()
                : this.renderSkipButton()}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    width: width * 0.92,
    borderColor: "#bcbcbc",
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: color.white,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  containerFitnessStyle: {
    height: 46 + 20 + 36 + height * 0.12,
    width: width * 0.92,
    borderColor: "#bcbcbc",
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: color.white,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 35,
  },
  primaryText: {
    flex: 0,
    width: "90%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
  },
  secondaryText: {
    flex: 0,
    width: "90%",
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    marginTop: 5,
    color: color.white,
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
    marginLeft: 24,
  },
  twoLineText: {
    width: width * 0.92,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: color.black,
    marginTop: 10,
    textAlign: "center",
    marginLeft: 0,
  },
  fitnessTextTitle: {
    width: width * 0.92,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: color.mediumGrey,
    marginTop: 15,
    textAlign: "center",
    marginLeft: 0,
  },
  fitnessTextSubtitle: {
    width: width * 0.92,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#b2b2b2",
    marginTop: 2,
    textAlign: "center",
    marginLeft: 0,
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
    marginLeft: 24,
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
    textAlign: "center",
  },
  textInputStyle: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.mediumGrey,
    fontSize: 16,
  },
  dropdownFont: {
    // fontFamily: "SF Pro Text Light",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    fontSize: 15,
  },
  sectionStyleLight: {
    // height: "30%",
    marginTop: height * 0.004,
    width: width * 0.19,
    // fontFamily: "SF Pro Text Light",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    fontSize: 16,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
    paddingLeft: 5,
  },
  sectionStyle: {
    // height: "30%",
    marginTop: height * 0.004,
    width: width * 0.19,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
    paddingLeft: 5,
  },
  buttonStyle: {
    width: width * 0.8,
    height: 48,
    marginBottom: 10,
    borderRadius: 100,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    width: "100%",
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  bubbleFitnessSelected: {
    padding: 10,
    height: 38,
    backgroundColor: color.mediumPink,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: color.hotPink,
    // borderWidth: 1,
  },
  bubbleFitnessDefault: {
    padding: 10,
    height: 35,
    backgroundColor: "#fff",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleWorkoutSelected: {
    width: 44,
    height: 44,
    backgroundColor: color.lightPink,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.hotPink,
    borderWidth: 1,
  },
  bubbleWorkoutDefault: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleFitnessText: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    color: color.mediumPink,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  bubbleWorkoutText: {
    fontFamily: "SF Pro Text",
    fontSize: 26,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 30,
    color: color.hotPink,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  linearGradient: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 20,
  },
};
