import React, { Component } from "react";
import { ScrollView, View, Image,TouchableOpacity,Text,Dimensions, Modal } from "react-native";
import { chunk, flow, map } from "lodash/fp";
import { Header } from 'react-native-elements';
import { ic_back_white, cancel_round_cross} from "../../images";

const { height, width } = Dimensions.get('window');

import Photo from "./Photo";

export default class Trophies extends Component {

  constructor(props) {
    super(props);

    this._onPhotoModalClose = this._onPhotoModalClose.bind(this);
    this._renderPhotoRow = this._renderPhotoRow.bind(this);
    this._onPhotoPress = this._onPhotoPress.bind(this);
    
    this.photos = [];
    this.state = initialState;
  }
  componentDidMount() {
    this.addProgressPhotosToState();
  }
  addProgressPhotosToState()
  {
    console.log("addProgressPhotosToState 1: ")
    const { measurements } = this.props.screenProps;
    var photos = [];
    if(measurements != undefined && measurements.length > 0)
    {
      for(const measurement of measurements) 
      {
        console.log(measurement);
        let frontImage = measurement.frontImage ? measurement.frontImage : "";
        console.log(frontImage);
        if (frontImage.length > 0) {
          photos.push(frontImage);
        }
        let backImage = measurement.backImage ? measurement.backImage : "";
        console.log(backImage);
        if (backImage.length > 0) {
          photos.push(backImage);
        }
        let sideImage = measurement.sideImage ? measurement.sideImage : "";
        console.log(sideImage);
        if (sideImage.length > 0) {
          photos.push(sideImage);
        }
      }
      console.log("\n\n\nphotos : ====>");
      console.log(photos);
      this.setState({ progressPhotos : photos})
      setTimeout(() => {
        console.log("\n\n\nthis.state.progressPhotos : ====>");
        console.log(this.state.progressPhotos);
      }, 500)
    }
    else
    {
    }
  }

static defaultProps = {
  doAnimateZoomReset: false,
  maximumZoomScale: 2,
  minimumZoomScale: 1,
  zoomHeight: height, 
  zoomWidth: width,
}
handleResetZoomScale = (event) => {
  this.scrollResponderRef.scrollResponderZoomTo({ 
     x: 0, 
     y: 0, 
     width: this.props.zoomWidth, 
     height: this.props.zoomHeight, 
     animated: true 
  })
}
setZoomRef = node => { //the ScrollView has a scrollResponder which allows us to access more methods to control the ScrollView component
  if (node) {
    this.zoomRef = node
    this.scrollResponderRef = this.zoomRef.getScrollResponder()
  }
}
  _renderPhotoModal = () => {

    const { focusedPhoto,showPhotoShareModal} = this.state;

    console.log("_renderPhotoModal");
    console.log(focusedPhoto);

    return (
      <Modal animationType='slide' visible={showPhotoShareModal} onRequestClose={() => this.setState({showPhotoShareModal: false})}>
        <View style={{ flex: 1}}>
          <Header 
            leftComponent={
              <TouchableOpacity onPress={() => this.setState({showPhotoShareModal: false})}>
                <Image style={{ tintColor:"#000"}} source={cancel_round_cross} />
              </TouchableOpacity>
            }
            centerComponent={{ text: '', style: styles.headerTitle }} 
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <View style={{ flex: 1 , width: "100%" , justifyContent:"center",alignItems:"center"}}>
          <ScrollView
            contentContainerStyle={{ alignItems: "center", justifyContent: 'center' }} //flexbox styles centerContent //centers content when zoom is less than scroll view bounds 
            maximumZoomScale={this.props.maximumZoomScale}
            minimumZoomScale={this.props.minimumZoomScale}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={this.setZoomRef} //helps us get a reference to this ScrollView instance
            style={{ overflow: 'hidden',flex:1 }}
           >
           <View style={{ width: width, justifyContent: 'center', alignItems: 'center', height: height*0.9}}>
            {
              <Image style={{ resizeMode:"center", width: width,height: "100%", backgroundColor: 'transparent'}} source={{ uri: focusedPhoto }} />
            }
            </View>
          </ScrollView>
        </View>
        </View>
      </Modal>
    );
  }

