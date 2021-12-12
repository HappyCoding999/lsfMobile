import React, { PureComponent } from "react";
import firebase from "react-native-firebase";
import { ScrollView, View, Text, Dimensions, Image, TouchableOpacity,TextInput, Platform } from "react-native";
import { color,colorNew } from "../../../../../modules/styles/theme";
import { Incrementer, LargeButton } from "../../../../../components/common";
import { moderateScale } from "react-native-size-matters";
import { Dropdown } from 'react-native-material-dropdown';

// var ImagePicker = require('react-native-image-picker');
import {launchImageLibrary} from 'react-native-image-picker'
import ImagePicker from 'react-native-image-picker';
const width = Dimensions.get("window").width * 0.6;
const newWidth = Dimensions.get("window").width;

export default class extends PureComponent {
  state = {
    showVideoModal: false,
    isFrontImageEdited: false,
    isBackImageEdited: false,
    isSideImageEdited: false,
    frontImage: "",
    backImage: "",
    sideImage: "",
    lengthUnit: [{value: 'inches',}, {value: 'centimeters',}],
    weightUnit: [{value: 'kilograms',}, {value: 'pounds',}],
    loading: false
  };
  selectedUnitForWeight = "pounds";
  selectedUnitForWaist = "inches";
  selectedUnitForBicep = "inches";
  selectedUnitForThigh = "inches";
  selectedUnitForHip = "inches";


  weight = null;
  waist = null;
  biceps = null;
  thighs = null;
  hips = null;

  createdAt = Date.now();


  render() {
    const {
      container,
      title,
      modalHeaderText,
      subtitle
    } = styles;
    const { isForEdit } = this.props;
    return (
      <ScrollView contentContainerStyle={{flexDirection: "column",justifyContent: "center",alignItems: "center",width: "90%",marginHorizontal: 20,zIndex: 2,flexGrow: 1}} scrollEnabled={true}>
        <Text allowFontScaling={false} style={{...modalHeaderText, marginTop:10,marginBottom:10,fontSize:17,height: 35,marginTop:40}}>NEW PROGRESS ENTRY</Text>
        <Text onPress={this.props.howToPress} allowFontScaling={false} style={{...subtitle,fontSize: 9,marginBottom:10}}>LEARN HOW TO TAKE MEASUREMENTS</Text>
        {this._renderPhotos()}
        {this._renderIncrementers()}
        <View style={{ height: 50 }}></View>
        <LargeButton buttonViewStyle={{ width: moderateScale(200) }} onPress={this._onSubmit} containerStyle={{ marginTop: 10, marginBottom: 25 }}>
          { isForEdit ? "UPDATE" : "LOG IT"}
          </LargeButton>
        {/*<Image style={{ position: "absolute", top: 400, left: 5, zIndex: 0, width: 110, height: 66 }} source={require('./images/illustrationMeasuringtape.png')} />
        <Image style={{ position: "absolute", top: 550, left: 250, zIndex: 0, width: 120, height: 130 }} source={require('./images/illustrationNopainnochampagne.png')} />
        <Image style={{ position: "absolute", top: 740, left: 25, zIndex: 0, width: 100, height: 63 }} source={require('./images/illustrationYeah.png')} />*/}
      </ScrollView>
    );
  }

