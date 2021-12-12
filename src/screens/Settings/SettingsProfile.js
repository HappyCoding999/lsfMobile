import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  Platform,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { color, colorNew } from "../../modules/styles/theme";
import { User } from "../../DataStore";

import firebase from "react-native-firebase";

// var ImagePicker = require("react-native-image-picker");
import ImagePicker from "react-native-image-picker";

const { width, height } = Dimensions.get("window");

export default class SettingsProfile extends Component {
  constructor(props) {
    super(props);

    // this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    this.state = {
      name: "",
      lastname: "",
      userName: "",
      image_uri: "",
      saveDisabled: true,
    };
  }

  selectPhotoTapped = async () => {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    // NEW CODE //
    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
      } catch (error) {}

      const isCameraAuthorized = await PermissionsAndroid.check(
        "android.permission.WRITE_EXTERNAL_STORAGE"
      );

      if (!isCameraAuthorized) {
        Alert.alert(
          "Permission Denied",
          "Please provide storage permission to access the photos"
        );
        return;
      }
    }

    const options = {
      title: "Select Photo",
      storageOptions: {
        skipBackup: true,
        path: "images",
        privateDirectory: true,
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        Alert.alert("Failed", "User cancelled image picker");
      } else if (response.error) {
        Alert.alert("Failed", "ImagePicker Error: " + response.error);
      } else if (response.customButton) {
        Alert.alert(
          "Failed",
          "User tapped custom button: " + response.customButton
        );
      } else {
        // const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          image_uri: response.uri,
        });

        this.uploadImage(
          this.getPlatformPath(response).value,
          response.fileName.substring(
            response.fileName.lastIndexOf("."),
            response.fileName.length
          )
        )
          .then((url) => {
            this.setState({
              image_uri: url,
              saveDisabled: false,
            });
          })
          .catch((error) => {
            alert("1. uploadImage error:\n" + error.stack);
            console.log(error.stack);
          });
      }
    });
  };

  uploadImage = (path, type, mime = "application/octet-stream") => {
    return new Promise((resolve, reject) => {
      const sessionId = new Date().getTime();
      const imageRef = firebase
        .storage()
        .ref("profileimages/")
        .child(sessionId + type);

      // alert("sessionId:\n" + sessionId + type);

      return imageRef
        .putFile(path, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);

          alert("2. uploadImage error:\n" + JSON.stringify(error));

          console.log("Error uploading image: ", error);
        });
    });
  };

  getPlatformPath({ path, uri }) {
    return Platform.select({
      android: { value: path },
      ios: { value: uri },
    });
  }

  _updateProfile = () => {
    const { avatar, userName, name, lastname } = this.props.screenProps;
    let data = {
      avatar: this.state.image_uri ? this.state.image_uri : avatar,
      username: this.state.userName ? this.state.userName : userName,
      name: this.state.name ? this.state.name : name,
      lastname: this.state.lastname != "" ? this.state.lastname : lastname,
    };
    User.updateUserData({
      avatar: this.state.image_uri ? this.state.image_uri : avatar,
      username: this.state.userName ? this.state.userName : userName,
      name: this.state.name ? this.state.name : name,
      lastname: this.state.lastname != "" ? this.state.lastname : lastname,
    })
      .then(() => {
        this.props.screenProps.updateUserData(data);
        this.props.navigation.goBack(null);
      })
      .catch((err) => Alert.alert(err.stack));
  };

  render() {
    const { avatar, userName, name, lastname } = this.props.screenProps;
    const { image_uri } = this.state;

    return (
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: "#fff",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            marginTop: 13,
            overflow: "hidden",
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: color.palePink,
          }}
        >
          <Image
            style={{ width: 100, height: 100 }}
            source={
              image_uri === undefined || image_uri === null || image_uri === ""
                ? avatar
                  ? { uri: avatar }
                  : require("./images/avatar.png")
                : { uri: image_uri }
            }
          />
        </View>
        <TouchableOpacity
          style={{ alignItems: "flex-end", marginTop: -40, marginLeft: 60 }}
          onPress={() => {
            this.selectPhotoTapped();
          }}
        >
          <View>
            <Image source={require("./images/addButton.png")} />
          </View>
        </TouchableOpacity>
        <View style={styles.sectionStyle}>
          <Text style={styles.headerText}>First Name</Text>
          <TextInput
            style={styles.textInputStyle}
            placeholder={"First Name"}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(name) => {
              this.setState({ name, saveDisabled: false });
            }}
          >
            {name}
          </TextInput>
        </View>
        <View style={styles.sectionStyle}>
          <Text style={styles.headerText}>Last Name</Text>
          <TextInput
            style={styles.textInputStyle}
            placeholder={"Last Name"}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(lastname) => {
              this.setState({ lastname, saveDisabled: false });
            }}
          >
            {lastname}
          </TextInput>
        </View>
        <View style={styles.sectionStyle}>
          <Text style={styles.headerText}>Username</Text>
          <TextInput
            editable={true}
            style={styles.textInputStyle}
            placeholder={"Username"}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(userName) => {
              this.setState({ userName, saveDisabled: false });
            }}
          >
            {userName}
          </TextInput>
        </View>
        <View style={{ marginTop: 24 }}>
          <TouchableHighlight
            disabled={this.state.saveDisabled}
            style={
              this.state.saveDisabled
                ? styles.disabledButton
                : styles.buttonStyle
            }
            onPress={this._updateProfile}
            underlayColor={"#ee90af"}
          >
            <Text allowFontScaling={false} style={styles.buttonText}>
              UPDATE PROFILE
            </Text>
          </TouchableHighlight>
        </View>
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
    width: width,
    top: height * 0.12,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: color.lightGrey,
    borderWidth: 1,
    textAlign: "left",
  },
  sectionStyle: {
    height: 82,
    width: width * 0.84,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ddd",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 18,
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
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: colorNew.darkPink,
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
  disabledButton: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.lightGrey,
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
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
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
  headerText: {
    width: 125,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
  },
};
