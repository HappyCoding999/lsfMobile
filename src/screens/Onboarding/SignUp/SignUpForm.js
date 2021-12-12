import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Linking,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { color, colorNew } from "../../../modules/styles/theme";
import { SafeAreaView } from "react-navigation";
import DatePicker from "react-native-datepicker";
import { CheckBox } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

var ImagePicker = require("react-native-image-picker");

const { width, height } = Dimensions.get("window");

export default class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.onNextButtonPressed = this.onNextButtonPressed.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    this.state = {
      nameValue: "",
      birthdayValue: "",
      userNameValue: "",
      countryValue: "",
      stateValue: "",
      cityValue: "",
      image_uri: "",
    };
  }

  componentDidMount() {
    const { facebookUser } = this.props.navigation.state.params || {};
    const { name } = this.props.navigation.state.params || {};
    const { lastname } = this.props.navigation.state.params || {};
    if (facebookUser) {
      this.setState({
        facebookValue: facebookUser.name,
        nameValue: facebookUser.name,
      });
    } else if (name && lastname) {
      this.setState({
        nameValue: name + " " + lastname,
      });
    }
  }

  async selectPhotoTapped() {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    if (Platform.OS == "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }

    ImagePicker.default.showImagePicker({}, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          image_uri: response.uri,
        });
      }
    });
  }

  onNextButtonPressed = () => {
    const { nameValue, birthdayValue, userNameValue, image_uri } = this.state;
    const { countryValue, stateValue, cityValue } = this.state;

    const { email, password, facebookUser, authorizedUser, lastname, name } =
      this.props.navigation.state.params;

    if (facebookUser) {
      if (userNameValue == "") {
        Alert.alert("Please fill in missing fields");
      } else {
        var userinfo = {
          email: email,
          name: facebookUser.firstName,
          lastname: facebookUser.lastName,
          token: facebookUser.token,
          birthday: birthdayValue,
          userName: userNameValue,
          country: countryValue,
          state: stateValue,
          city: cityValue,
          avatar: image_uri,
        };
        console.log("userinfo when redirect on MeasurementsForm with fb user");
        console.log(userinfo);
        return;
        this.props.onShowMeasurementsForm({ user: userinfo, authorizedUser });
      }
    } else {
      if (nameValue == "" || userNameValue == "") {
        Alert.alert("Please fill in missing fields");
      } else {
        var userinfo = {
          email: email,
          password: password,
          name: lastname ? name : nameValue,
          lastname: lastname,
          birthday: birthdayValue,
          userName: userNameValue,
          country: countryValue,
          state: stateValue,
          city: cityValue,
          avatar: image_uri,
        };
        console.log("userinfo when redirect on MeasurementsForm");
        console.log(userinfo);
        this.props.onShowMeasurementsForm({ user: userinfo, authorizedUser });
      }
    }
  };

  render() {
    const {
      nameValue,
      birthdayValue,
      userNameValue,
      countryValue,
      stateValue,
      cityValue,
      image_uri,
    } = this.state;

    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }
    today = mm + "-" + dd + "-" + yyyy;

    return (
      <KeyboardAwareScrollView style={{ height, width }}>
        <View
          style={{
            height,
            width,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <View style={styles.linearGradient}>
            {/* <SafeAreaView style={{ height: 61 }} forceInset={{ top: "always", bottom: "never" }} />*/}
            <ScrollView
              horizontal={false}
              width={width}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.selectPhotoTapped.bind(this)}
              >
                <View
                  style={{
                    marginTop: 13 + 37 + 61,
                    overflow: "hidden",
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: colorNew.bgGrey,
                    borderColor: color.white,
                    borderWidth: 2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      width: image_uri ? 100 : 52,
                      height: image_uri ? 100 : 35,
                    }}
                    source={
                      image_uri
                        ? { uri: image_uri }
                        : require("./images/camera_.png")
                    }
                  />
                </View>
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.primaryTextBold}>
                Let’s get Started!
              </Text>
              <Text allowFontScaling={false} style={styles.secondaryText}>
                Fill in your details to create your account
              </Text>
              <View style={styles.containerStyle}>
                <View style={styles.sectionStyle}>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"Name"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(nameValue) => {
                      this.setState({ nameValue });
                    }}
                  >
                    {nameValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <TextInput
                    editable={true}
                    style={styles.textInputStyle}
                    placeholder={"Username"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(userNameValue) => {
                      this.setState({ userNameValue });
                    }}
                  >
                    {userNameValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <DatePicker
                    style={{ marginRight: 0 }}
                    date={birthdayValue}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    placeholder={"Birthday (optional)"}
                    format="MM-DD-YYYY"
                    minDate="01-01-1900"
                    maxDate={today}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderColor: "#fff",
                      },
                      dateText: {
                        height: 22,
                        fontFamily: "SF Pro Text",
                        fontSize: 16,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        lineHeight: 22,
                        letterSpacing: 0,
                        color: color.mediumGrey,
                        textAlign: "left",
                        // paddingRight: 50,
                      },
                      placeholderText: {
                        height: 22,
                        fontFamily: "SF Pro Text",
                        fontSize: 16,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        lineHeight: 22,
                        letterSpacing: 0,
                        color: color.mediumGrey,
                        textAlign: "left",
                        // paddingRight: 80,
                      },
                      datePicker: {
                        backgroundColor: "#fff",
                        justifyContent: "center",
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({ birthdayValue: date });
                    }}
                  />
                  {/* <Text style={styles.textInputStyle}>(optional)</Text> */}
                </View>
                <View style={styles.sectionStyle}>
                  <TextInput
                    editable={true}
                    style={styles.textInputStyle}
                    placeholder={"Country (optional)"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(countryValue) => {
                      this.setState({ countryValue });
                    }}
                  >
                    {countryValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <TextInput
                    editable={true}
                    style={styles.textInputStyle}
                    placeholder={"State (optional)"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(stateValue) => {
                      this.setState({ stateValue });
                    }}
                  >
                    {stateValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <TextInput
                    editable={true}
                    style={styles.textInputStyle}
                    placeholder={"City (optional)"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(cityValue) => {
                      this.setState({ cityValue });
                    }}
                  >
                    {cityValue}
                  </TextInput>
                </View>
              </View>
              <View style={{ marginTop: 24 }}>
                <TouchableHighlight
                  style={styles.buttonStyle}
                  onPress={this.onNextButtonPressed}
                  underlayColor={"#ee90af"}
                >
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Continue
                  </Text>
                </TouchableHighlight>
              </View>
              <Text
                style={{
                  margin: 20,
                  width: "60%",
                  textAlign: "center",
                  fontFamily: "SF Pro Text",
                  fontSize: 12,
                  lineHeight: 16,
                }}
              >
                <Text
                  allowFontScaling={false}
                  onPress={() => {
                    Linking.openURL(
                      "https://lovesweatfitness.com/terms-conditions/"
                    );
                  }}
                >
                  Terms of Use
                </Text>{" "}
                and{" "}
                <Text
                  allowFontScaling={false}
                  onPress={() => {
                    Linking.openURL(
                      "https://lovesweatfitness.com/privacy-policy/"
                    );
                  }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = {
  secondaryText: {
    width: width * 0.9,
    height: 14,
    marginTop: 5,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    backgroundColor: "transparent",
  },

  primaryTextBold: {
    width: width * 0.9,
    height: 42,
    marginTop: 30,
    fontFamily: "SF Pro Display Bold",
    // fontFamily: "SF Pro Text",
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    backgroundColor: "transparent",
  },
  primaryText: {
    width: width * 0.9,
    height: 32,
    marginTop: 30,
    fontFamily: "SF Pro Text",
    fontSize: 26,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    backgroundColor: "transparent",
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    width: width * 0.84,
    top: height * 0.12,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: color.lightGrey,
    borderWidth: 1,
  },
  sectionStyle: {
    height: 46,
    width: width * 0.75,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 18,
  },
  containerStyle: {
    height: (46 + 18) * 6 + 36,
    width: width * 0.9,
    borderColor: "#bcbcbc",
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: color.white,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 35,
  },
  textStyle: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 22,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.mediumGrey,
  },
  textInputStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.mediumGrey,
    fontSize: 16,
  },
  buttonStyleNew: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
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
  connectButtonStyle: {
    width: 84,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: color.mediumAqua,
    alignItems: "center",
    justifyContent: "center",
  },
  connectButtonText: {
    width: 60,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
  },
  buttonText: {
    width: 155,
    height: 14,
    fontFamily: "SF Pro Text Medium",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 16,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  activityContainer: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
};