  _renderPhotos() {
    const { rowContainer, text } = styles;
    const { loading } = this.state;

    return (
      <View style={{ ...rowContainer, marginTop: 20 }}>
        {["FRONT", "BACK", "SIDE"].map((photoAngle, idx) => {

          const Photo = () => (
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              {this._renderPhoto(photoAngle)}
              <Text allowFontScaling={false} style={text}>{photoAngle}</Text>
            </View>
          );

          if (loading) {
            return <Photo key={idx} />;
          }

          return (
            <TouchableOpacity
              activeOpacity={.6}
              onPress={() => this.selectPhotoTapped(photoAngle)}
              key={idx}
            >
              <Photo />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  _renderPhoto(photoAngle) {
    const { photoFrame } = styles;
    const uri = {
      FRONT: this.state.frontImage,
      SIDE: this.state.sideImage,
      BACK: this.state.backImage
    }[photoAngle];

    return (
      <View style={photoFrame}>
        {uri === "" ?
          <Image style={{ width: 40, height: 46, alignSelf: "center" }} source={require('./images/iconCamera.png')} />
          :
          <Image style={{ width: 100, height: 100 }} source={{ uri }} />
        }
      </View>
    );
  }

  /*_renderIncrementers() {
    const { text,fieldHeader } = styles;

    const textStyle = {
      ...text,
      fontSize: 16,
      marginTop: 10,
      marginBottom: 10
    };
    const { latestMeasurement } = this.props;
    const { weight = 0, waist = 0, biceps = 0, thighs = 0, hips = 0 } = latestMeasurement

    return (
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32, zIndex: 1 }}>
        <Text allowFontScaling={false} style={textStyle}>Weight in pounds: </Text>
        <Incrementer
          onCountChange={val => console.log(val)}
          initialCount={weight}
          width={width}
          ref={inc => this.weight = inc}
        />
        <View style={{width:width*0.9, alignItems:"flex-start", justifyContent:"flex-start",margin:15}}>
          <Text allowFontScaling={false} style={{...fieldHeader}}>Waist Measurement</Text>
          <View style={{width:"100%", alignItems:"flex-start",flexDirection: "row", justifyContent:"flex-start"}}>
          <TextInput
            textAlign={'center'}
            editable={true}
            style={[styles.textInputStyle,{width:width*0.15,marginTop:20,textAlign: "left"}]}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(measuredWaist) => { this.waist = measuredWaist }}>{this.waist}</TextInput>
            <Dropdown
            label=''
            containerStyle={{width:width*0.22,marginTop: -20,marginLeft:20,marginRight:30}}
            onChangeText={(value,index,data) => { this.selectedUnitForWaist = value}}
            value={this.state.selectedUnitForWaist}
            data={this.state.lengthUnit}
            />
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32 }}>
          <Text allowFontScaling={false} style={textStyle}>Waist in inches: </Text>
        </View>
        <Incrementer
          onCountChange={val => console.log(val)}
          initialCount={waist}
          width={width}
          ref={inc => this.waist = inc}
        />
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32 }}>
          <Text allowFontScaling={false} style={textStyle}>Biceps in inches: </Text>
          <Incrementer
            onCountChange={val => console.log(val)}
            initialCount={biceps}
            width={width}
            ref={inc => this.biceps = inc}
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32 }}>

          <Text allowFontScaling={false} style={textStyle}>Thighs in inches: </Text>
          <Incrementer
            onCountChange={val => console.log(val)}
            initialCount={thighs}
            width={width}
            ref={inc => this.thighs = inc}
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 32 }}>

          <Text allowFontScaling={false} style={textStyle}>Hips in inches: </Text>
          <Incrementer
            onCountChange={val => console.log(val)}
            initialCount={hips}
            width={width}
            ref={inc => this.hips = inc}
          />
        </View>
      </View>
    )
  }*/

  _renderIncrementers() {
    const { text,fieldHeader } = styles;

    const textStyle = {
      ...text,
      fontSize: 16,
      marginTop: 10,
      marginBottom: 10
    };
    const { latestMeasurement,isForEdit,editIndex,measurements } = this.props;
    if (isForEdit) 
    {
      var data = measurements[editIndex]
      console.log("editIndex : " + editIndex);
      console.log("measurements : ");
      console.log(measurements[editIndex]);
      if (this.state.isFrontImageEdited == false && this.state.isSideImageEdited == false && this.state.isBackImageEdited == false) {
        this.setState({ 
            backImage:data["backImage"],
            frontImage:data["frontImage"],
            sideImage:data["sideImage"],
        }) 
      }
       
      this.selectedUnitForHip = data["hipUnit"]
      this.selectedUnitForThigh = data["thighUnit"]
      this.selectedUnitForBicep = data["bicepUnit"]
      this.selectedUnitForWaist = data["waistUnit"]
      this.selectedUnitForWeight = data["weightUnit"]

      this.weight = data["weight"];
      this.waist = data["waist"];
      this.biceps = data["biceps"];
      this.thighs = data["thighs"];
      this.hips = data["hips"];
      this.createdAt = data["createdAt"];
      
    }
    else
    {
      console.log("_renderIncrementers")
      console.log("latestMeasurement")
      console.log(latestMeasurement)
      const { weight = 0, waist = 0, biceps = 0, thighs = 0, hips = 0 } = latestMeasurement
      if (this.weight == null) {
        this.weight = weight;
        this.waist = waist;
        this.biceps = biceps;
        this.thighs = thighs;
        this.hips = hips;

        this.selectedUnitForHip = latestMeasurement["hipUnit"]
        this.selectedUnitForThigh = latestMeasurement["thighUnit"]
        this.selectedUnitForBicep = latestMeasurement["bicepUnit"]
        this.selectedUnitForWaist = latestMeasurement["waistUnit"]
        this.selectedUnitForWeight = latestMeasurement["weightUnit"]
      }

    }
    

    return (
      <View style={{ width:newWidth*0.75,justifyContent: "center", alignItems: "center", marginTop: 32, zIndex: 1}}>
        <View style={{width:newWidth*0.75, alignItems:"flex-start", justifyContent:"flex-start",margin:25}}>
          <Text allowFontScaling={false} style={{...fieldHeader}}>Weight</Text>
          <View style={{width:"100%", alignItems:"flex-start",flexDirection: "row", justifyContent:"flex-start"}}>
          <TextInput
            textAlign={'center'}
            editable={true}
            style={[styles.textInputStyle,{width:width,marginTop:20,textAlign: "left"}]}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(measuredWeight) => {this.weight = measuredWeight }}>{this.weight}</TextInput>
            <Dropdown
            label=''
            containerStyle={{width:"30%",marginTop: -20,marginLeft:20,marginRight:30}}
            onChangeText={(value,index,data) => { this.selectedUnitForWeight = value}}
            value={this.selectedUnitForWeight}
            data={this.state.weightUnit}
            />
          </View>
        </View>
        <View style={{width:newWidth*0.75, alignItems:"flex-start", justifyContent:"flex-start",margin:25}}>
          <Text allowFontScaling={false} style={{...fieldHeader}}>Waist Measurement</Text>
          <View style={{width:"100%", alignItems:"flex-start",flexDirection: "row", justifyContent:"flex-start"}}>
          <TextInput
            textAlign={'center'}
            editable={true}
            style={[styles.textInputStyle,{width:width*0.15,marginTop:20,textAlign: "left"}]}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(measuredWaist) => {this.waist = measuredWaist }}>{this.waist}</TextInput>
            <Dropdown
            label=''
            containerStyle={{width:width*0.35,marginTop: -20,marginLeft:20,marginRight:30}}
            onChangeText={(value,index,data) => { this.selectedUnitForWaist = value }}
            value={this.selectedUnitForWaist}
            data={this.state.lengthUnit}
            />
          </View>
        </View>
        <View style={{width:newWidth*0.75, alignItems:"flex-start", justifyContent:"flex-start",margin:25}}>
          <Text allowFontScaling={false} style={{...fieldHeader}}>Bicep Measurement</Text>
          <View style={{width:"100%", alignItems:"flex-start",flexDirection: "row", justifyContent:"flex-start"}}>
          <TextInput
            textAlign={'center'}
            editable={true}
            style={[styles.textInputStyle,{width:width*0.15,marginTop:20,textAlign: "left"}]}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(measuredBicep) => {this.biceps = measuredBicep }}>{this.biceps}</TextInput>
            <Dropdown
            label=''
            containerStyle={{width:width*0.35,marginTop: -20,marginLeft:20,marginRight:30}}
            onChangeText={(value,index,data) => { this.selectedUnitForBicep = value }}
            value={this.selectedUnitForBicep}
            data={this.state.lengthUnit}
            />
          </View>
        </View>
        <View style={{width:newWidth*0.75, alignItems:"flex-start", justifyContent:"flex-start",margin:25}}>
          <Text allowFontScaling={false} style={{...fieldHeader}}>Thigh Measurement</Text>
          <View style={{width:"100%", alignItems:"flex-start",flexDirection: "row", justifyContent:"flex-start"}}>
          <TextInput
            textAlign={'center'}
            editable={true}
            style={[styles.textInputStyle,{width:width*0.15,marginTop:20,textAlign: "left"}]}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(measuredThigh) => { this.thighs = measuredThigh}}>{this.thighs}</TextInput>
            <Dropdown
            label=''
            containerStyle={{width:width*0.35,marginTop: -20,marginLeft:20,marginRight:30}}
            onChangeText={(value,index,data) => { this.selectedUnitForThigh = value}}
            value={this.selectedUnitForThigh}
            data={this.state.lengthUnit}
            />
          </View>
        </View>
        <View style={{width:newWidth*0.75, alignItems:"flex-start", justifyContent:"flex-start",margin:25}}>
          <Text allowFontScaling={false} style={{...fieldHeader}}>Hip Measurement</Text>
          <View style={{width:"100%", alignItems:"flex-start",flexDirection: "row", justifyContent:"flex-start"}}>
          <TextInput
            textAlign={'center'}
            editable={true}
            style={[styles.textInputStyle,{width:width*0.15,marginTop:20,textAlign: "left"}]}
            placeholder={""}
            placeholderTextColor={color.mediumGrey}
            onChangeText={(measuredHip) => { this.hips = measuredHip }}>{this.hips}</TextInput>
            <Dropdown
            label=''
            containerStyle={{width:width*0.35,marginTop: -20,marginLeft:20,marginRight:30}}
            onChangeText={(value,index,data) => { this.selectedUnitForHip = value}}
            value={this.selectedUnitForHip}
            data={this.state.lengthUnit}
            />
          </View>
        </View>
      </View>
    )
  }

  _onSubmit = () => {

    const {
      weight,
      waist,
      biceps,
      thighs,
      hips,
      createdAt,
      selectedUnitForWeight,
      selectedUnitForHip,
      selectedUnitForWaist,
      selectedUnitForBicep,
      selectedUnitForThigh
    } = this;

    const measurementsData = {
      weight: parseFloat(weight),
      waist: parseFloat(waist),
      biceps: parseFloat(biceps),
      thighs: parseFloat(thighs),
      hips: parseFloat(hips),
      weightUnit: selectedUnitForWeight,
      hipUnit: selectedUnitForHip,
      waistUnit: selectedUnitForWaist,
      bicepUnit: selectedUnitForBicep,
      thighUnit: selectedUnitForThigh,
      createdAt: createdAt,
    };
    const { isForEdit,editIndex,measurements } = this.props;
    this._uploadImages()
      .then(urls => {
        const [frontImage, backImage, sideImage] = urls;
        if (isForEdit) 
        {
          measurements[editIndex] = {
            ...measurementsData,
            frontImage,
            backImage,
            sideImage
          }
         this.props.updateMeasurement(measurements);
        }
        else
        {
          this.props.onSubmit({
            ...measurementsData,
            frontImage,
            backImage,
            sideImage
          });  
        }
      });

    this.props.onClose();
  };

  selectPhotoTapped(captureButton) {

    this.setState({
      loading: true
    });
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

     const options = {
      title: 'Add photo using below options',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: Platform.OS === "ios" ? 0.5 : 0.7,
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response.uri);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({
          loading: false
        })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({
          loading: false
        })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        if (captureButton == "FRONT") {

          this.setState({
            frontImage: response.uri,
            isFrontImageEdited : true,
            loading: false
          });

        } else if (captureButton == "BACK") {

          this.setState({
            backImage: response.uri,
            isBackImageEdited : true,
            loading: false
          });

        } else if (captureButton == "SIDE") {

          this.setState({
            sideImage: response.uri,
            isSideImageEdited : true,
            loading: false
          });
        }
      }
    });
  }

  async _uploadImages() {
    const {
      frontImage,
      backImage,
      sideImage,
      isFrontImageEdited,
      isBackImageEdited,
      isSideImageEdited
    } = this.state;
    var data = [];
    const { isForEdit } = this.props;
    if (isForEdit) {
      if (isFrontImageEdited) {
        data.push(frontImage);
      }
      if (isBackImageEdited) {
        data.push(backImage);
      }      
      if (isSideImageEdited) {
        data.push(sideImage);
      }      
    }
    else
    {
      data = [frontImage, backImage, sideImage]
    }
    console.log("Vishal : data.length")
    console.log(data.length)

    var paths = data.length > 0 ? data.map(path => this._uploadImage(path)) : [frontImage, backImage, sideImage];
      
    console.log("Vishal : paths")
    console.log(paths);

    if (isForEdit && !(isFrontImageEdited && isBackImageEdited && isSideImageEdited)) {
      if (isFrontImageEdited == false) {
        paths[0] = frontImage;
      }
      if (isBackImageEdited == false) {
        paths[1] = backImage;
      }      
      if (isSideImageEdited == false) {
        paths[2] = sideImage;
      }      
    }
    return Promise.all(paths);
  }

  _uploadImage = (path, mime = 'application/octet-stream') => {
    if (path.length === 0) {
      return Promise.resolve(null);
    }

    const sessionId = new Date().getTime();
    const imageRef = firebase.storage().ref("measurementImages/").child(sessionId + ".png");

    console.log(imageRef);

    return imageRef.putFile(path, { contentType: mime })
      .then(() => {
        return imageRef.getDownloadURL();
      })
      .catch(err => console.log(err.stack));
  };

};

const styles = {
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginHorizontal: 20,
    zIndex: 2,
    flexGrow: 1
  },
  modalHeaderText: {
    width: "90%",
    height: "15%",
    marginTop:50,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink
  },
  subtitle: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: colorNew.teal,
    textDecorationLine: "underline"
  },
  rowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    marginTop: 20
  },
  textInputStyle: {
    flex:1,
    paddingTop: 0,
    paddingBottom: 2,
    textAlignVertical: 'bottom',
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    borderBottomColor: colorNew.boxGrey, 
    borderBottomWidth: 1,     
    fontSize: 16
  },
  fieldHeader: {
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "left",
    color: colorNew.borderGrey
  },
  photoFrame: {
    width: 100,
    height: 100,
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  }
};