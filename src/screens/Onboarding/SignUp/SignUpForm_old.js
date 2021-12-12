import React, { Component } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, Dimensions, TextInput, TouchableHighlight, Linking, Alert} from "react-native";
import { color} from "../../../modules/styles/theme";
import { SafeAreaView } from 'react-navigation'
import DatePicker from "react-native-datepicker"
import { CheckBox } from 'react-native-elements'


var ImagePicker = require('react-native-image-picker');

const { width, height } = Dimensions.get('window');

export default class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.onNextButtonPressed = this.onNextButtonPressed.bind(this)
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this)

    this.state = {
      nameValue: "",
      birthdayValue: "",
      userNameValue: "",
      image_uri: ""
    };
  }

  componentDidMount() {
    const { facebookUser } = this.props.navigation.state.params;

    if (facebookUser) {
      this.setState({
        facebookValue: facebookUser.name,
        nameValue: facebookUser.name
      })
    }

  }


  selectPhotoTapped() {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    ImagePicker.showImagePicker(null, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          image_uri: response.uri
        })
      }
    });
  }

  onNextButtonPressed = () => 
  {

    const { nameValue, birthdayValue, userNameValue, image_uri } = this.state;
    const { email, password, facebookUser, authorizedUser } = this.props.navigation.state.params;
   
    if (facebookUser) 
    {
      if (userNameValue == '') {
          Alert.alert("Please fill in missing fields");
        }
        else
        {
          var userinfo = {
            email: email,
            name: facebookUser.name,
            token: facebookUser.token,
            birthday: birthdayValue,
            userName: userNameValue,
            avatar: image_uri
          }          
          this.props.navigation.navigate("MeasurementsForm", { user: userinfo, authorizedUser })
        }
    } 
    else 
    {
       if (nameValue == '' || userNameValue == '') {
          Alert.alert("Please fill in missing fields");
        } 
        else 
        {
          var userinfo = {
            email: email,
            password: password,
            name: nameValue,
            birthday: birthdayValue,
            userName: userNameValue,
            avatar: image_uri
        }
        this.props.navigation.navigate("MeasurementsForm", { user: userinfo, authorizedUser })
      }

    }
  }



  render() {

    const { nameValue, birthdayValue, userNameValue, image_uri } = this.state;

    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    today = mm + '-' + dd + '-' + yyyy;

    return (
      <View style={{ height, width, backgroundColor: "#fff", alignItems: "center", flexDirection: "column"}}>
        <SafeAreaView style={{ height: 61 }} forceInset={{ top: "always", bottom: "never" }} />
        <ScrollView horizontal={false} width={width} contentContainerStyle={{alignItems: "center"}}>
          <Text allowFontScaling={false} style={styles.primaryText}>Hey, let’s be friends!</Text>
          <View style={{ marginTop: 13, overflow: "hidden", width: 100, height: 100, borderRadius: 50 }}>
            <Image style={{ width: 100, height: 100 }} source={image_uri ? { uri: image_uri } : require("./images/avatar.png")} />
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-end", marginTop: -40, marginLeft: 60 }}
            onPress={this.selectPhotoTapped.bind(this)}>
            <View>
              <Image source={require("./images/addButton.png")} />
            </View>
          </TouchableOpacity>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.textInputStyle}
              placeholder={"Name"}
              placeholderTextColor={color.mediumGrey}
              onChangeText={(nameValue) => { this.setState({ nameValue }) }}>{nameValue}</TextInput>
          </View>
          <View style={styles.sectionStyle}>

            <DatePicker
              style={{ marginRight: 0 }}
              date={birthdayValue}
              mode="date"
              placeholder="Birthday"
              format="MM-DD-YYYY"
              minDate="01-01-1900"
              maxDate={today}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: {
                  borderColor: "#fff"
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
                  paddingRight: 80
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
                  paddingRight: 80
                }


              }}
              onDateChange={(date) => { this.setState({ birthdayValue: date }); }}
            />
            <Text style={styles.textInputStyle}>(optional)</Text>
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              editable={true}
              style={styles.textInputStyle}
              placeholder={"Username"}
              placeholderTextColor={color.mediumGrey}
              onChangeText={(userNameValue) => { this.setState({ userNameValue }) }}>{userNameValue}</TextInput>
          </View>

          <Text style={{ marginTop: 20, width: "60%", textAlign: "center", fontFamily: "SF Pro Text", fontSize: 12, lineHeight: 16 }}>By tapping Continue, I agree to LSF’s <Text allowFontScaling={false} style={{ textDecorationLine: "underline" }} onPress={() => { Linking.openURL('https://lovesweatfitness.com/privacy-policy/') }}>Privacy Policy</Text>+<Text allowFontScaling={false} style={{ textDecorationLine: "underline" }} onPress={() => { Linking.openURL('https://lovesweatfitness.com/terms-conditions/') }}>Terms & Conditions</Text></Text>
          <View style={{ marginTop: 24 }}>
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={this.onNextButtonPressed}
              underlayColor={'#ee90af'}>
              <Text allowFontScaling={false} style={styles.buttonText}>CONTINUE</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }

}

const styles = {
  primaryText: {
    width: 188,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    backgroundColor: "#fff",
  },
  textInput: {
    height: 40,
    width: width * .84,
    top: height * .12,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color.lightGrey,
    borderWidth: 1
  },
  sectionStyle: {
    height: 46,
    width: width * .84,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 18
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
    color: color.mediumGrey
  },
  textInputStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.mediumGrey,
    fontSize: 16
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
  connectButtonStyle: {
    width: 84,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: color.mediumAqua,
    alignItems: 'center',
    justifyContent: 'center',

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
    color: color.black
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
  activityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }

}