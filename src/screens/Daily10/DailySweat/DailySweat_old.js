import React, { Component } from "react";
import { View, Image, Text, Dimensions, ImageBackground, TouchableOpacity, Platform } from "react-native";
import { color } from "../../../modules/styles/theme"
import Video from "react-native-video"

const { height, width } = Dimensions.get('window');


export default class extends Component {

  render() {
    const { onRightArrowPress, onLeftArrowPress, name, imgUrl, reps } = this.props;

    if (Platform.OS === "ios") {
      videoStyle = { height: height * 1.50, width: width * 1.50, top: -20, zIndex: 0, backgroundColor: "#fff" };
      imageStyle = { height: height * 1.26, width: width * 1.26, top: -40, zIndex: 0};

    } else {
      videoStyle = { height: height * 1.50, width: width * 1.50, top: -20, zIndex: 0};
      imageStyle = { height: height * 1.26, width: width * 1.26, top: -65, zIndex: 0};
    }

    return (
      <View style={styles.container}>
        {
          name == '#LSFROLLCALL' ?
            <Image 
              style={imageStyle}
              source={{ uri: imgUrl }}
              resizeMode='contain'
            />
          :
            <Video
              style={videoStyle}
              source={{ uri: imgUrl }}
              ref={ref => this.currentVideo = ref}
              resizeMode="contain"
              repeat={true}
              fullscreen={true}
              controls={false}
              onLoad={() => { console.log("Video Loaded") }}
            />
        }
        

        <View style={{ width: width, height: 100, flexDirection: "row", backgroundColor: "transparent", position: "absolute", justifyContent: "space-between", alignItems: "center" }}>

          <TouchableOpacity activeOpacity={0.5} onPress={onLeftArrowPress}>
            <View style={{ width: 40, height: 50, backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
              <Image style={{ margin: 20 }} source={require('../images/carouselArrowLeft.png')} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={onRightArrowPress}>
            <View style={{ width: 40, height: 50, backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
              <Image style={{ margin: 20 }} source={require('../images/carouselArrowRight.png')} />
            </View>
          </TouchableOpacity>

          <View style={{ width: 173, height: 70, backgroundColor: '#f595a8', position: "absolute", justifyContent: "center", alignItems: "center", top: height * .42 }}>
            <Text             
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.highlighText}>{name.toUpperCase()}</Text>
            <Text 
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.highlighText}
            style={styles.highlighText}>{reps}</Text>
          </View>

        </View>

      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  mainTitle: {
    width: width,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    position: "absolute",
    top: height * .10
  },
  highlighText: {
    width: 130,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "right",
    color: 'white',
    flexWrap: "wrap"
  }

}