  render() {
    console.log("render progressPhotos");
    const { container } = styles;
    const { showPhotoShareModal, focusedTrophy } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
        <View style={{justifyContent:"center"}}>
          <View style={{position: "absolute",height:50,zIndex: 3,width:50,marginLeft:10,justifyContent:"center",alignItems:"center"}}>
            {/*<TouchableOpacity style={{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}} onPress={() => this.props.onClose()}>
              <Image style={{ height: '90%',top:0,tintColor:"#000"}} resizeMode="contain" source={ic_back_white} />
            </TouchableOpacity>*/}
          </View>
          <Text style={{ fontFamily: 'Sofia Pro', color: '#000', fontSize: 25, fontWeight: 'bold', textAlign: 'center',width:"100%",padding:40}}>
            Progress Photos
          </Text>
          <View style={{position: "absolute",height:50,zIndex: 0,width:50,marginLeft:width-70,justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity onPress={() => this.props.onClose()}>
              <Image style={{ height: '90%',top:0,tintColor:'#000'}} resizeMode="contain" source={cancel_round_cross} />
              </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={container} >
          {this._renderPhotos()}
        </ScrollView>
        {this._renderPhotoModal()}
      </View>
    );
  }

  _showPhotoModal() {
    this.setState({
      showPhotoShareModal: true
    });
  }

  _renderPhotos() {
    console.log("_renderPhotos called")
    const { progressPhotos } = this.state;
    return this._processPhotos(progressPhotos);
  }

  _processPhotos(photos) {
    return flow(
      chunk(3),
      map(this._renderPhotoRow)
    )(photos);
  }

  _renderPhotoRow(photos) {
    console.log("_renderPhotoRow : ")
    // console.log(photos)
    const [photo1, photo2, photo3] = photos;
    console.log("photo1")
    console.log(photo1)
    console.log("photo2")
    console.log(photo2)
    console.log("photo3")
    console.log(photo3)
    
    const { rowContainer, leftTrophy, middleTrophy, rightTrophy } = styles;
    
    
    const key = (photo1 ? photo1 : "") + (photo2 ? photo2 : "") + (photo3 ? photo3 : "");
    // var trophy1Img;
    // var trophy2Img;
    // var trophy3Img;
    // if (trophy1) {
    //   trophy1Img = trophy1.active ? trophy1.imgUrl : trophy1.imgUrlGrey != undefined ? trophy1.imgUrlGrey : ""
    // }
    // if (trophy2) {
    //   trophy2Img = trophy2.active ? trophy2.imgUrl : trophy2.imgUrlGrey != undefined ? trophy2.imgUrlGrey : ""
    // }
    // if (trophy3 && trophy3.active != undefined) {
    //   console.log("trophy3")
    //   console.log(trophy3)
    //   trophy3Img = trophy3.active == false ? (trophy3.imgUrlGrey != undefined ? trophy3.imgUrlGrey : "" ) : trophy3.imgUrl
    //   console.log(trophy3Img)
    // }
    let item_height = 70;
    return (
      <View key={key} style={rowContainer}>
        { photo1 ? 
            <View style={leftTrophy}>
              <Photo 
                width={80} 
                height={item_height} 
                uri={photo1} onPress={() => this._onPhotoPress(photo1)}
              />
            </View>
          :
          <View style={leftTrophy} />
        }

        { photo2 ?
            <View style={middleTrophy}>
              <Photo 
                width={80} 
                height={item_height} 
                uri={photo2} onPress={()=> this._onPhotoPress(photo2)}
              />
            </View>
          :
          <View style={middleTrophy} />
        }

        { photo3 ?
            <View style={rightTrophy}>
              <Photo 
                width={80} 
                height={item_height} 
                uri={photo3} onPress={()=> this._onPhotoPress(photo3)}
              />
            </View>
          :
          <View style={rightTrophy} />
        }

      </View>
    );
  }

  _onPhotoPress(imgUrl) {
    // console.log("_onPhotoPress : ");
    // console.log(imgUrl);
    // return;

    if (this.props.onImageSelection != undefined) {
      this.props.onImageSelection(imgUrl);
      this.props.onClose()
    }
    else
    {
        this.setState({
        showPhotoShareModal: true,
        focusedPhoto: imgUrl
      });  
    }
  }

  _onPhotoModalClose() {
    this.setState({
      showPhotoShareModal: false,
      focusedPhoto: initialState.focusedPhoto
    });
  }
}

const initialState = {
  photoRows: [],
  progressPhotos: [],
  showPhotoShareModal: false,
  focusedPhoto: null
};


const styles = {
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    flex: 1,
    marginTop: 40
  },
  leftTrophy: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  middleTrophy: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  rightTrophy: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
};