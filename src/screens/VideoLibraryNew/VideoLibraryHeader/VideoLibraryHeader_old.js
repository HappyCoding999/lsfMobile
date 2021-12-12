import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity,Dimensions,TouchableHighlight } from "react-native";
import { color,colorNew } from "../../../modules/styles/theme";
import firebase from "react-native-firebase"
import Carousel from "../../../components/common/Carousel";
import { Pagination } from 'react-native-snap-carousel';

var ImagePicker = require('react-native-image-picker');

const { width,height} = Dimensions.get("window");
const itemRatio = 125/160
const SLIDER_WIDTH = width;
const ITEM_WIDTH = SLIDER_WIDTH;

const SLIDER_1_FIRST_ITEM = 1;

export default class extends Component {

  state = {
    newImage: null,
    entries: [
                { 
                  thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhbhfullbody.jpg?alt=media&token=29a854cf-56f3-40d5-843a-1694206c384d',
                  category: 'Workouts',
                  videoDescription: 'Strengthen, tone, & burn crazy calories in just 20 minutes',
                  videoName: '20 Minute Hot Body HIIT - Full Body Burn',
                  subcategory: 'HIIT Workouts',
                  videoUrl: 'https://lsfvideolibrary.s3-us-west-1.amazonaws.com/20minhbhfullbody/playlist.m3u8' 
                },
                { 
                  thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhittabsarms.jpg?alt=media&token=cbdc0488-3010-4601-9ab8-2a2334476d23',
                  category: 'Workouts',
                  videoDescription: 'Sculpt & shape your arms and abs while burning serious calories',
                  videoName: '20 Minute Hot Body HIIT - Arms & Abs',
                  subcategory: 'HIIT Workouts',
                  videoUrl: 'https://lsfvideolibrary.s3-us-west-1.amazonaws.com/20minhbharmsabs/playlist.m3u8' 
                },
                { 
                  thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F10minfinisher.jpg?alt=media&token=6238df3d-4471-481e-8f11-a53971d911e9',
                  category: 'Workouts',
                  videoDescription: 'Torch calories and every inch in just 10 minutes!',
                  videoName: '10 Minute Full Body Finisher',
                  subcategory: 'HIIT Workouts',
                  videoUrl: 'https://lsfvideolibrary.s3-us-west-1.amazonaws.com/10minfinisher2020/playlist.m3u8' 
                }
              ],
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM
  };
  _renderCarousel = ({item, index}) => {
        return (
          <TouchableHighlight
            onPress={() => this._checkVideoPaywall(item)}
            underlayColor={color.lightGrey}>
            <View style={styles.itemContainer}>
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: item.thumbnailUrl }}
                  resizeMode="cover" />
            </View>
            </TouchableHighlight>
        );
  }
  render() {
    const { name, userName, userLevel, avatar, membership } = this.props;
    const { newImage,slider1ActiveSlide } = this.state;
    const { container, nameStyle, subtitleStyle} = styles;

    return (
      <View style={container}>
      <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.entries}
              loop={true}
              renderItem={this._renderCarousel}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              firstItem={SLIDER_1_FIRST_ITEM}
              containerCustomStyle={styles.carouselContainer}
              autoplay={false}
              onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
      />
      <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center",position: "absolute",}}>
              <View style={{justifyContent: "space-between",width:"100%",justifyContent: "flex-start", alignItems: "flex-start"}}>
          <TouchableOpacity
          onPress={()=> this.selectPhotoTapped()}>
          {avatar ?
            <Image source={{ uri: newImage || avatar }} resizeMode="cover" style={{ width: 60, height: 60, borderRadius: 60 }} />
            :
            <Image style={{ width: 80, height: 80, borderRadius: 40 }}/>
          }
          </TouchableOpacity>
      </View>
        <View style={{width:width,paddingLeft:18}}>
          <Text allowFontScaling={false} style={nameStyle}>Brand New</Text>
          <Text allowFontScaling={false} style={nameStyle}>Videos</Text>
          <Text allowFontScaling={false} style={subtitleStyle}>Spring Slim Down Workouts</Text>
        </View> 
        <View style={{width:width,paddingLeft:width*0.7,justifyContent:'flex-end'}}> 
          <Pagination
                  dotsLength={3}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotStyle={styles.paginationDot}
                  inactiveDotStyle={styles.paginationDotInactive}
                  dotColor="#f08fa3"
                  inactiveDotColor="#fff"
                  inactiveDotOpacity={1}
                  inactiveDotScale={1}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
        </View> 
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
    height:((height *300)/896),
    backgroundColor: colorNew.bgGrey
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
  carouselContainer: {
    marginTop: 0,
    height:"100%",
    marginBottom: 0
  },
  subtitleStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "left",
    fontStyle: "normal",
    color: color.white,
    marginTop: 2,
  },
  paginationContainer: {
        paddingVertical: 8,
        paddingBottom: 25,
    },
    paginationDot: {
      marginTop: 0,
      marginBottom: 5,
      width: 8,
      height: 8,
      borderWidth: 0.5,
      borderRadius: 4,
      borderColor: colorNew.white,
      marginHorizontal: 1
    },
    paginationDotInactive: {
      marginTop: 0,
      marginBottom: 5,
      width: 8,
      height: 8,
      borderWidth: 0,
      borderRadius: 4,
      marginHorizontal: 1
    },
  nameStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "bold",
    fontSize: 36,
    lineHeight: 38,
    textAlign: "left",
    fontStyle: "normal",
    color: color.white,
    marginTop: 10,
  }
}