import React, { Component } from "react";
import { View, Text, Image, StyleSheet,TouchableHighlight, 
  TouchableOpacity, Linking, Platform, 
  ScrollView, Dimensions, NativeModules, 
  Modal,TextInput } from "react-native";
import { SearchBar } from 'react-native-elements';
import { color, colorNew } from "../../modules/styles/theme";

import { subscribeUserToEmailList } from '../../utils';
import firebase from 'react-native-firebase';
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-navigation"
import { BottleFillingUp, SmallBottleFillingUp} from "../../components/common/AnimatedComponents";
import { HeaderPink } from "../../components/common";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LottieView from 'lottie-react-native';


const ProdChecker = NativeModules.ProdChecker;

const { height, width } = Dimensions.get('window');

const button_cancel_black = require('./images/cancel_black.png');


import SectionListContacts from 'react-native-sectionlist-contacts'


class InviteFriend extends Component {

  constructor(props) {
    super(props)
    this.onSendInvite = this.onSendInvite.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this._renderSideAlphabets = this._renderSideAlphabets.bind(this);
    

    let nameData=[
        {name:'abc',id:'abc1',params: ''},
        {name:'abd',id:'abd1',params: '123'},
        {name:'bcd'},
        {name:'%……&'},
        {name:'bce'},
        {name:'cde'},
        {name:'cdf'},
        {name:'def'},
        {name:'deg'},
        {name:'efg'},
        {name:'efh'},
        {name:'fgh'},
        {name:'fgi'},
        {name:'ghi'},
        {name:'hij'},
        {name:'ijk'},
        {name:'jkl'},
        {name:'klm'},
        {name:'lmn'},
        {name:'mno'},
        {name:'nop'},
        {name:'opq'},
        {name:'pqr'},
        {name:'qrs'},
        {name:'rst'},
        {name:'stu'},
        {name:'tuv'},
        {name:'**&&&&'},
    ]

    this.state = {
      showMessageWindow:'',
      search:'',
      challangeInputText:'',
      dataArray: nameData,
      filteredArray: [],
      showAnimation: false
    }
  }

  async componentDidMount() {
    
  }
 
