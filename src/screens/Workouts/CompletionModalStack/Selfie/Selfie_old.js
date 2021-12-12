import React, { Component } from "react";
import { View, Text, Image, StyleSheet, Linking, Alert, Dimensions, CameraRoll, Platform, ImageBackground, PermissionsAndroid } from "react-native";
import { color } from "../../../../modules/styles/theme";
import { LargeButton } from "../../../../components/common";
import { captureRef } from "react-native-view-shot";

const { width } = Dimensions.get("window");

export default class Selfie extends Component {
  constructor(props) {
    super(props);

    this._postToInstagram = this._postToInstagram.bind(this);
    this.state = {
      imageUrl: this.props.shareImage,
      shareImage: "",
    }
  }

  render() {

    const { challengeActive, challengeSelfieFrame } = this.props;

    const selfieFrame = (challengeActive)
    ? { uri: challengeSelfieFrame }
    : require("./images/Sweaty_Selfies-01.jpg");

    return (
      <View style={styles.container}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Text allowFontScaling={false} style={styles.sweatySelfie}>Sweaty Selfie</Text>
        </View>
        <View ref="snapshot" options={{ format: "png", quality: 0.9 }} collapsable={false}>
          <View style={{ justifyContent: "center", alignContent: "center", textAlign: "center" }}>
            {
              this.state.imageUrl == null ? 
              <Image
                width={width}
                style={styles.polaroid}
                source={selfieFrame}
                resizeMode='center'/>

               :

              <View>  
                <Image
                  width={width}
                  style={styles.polaroid}
                  source={selfieFrame}
                  resizeMode='contain'/>
                  <Image style={{position: "absolute", top: 53, left: 53, width: 210, height: 209, backgroundColor: "#fff"}} source={{uri: this.state.imageUrl}} resizeMode={"cover"}
                  />
              </View>
            }
          </View>
        </View>
        <View style={styles.btnView}>
          <LargeButton
            onPress={this._postToInstagram}>
            POST TO INSTAGRAM
          </LargeButton>
        </View>
      </View>
    );
  }

  _requestStoragePermission = () => {
    try {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Love Sweat Fitness Storage Permission',
          message:
            'Love Sweat Fitness would like to save photos to your photo ' +
            'gallery to save and share images. Your photos wont be shared without your permission.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }

  _postToInstagram() {

    captureRef(this.refs["snapshot"], {
      format: "jpg",
      quality: 0.8
    })
    .then(
      uri => this._send(uri),
      error => alert("Oops, snapshot failed", error)
    );
  }

  _send(uri) {
    if (Platform.OS === 'android') {

      this._requestStoragePermission().then(granted => {
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          CameraRoll.saveToCameraRoll(uri, 'photo')
            .then(() =>
              Linking.openURL('http://instagram.com'))
            .catch(err => console.log('err:', err))
       }
      })

  } else {

    CameraRoll.saveToCameraRoll(uri, 'photo')
      .then(()=> {
        Linking.openURL('instagram://library?OpenInEditor=1&LocalIdentifier=' + this.state.imageUrl)
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 10
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  sweatySelfie: {
    flex: 1,
    width: width,
    height: 120,
    fontFamily: "Northwell",
    fontSize: 64,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center",
  },
  polaroid: {
    width: "100%",
    height: 345,
    justifyContent: "center",
    overflow: "hidden"
  },
  btnView: {
    marginTop: Platform.OS === 'ios' ? 65 : 28
  },
  btnText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
})
