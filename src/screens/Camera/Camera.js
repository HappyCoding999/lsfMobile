import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity} from "react-native";
import { RNCamera} from 'react-native-camera';
import {color} from "../../modules/styles/theme"

export default class Camera extends Component {

    render() {
      return (
        <View style={styles.container}>
          <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style = {styles.preview}
              type={RNCamera.Constants.Type.front}
              flashMode={RNCamera.Constants.FlashMode.off}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              onGoogleVisionBarcodesDetected={({ barcodes }) => {
                console.log(barcodes)
              }}
          />
          <TouchableOpacity
            onPress={this.props.onCancelPress}
            style={{width: 44, height: 44, position: "absolute", top: 30, left: 14}}>
            <Image style={{width: 18, height: 18}} source={require("./images/iconXWhite.png")}/>
          </TouchableOpacity>
          <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
          <TouchableOpacity
              onPress={() => this.takePicture(this.camera)}
              style = {styles.capture}>
          </TouchableOpacity>
          </View>
        </View>
      );
    }
  
    takePicture = async function(camera) {

      if (camera) {
        const options = { 
          quality: 0.5, 
          base64: false,
          forceUpOrientation: true,
          fixOrientation: true,
          mirrorImage: true,
          exif: true,
          orientation: "portrait" };
        const data = await camera.takePictureAsync(options)
        return this._onPictureTaken(data.uri)
        
      }
    };

    _onPictureTaken(uri){
      return this.props.onPictureTaken(uri)
    }
  }
  
const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      capture: {
        backgroundColor: "#fff",
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
        borderRadius: 50,
        width: 60,
        height: 60
      }

}