  hideInfo() {
    console.log("hideInfo")
      this.setState({
      showInfoModal: false,
    })
  }
  _clickedItem=(item)=>{
    console.log("_clickedItem");
    console.log(item);
  }
  _renderItem=(item,index,section)=>{
    console.log('---custom-renderItem--',item,index,section)
    return (
      <View style={{width:width*0.65,flex:1,marginTop:10,justifyContent:"center",alignItems:"flex-start"}}>
        {index == 0 ? null : <View style={{width:width*0.65,height:1,marginBottom:15,justifyContent:"center",alignItems:"flex-start",backgroundColor:"#e2e2e2"}} />}
        <TouchableOpacity style={{width:"100%",height:"100%"}} onPress={() => this._clickedItem(item)}>
          <Text style={{marginBottom:10}}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  _renderHeader=(params)=>{
    console.log('---custom-renderHeader--',params)
    return (
      <View style={{width:width*0.80,height:40,justifyContent:"center",alignItems:"flex-start",backgroundColor:"#fff"}}>
        <Text style={{marginTop:10,fontWeight:"bold",fontSize:20}}>{params.key}</Text>
      </View>
    )
  }
  updateSearch = (search) => {
    console.log(search);
    let arrayData = this.state.dataArray
    let text = search.toLowerCase()
    let filteredArray = arrayData.filter((item) => { // search from a full list, and not from a previous search results list
      console.log("check ==> item");
      console.log(item);
      const itemData = item.name ? item.name.toLowerCase() : ''.toLowerCase();
      console.log("itemData");
      console.log(itemData);
      console.log("itemData results");
      console.log(itemData.indexOf(text));
      return itemData.indexOf(text) == 0;
    })
    console.log("filteredArray");
    console.log(filteredArray);
    this.setState({ search,filteredArray});
  };
  renderList()
  {
    const { search,filteredArray } = this.state;
    if (filteredArray.length == 0 && search.length > 0) {
      return (<Text style={{marginBottom:"80%"}}>Search result not found</Text>);
    }
    else if (filteredArray.length > 0 && search.length > 0) {
      return(
        <SectionListContacts
                  ref={s=>this.sectionList=s}
                  sectionListData={this.state.filteredArray}
                  sectionHeight={40}
                  showAlphabet={true}
                  letterViewStyle={{width:12,height:"100%"}}
                  letterTextStyle={{fontSize:9,color:"#b2b2b2"}}
                  initialNumToRender={this.state.dataArray.length}
                  showsVerticalScrollIndicator={false}
                  renderItem={this._renderItem}
                  renderHeader={this._renderHeader}
                  SectionListClickCallback={(item,index)=>{
                     console.log('---SectionListClickCallback--:',item,index)
                  }}
                  otherAlphabet="#"
                />
      );
    }
    else
    {
      return(
        <SectionListContacts
                  ref={s=>this.sectionList=s}
                  sectionListData={this.state.dataArray}
                  sectionHeight={40}
                  showAlphabet={true}
                  letterViewStyle={{width:12,height:"100%"}}
                  letterTextStyle={{fontSize:9,color:"#b2b2b2"}}
                  initialNumToRender={this.state.dataArray.length}
                  showsVerticalScrollIndicator={false}
                  renderItem={this._renderItem}
                  renderHeader={this._renderHeader}
                  SectionListClickCallback={(item,index)=>{
                     console.log('---SectionListClickCallback--:',item,index)
                  }}
                  otherAlphabet="#"
                />
      );
    }
  }
  renderMain() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    console.log("renderMain == >");
    const { search } = this.state;
    return (
      <View style={styles.container}>
        <View style={{flex:1,justifyContent: 'flex-end', alignItems: 'center', width: '100%'}}>
          <View style={{height:40,justifyContent: 'center', alignItems: 'center', width: '90%',marginTop:15,backgroundColor:"transparent",borderWidth:1,borderRadius:100}}>
            <SearchBar
              placeholder="SEARCH CONTACTS"
              round={true}
              inputStyle={{backgroundColor:'transparent',fontSize:12}}
              placeholderTextColor={colorNew.boxGrey}
              inputContainerStyle={{backgroundColor:'#fff',flex:1,borderTopColor: '#ffffff'}}
              containerStyle={{width:"100%",height:"100%",backgroundColor:'transparent',borderBottomColor: 'transparent',borderTopColor: 'transparent',marginBottom:10}}
              onChangeText={this.updateSearch}
              value={search}
            />
          </View>
          <View style={{flex:1,justifyContent: 'center', alignItems: 'center', width: '90%',flexDirection:"row"}}>
            <View style={{height:"90%",justifyContent: 'center',marginTop:"5%", alignItems: 'center', width: '100%',padding:10,borderRadius:20,borderWidth:1,borderColor:"#b2b2b2"}}>
              {this.renderList()}
            </View>     
            {/*<View style={{height:"90%",marginTop:20,justifyContent: 'center', alignItems: 'center', width: '10%'}}>
              {this._renderSideAlphabets('A',0)}
              {this._renderSideAlphabets('B',1)}
              {this._renderSideAlphabets('C',2)}
              {this._renderSideAlphabets('D',3)}
              {this._renderSideAlphabets('E',4)}
              {this._renderSideAlphabets('F',5)}
              {this._renderSideAlphabets('G',6)}
              {this._renderSideAlphabets('H',7)}
              {this._renderSideAlphabets('I',8)}
              {this._renderSideAlphabets('J',9)}
              {this._renderSideAlphabets('K',10)}
              {this._renderSideAlphabets('L',11)}
              {this._renderSideAlphabets('M',12)}
              {this._renderSideAlphabets('N',13)}
              {this._renderSideAlphabets('O',14)}
              {this._renderSideAlphabets('P',15)}
              {this._renderSideAlphabets('Q',16)}
              {this._renderSideAlphabets('R',17)}
              {this._renderSideAlphabets('S',18)}
              {this._renderSideAlphabets('T',19)}
              {this._renderSideAlphabets('U',20)}
              {this._renderSideAlphabets('V',21)}
              {this._renderSideAlphabets('W',22)}
              {this._renderSideAlphabets('X',23)}
              {this._renderSideAlphabets('Y',24)}
              {this._renderSideAlphabets('Z',25)}
              {this._renderSideAlphabets('#',26)}
            </View>*/}
          </View>     
        </View> 
      </View>
    );
  }
  _renderSideAlphabets=(letter,index)=>{
    return (
      <View style={{width:"100%",flex:1,justifyContent:"center"}}>
        <Text style={{width:"100%",height:10,marginTop:0,fontWeight:"400",fontSize:9,textAlign:"center"}}>{letter}</Text>
      </View>
    )
  }
  _navigationLeftButtonPressed ()
  {
    console.log("_navigationLeftButtonPressed")
  }
  _navigationRightButtonPressed ()
  {
    console.log("_navigationRightButtonPressed")
  }
  render() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    
      return (
        <KeyboardAwareScrollView contentContainerStyle={{justifyContent: "flex-start",alignItems: "center",width: width}} scrollEnabled={true}>
        <View style={{ width: width, backgroundColor: "#fff", marginTop: 0,height:height}}>
          <View style={[{width:"100%",height:100,justifyContent:"flex-end"}]}>
            <HeaderPink useGradient={false} onLeftPress={this._navigationLeftButtonPressed.bind(this)} onRightPress={this._navigationRightButtonPressed.bind(this)}/>
          </View>
          <View style={{width:"100%",flex:1,backgroundColor:"#232"}}>
            <View style={{justifyContent:"center",width:"100%",backgroundColor:colorNew.mediumPink}}>
              <Text style={{ fontFamily: 'Sofia Pro', color: '#fff', fontSize: 25, fontWeight: 'bold', textAlign: 'center',width:"100%",padding:30}}>
                Invite Friend
              </Text>
              <View style={{position: "absolute",height:30,zIndex: 0,width:30,marginLeft:width-45,justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity onPress={() => this.props.onClose()}>
                  <Image style={{ height: '90%',top:0,tintColor:'#fff'}} resizeMode="contain" source={button_cancel_black} />
                  </TouchableOpacity>
              </View>
            </View>
            <View style={{width:"100%",flex:1,backgroundColor:"#fff"}}>
              {this.renderMain()}
            </View>
            <View style={{width:"100%",height:100,justifyContent:"center",alignItems:"center",backgroundColor:"#fff"}}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={colors}
              style={styles.buttonGradient}>
              <TouchableHighlight
                style={styles.buttonStyle}
                onPress={this.onSendInvite}
                underlayColor={'#ee90af'}>
                <Text allowFontScaling={false} style={styles.sendButtonText}>Send Invite</Text>
              </TouchableHighlight>
              </LinearGradient>
            </View>
          </View>
          {this._renderMessageModal()}        
        </View>
        </KeyboardAwareScrollView>
      );
    }
    onSendInvite = () => {
      console.log("onSendInvite")
      console.log(this.state);
       this.setState({
        showMessageWindow: true,
      })
      
    }
    onCancelMessage = () => {
      console.log("onSendInvite")
      console.log(this.state);
       this.setState({
        showMessageWindow: false,
      })
      
    }
    onSendMessage = () => {
      console.log("onSendInvite")
      console.log(this.state);
    }
    _renderMessageModal() {
    const { showMessageWindow,challangeInputText } = this.state;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (!this.state.showMessageWindow)
    return null
    return (
      <View style={styles.modalContainer}>
        <View style={styles.window}>
          <View style={{width:"100%",height:40,flexDirection:"row",justifyContent:"center",alignItems:"center",marginBottom:20}}>
          <View style={{height:"100%",width:60,justifyContent:"center",alignItems:"center"}}>
          </View>
          <View style={{height:"100%",flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text allowFontScaling={false} style={{...styles.messageBoxTitleText,width: "100%"}}>New Text Message</Text>
          </View>
          <View style={{height:"100%",width:60,justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity style={{justifyContent:"center",alignItems:"center",width:"100%",height:"100%"}} onPress={() => this.onCancelMessage()}>
              <Text allowFontScaling={false} style={{...styles.messageBoxTitleText,fontSize: 10,fontWeight: "normal",width: "100%",marginRight:20,color: colorNew.boxGrey}}>CANCEL</Text>
            </TouchableOpacity>
          </View>
          </View>
          <View style={{width:"100%",height:1,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:colorNew.boxGrey}} />
          <View style={{width:"100%",height:50,flexDirection:"row",justifyContent:"flex-start",alignItems:"center",flexDirection:"row"}}>
            <Text allowFontScaling={false} style={{...styles.messageBoxToText,fontSize: 12,fontWeight: "normal",marginLeft:20,color: colorNew.boxGrey}}>To:</Text>
            <Text allowFontScaling={false} style={{...styles.messageBoxToText,fontSize: 12,fontWeight: "normal",marginLeft:5,color: "#000"}}>Amanda Scott</Text>
          </View>
          <View style={{width:"100%",height:1,flexDirection:"row",justifyContent:"center",alignItems:"center",marginBottom:20,backgroundColor:colorNew.boxGrey}} />
          <View style={{...styles.dialogueOuter}}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={colors}
              style={{...styles.dialogue,marginTop:"7.5%",justifyContent: "center",borderWidth: 0}}>
              <Text allowFontScaling={false} style={{...styles.modalHeaderText,color: "#fff",fontSize: 13,fontWeight: "700",fontStyle: "normal",letterSpacing: 3}}>LOVE SWEATE FITNESS</Text>
              <Text allowFontScaling={false} style={{...styles.infoMiddleText,padding:10,color: "#fff",fontSize: 30,fontWeight: "500"}}>CHALANGE{'\n'}LOGO HERE</Text>
              <Text allowFontScaling={false} style={{...styles.infoBottomText,color: "#fff"}}>6 WEEK FITNESS CHALANGE</Text>              
            </LinearGradient>
            <TextInput
            multiline
            style={{ height: 100, borderColor: 'gray',marginTop:10, borderWidth: 0,width:"90%",fontSize: 12}}
            placeholder={"Join me for the Love Sweate Fitness Summer Shape Up Challange!. It's 8 week of workouts, receipes, and motivation! The best part is, it's free! Join here: www.lovesweatfitness.com/SummerShapeUp"}
            placeholderTextColor={color.black}
            onChangeText={challangeInputText => { this.setState({ challangeInputText }) }}>{challangeInputText}</TextInput>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
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
  waterBottoleSelectedText: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.textPink,
    textDecorationLine: 'underline', 
    fontSize: 16, 
    fontWeight: 'normal', 
    textAlign: 'center',
    width:"100%",
    padding:0
  },
  waterBottoleNormalText: { 
    fontFamily: 'Sofia Pro', 
    color: '#000', 
    fontSize: 15, 
    fontWeight: 'normal', 
    textAlign: 'center',
    width:"100%",
    padding:0
  },
  titleText: {
    fontFamily: 'Sofia Pro', 
    color: '#000', 
    fontSize: 16, 
    lineHeight: 19, 
    fontWeight: '500', 
    textAlign: 'center',
    width:"100%",
    padding:0
  },
  buttonGradient: {
    width: "70%",
    height: 48,
    marginBottom:20,
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
  linearGradient: {
    width: "100%",
    height: height,
    marginTop:0,
    padding:"8%",
  },
  container: {
    width: "90%",
    flex:1,
    marginLeft:"5%",
    marginTop:"1%",
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  mainTitle: {
    width: "100%",
    height: 120,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center"
  },
  primaryText: {
    width: 120,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    color: "#ffffff",
    marginTop: 12,
    marginLeft: 26
  },
  secondaryText: {
    width: 200,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    color: "#f7f7f7",
    marginLeft: 26,
    marginTop: -2
  },
  priceText: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff"
  },
  priceText2: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff"
  },
  readyText: {
    width: 146,
    height: 26,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 26,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24
  },
  freeWorkoutsText: {
    width: 175,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
    textDecorationLine: "underline"
  },
  legalText: {
    width: "96%",
    height: 200,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black
  },
  legalText2: {
    width: 300,
    height: 54,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  },
  bubbleSelected: {
    padding : 10,
    marginLeft:5,
    height: 35,
    top: 10,
    backgroundColor: color.lightPink,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.lightPink,
    borderWidth: 1
  },
  goalViewContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
    marginTop:30
  },
  planViewContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
    marginTop:15
  },  
  planSaveText: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.white, 
    fontSize: 16,
    letterSpacing: 0, 
    fontWeight: 'bold', 
    textAlign: 'left',
    width:"100%",
    marginLeft:0
  },
  planTitle: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.darkPink, 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'left',
    width:"100%",
    marginLeft:10
  },
  planTitleSelected: { 
    fontFamily: 'Sofia Pro', 
    color: color.white, 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'left',
    width:"100%",
    marginLeft:10
  },
  planSubtitleSelected: { 
    fontFamily: 'Sofia Pro', 
    color: color.white, 
    fontSize: 18, 
    fontWeight: 'normal', 
    textAlign: 'center',
    width:"100%"
  },
  planSubtitle: { 
    fontFamily: 'Sofia Pro', 
    color: colorNew.mediumPink, 
    fontSize: 18, 
    fontWeight: '500', 
    textAlign: 'center',
    width:"100%"
  },
  beforeAfterText: {
    fontFamily: 'Sofia Pro', 
    color: colorNew.bgGrey, 
    fontSize: 14,
    lineHeight: 20, 
    textAlign: 'center',
    fontWeight: '300',
    width:"90%",
    marginTop:25
  },
  planViewSelected: {
    width: '90%',
    backgroundColor:colorNew.darkPink,
    borderRadius: 100
  },
  planView: {
    width: '80%',
    backgroundColor:color.white,
    borderRadius: 100,
    borderColor:colorNew.darkPink,
    borderWidth:1
  },
  progressMainlView: {
    width: '90%',
    height: width*0.98,
    backgroundColor:colorNew.lightPink,
    borderRadius: 20,
    borderColor:colorNew.darkPink,
    borderWidth:2
  },
  progressImageView: {
    width: '100%',
    height: "20%",
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  progressBeforeAfterView: {
    width: '100%',
    height: "68%",
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  progressPhotoView: {
    width: '44%',
    borderRadius: 20,
    borderColor:colorNew.bgGrey,
    borderWidth:1,
    justifyContent: 'center', 
    alignItems: 'center',
    height: "95%",
    backgroundColor:'white'
  },
  modalContainer: {
    width: "100%",
    marginTop:44,
    position:"absolute",
    height: height,
    backgroundColor:'transparent',
    borderTopLeftRadius:40,
    borderTopRightRadius:40
  },
  window: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop:10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius:40,
    borderTopRightRadius:40
  },
  dialogue: {
    width: "85%",
    height: 240,
    borderRadius: 25,
    borderWidth: 2,
    borderColor:colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  dialogueOuter: {
    width: "90%",
    height:height * 0.57,
    borderRadius: 25,
    borderWidth: 2,
    borderColor:colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  infoMiddleText: {
    width: "90%",
    marginTop:0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#828282"
  },
  infoBottomText: {
    width: "90%",
    marginTop:20,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#929292"
  },
  messageBoxToText: {
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink
  },
  messageBoxTitleText: {
    width: "90%",
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink
  },
  modalHeaderText: {
    width: "90%",
    height: "15%",
    marginTop:0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink
  },
  button1: {
    width: width*0.65,
    padding:10,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor:color.mediumPink,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center"
  },
  button1Text: {
    width: "90%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.white
  },
  progressLSFView: {
    width: '100%',
    height: "12%",
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  sendButtonText: {
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
  }
})

export default InviteFriend;