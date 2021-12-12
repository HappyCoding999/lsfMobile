import React, { Component } from 'react';
import { InteractionManager, View, Text, Image, ImageBackground, ScrollView, TouchableOpacity, Dimensions, Modal, FlatList,TextInput,Linking} from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from 'react-native-elements';
import moment from 'moment';
import { LoadingComponent, MediumButton } from "../../components/common";
import { logo_white_love_seat_fitness,heart_like,heart_unlike} from "../../images";
import { isEmpty } from "lodash";
import { color,colorNew } from "../../modules/styles/theme";

const { height, width } = Dimensions.get('window');

const ESSANTIALS_ITEM_HEIGHT = (width * 1.5)/3;


export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLiked: false,
      item:props.data
    }

  }

  componentDidMount() {
    let handle = InteractionManager.createInteractionHandle();
    InteractionManager.clearInteractionHandle(handle);
  }

  render() {
    let uri;

    if (this.state.item.imgUrl != undefined) {
      uri = { uri: this.state.item.imgUrl }
    } else {
      uri = { uri: null }
    }
    return (
          <View style={{alignItems: "flex-start",justifyContent: "center",width:"100%",overflow: "hidden",height:"100%"}}>
            <ImageBackground imageStyle={{resizeMode: 'cover'}} style={{...styles.imageContainer}} source={uri}>
            {/*<TouchableOpacity 
                style={{ fleX: 1, justifyContent: 'center', alignItems: 'center'}}
                onPress={() => this._likeDislikeClicked()}
              >
                <View style={{...styles.heartContainer}}>
                  <Image source={this.state.isLiked ? heart_like : heart_unlike}/>
                </View>
              </TouchableOpacity>*/}
            </ImageBackground>  
            <Text style={[styles.gearTitleText,{fontSize: 16,marginBottom:5,marginTop:15}]}>{this.state.item.title}</Text>
            <Text style={[styles.gearTitleText,{fontSize: 12,marginBottom:5,marginTop: 0}]}>{this.state.item.price}</Text>
          </View>
    );
  }
  
  _likeDislikeClicked()
  {
    console.log("_likeDislikeClicked");
    if (this.props.onLikeClicked != undefined) {
      this.props.onLikeClicked();
    }
    const isLiked = !this.state.isLiked
    this.setState({isLiked});
  }


  shadowTop(elevation) {
    return {
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0.5 * (-elevation) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }

  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: '#b2b2b2',
      shadowOffset: { width: 0, height:(0.5 * (elevation+5))},
      shadowOpacity: 0.2,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }
  elevationShadowStyle(elevation) {
    return {
      marginTop: 20,
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }
}

const styles = {
  gearTitleText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft:5,
    color: "#000",
    marginTop: 10

  },
  imageContainer: {
    width:ESSANTIALS_ITEM_HEIGHT,
    height:ESSANTIALS_ITEM_HEIGHT,
    alignItems: "flex-end",
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor:colorNew.boxGrey,
    borderRadius:15,
  },
  heartContainer: {
    width:30,
    height:30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#fff",
    borderRadius:100,
    marginRight:10,
    marginTop:10
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  }
};