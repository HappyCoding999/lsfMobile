import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { color } from "../../../modules/styles/theme";
import firebase from "react-native-firebase"
var ImagePicker = require('react-native-image-picker');

export default class extends Component {

  state = {
    newImage: null
  };

  render() {
    const { name, userName, userLevel, avatar, membership } = this.props;
    const { newImage } = this.state;
    const { container, nameStyle } = styles;

    return (
      <View style={container}>
        <TouchableOpacity
        onPress={()=> this.selectPhotoTapped()}>
        {avatar ?
          <Image source={{ uri: newImage || avatar }} resizeMode="cover" style={{ width: 120, height: 120, borderRadius: 60 }} />
          :
          <Image source={require("../images/avatar.png")} />
        }
        </TouchableOpacity>

        {
          membership ?
            null
            :
            <Image style={{ position: 'absolute', top: 80, left: 100, zIndex: 3 }} source={require("../images/freeTrialPill.png")} />
        }

        <Text allowFontScaling={false} style={nameStyle}>{name}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text allowFontScaling={false} style={{ ...nameStyle, fontSize: 14 }}>{userName}</Text>
          <Text allowFontScaling={false} style={{ ...nameStyle, fontSize: 14 }}> | </Text>
          <Text allowFontScaling={false} style={{ ...nameStyle, fontSize: 14, textDecorationLine: "underline" }} onPress={this.onPressHandler}> {userLevel}</Text>
        </View>
      </View>
    );
  }

  onPressHandler = () => this.props.onLevelPress();

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
  

  selectPhotoTapped(){
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
        // const source = { uri: response.uri };
        this.setState({newImage : response.uri})

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.uploadImage(response.uri)
        .then(url => {          
          const currentUser = firebase.auth().currentUser
          firebase.database().ref('users/' + currentUser.uid + "/avatar")
          .set(url)
          .then(() => {

          });
        })
        .catch(error => {
          console.log(error)
        })
      }
    });
  }

};


const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: color.navPink
  },
  settingContainer: {
    flexDirection: "row"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    width: "100%"
  },
  nameStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 22,
    textAlign: "center",
    fontStyle: "normal",
    color: color.black,
    marginTop: 10,
  }
}