import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { color, colorNew } from "../../modules/styles/theme";
import { LargeButton } from "../../components/common";
import { AsyncStorage } from "react-native";
import Bubble from "../../components/common/Bubble";
import BubbleNew from "../../components/common/BubbleNew";
import LinearGradient from "react-native-linear-gradient";
import {
  self_care_body,
  self_care_goal,
  self_care_mind,
  info_grey,
  self_care_left_arrow,
  ic_back_white,
  cancel_round_cross,
  self_care_right_arrow,
  self_care_add,
  SelfLoveClub,
} from "../../images";
import { CommonFunction } from "../../utils";

const { height, width } = Dimensions.get("window");

const item_for_mind = "mind";
const item_for_body = "body";
const item_for_goal = "goal";

var images = [
  require("./images/selfcareExercise.png"),
  require("./images/selfcareFriendtime.png"),
  require("./images/selfcareTreat.png"),
  require("./images/selfcareFacemask.png"),
  require("./images/selfcareNewoutfit.png"),
  require("./images/selfcareTimeoutside.png"),
];

// var buttonTitles = [
//   "EXERCISE",
//   "FRIEND TIME",
//   "TREAT",
//   "FACE MASK",
//   "NEW OUTFIT",
//   "TIME OUTSIDE"
// ];
var mindButtonTitles = ["DOODLE ANYTHING", "CALL A\nFRIEND", "READ A\nBOOK"];
var bodyButtonTitles = [
  "STRETCH IT\nOUT",
  "BUBBLE\nBATH",
  "GO TO\nSLEEP EARLY",
];
var goalsButtonTitles = ["NEW\nHOBBY", "DAILY\nWORKOUT", "TIME WITH\nFAMILY"];

class SelfCareLog extends Component {
  constructor(props) {
    super(props);

    this._onAddButtonPressed = this._onAddButtonPressed.bind(this);
    this._onCloseButtonPressed = this._onCloseButtonPressed.bind(this);
    // this._renderItem = this._renderItem.bind(this)
    // this._onBubblePressed = this._onBubblePressed.bind(this)

    this._renderItemForMind = this._renderItemForMind.bind(this);
    this._renderItemForBody = this._renderItemForBody.bind(this);
    this._renderItemForGoals = this._renderItemForGoals.bind(this);

    this._onBubblePressedForMind = this._onBubblePressedForMind.bind(this);
    this._onBubblePressedForBody = this._onBubblePressedForBody.bind(this);
    this._onBubblePressedForGoal = this._onBubblePressedForGoal.bind(this);

    this.activities = [];

    this.state = {
      showAddModal: false,
      showInfoModal: false,
      activityValue: "",
      mindDataSource: [
        { title: mindButtonTitles[0], image: self_care_mind },
        { title: mindButtonTitles[1], image: self_care_mind },
        { title: mindButtonTitles[2], image: self_care_mind },
      ],
      bodyDataSource: [
        { title: bodyButtonTitles[0], image: self_care_body },
        { title: bodyButtonTitles[1], image: self_care_body },
        { title: bodyButtonTitles[2], image: self_care_body },
      ],
      goalsDataSource: [
        { title: goalsButtonTitles[0], image: self_care_goal },
        { title: goalsButtonTitles[1], image: self_care_goal },
        { title: goalsButtonTitles[2], image: self_care_goal },
      ],
    };
  }

  _onAddButtonPressed() {
    this.setState({
      showAddModal: true,
    });
  }

  _onCloseButtonPressed() {
    this.setState({
      showAddModal: false,
    });
  }

  _renderInfoModal() {
    const { showInfoModal } = this.state;
    if (!this.state.showInfoModal) return null;
    return (
      <View
        style={{
          ...styles.modalContainerForInfo,
          position: "absolute",
          marginTop: -20,
        }}
      >
        <View style={styles.windowInfo}>
          <View style={{ ...styles.dialogue, justifyContent: "center" }}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                width: 40,
                height: 40,
                marginTop: 10,
                marginEnd: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => this.hideInfo()}
            >
              <Image
                resizeMode="contain"
                style={{ width: 20, height: 20, tintColor: "#b2b2b2" }}
                source={cancel_round_cross}
              />
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              style={{ ...styles.modalHeaderText, marginTop: 0 }}
            >
              SELF CARE DAY
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 14,
                fontWeight: "normal",
                marginBottom: 30,
                marginLeft: "5%",
              }}
            >
              Join the Self Love Club! Self care is about doing things that make
              you feel more like yourself! Whether it's 2 min or 2 hours, do 1
              thing from each self care pillar today.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 5,
                marginLeft: "5%",
              }}
            >
              MIND:
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 14,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
                width: "65%",
              }}
            >
              Relax, clear your mind, and fills up your soul!
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 5,
                marginLeft: "5%",
              }}
            >
              BODY:
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 14,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
                width: "65%",
              }}
            >
              Show your body a little extra love.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 15,
                fontWeight: "bold",
                marginBottom: 5,
                marginLeft: "5%",
              }}
            >
              #GOALS:
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                textAlign: "center",
                fontSize: 14,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
                width: "65%",
              }}
            >
              Do something that gets you one step closer to a goal you have for
              yourself!
            </Text>
            <View
              style={{
                height: 40,
                width: "100%",
                marginLeft: "5%",
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 40,
                  marginRight: 20,
                  marginTop: 0,
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  backgroundColor: colorNew.darkPink,
                  borderColor: colorNew.mediumPink,
                  borderRadius: 20,
                }}
              >
                <TouchableOpacity onPress={() => this.hideInfo()}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.modalHeaderText,
                      color: colorNew.white,
                      fontWeight: "normal",
                      marginTop: 10,
                      height: 30,
                      marginRight: 50,
                      marginLeft: 50,
                    }}
                  >
                    I love Myself!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  showInfo() {
    console.log("showInfo");
    this.setState({
      showInfoModal: true,
    });
  }
  hideInfo() {
    console.log("hideInfo");
    this.setState({
      showInfoModal: false,
    });
  }

  render() {
    const colors = [colorNew.darkPink, colorNew.lightPink];
    // const colors1 = ["#E26D93", "#F7CDD3"];
    const colors1 = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    console.log("CommonFunction.isIphoneXorAbove");
    let isIphoneXorAbove = CommonFunction.isIphoneXorAbove();
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={colors1}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: width,
            backgroundColor: "transparent",
          }}
        >
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <View
              style={{
                width: "100%",
                height: 60,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                marginTop: Platform.OS === "ios" ? 24 : 44,
                marginBottom: isIphoneXorAbove ? 0 : 0,
              }}
            >
              {/*<TouchableOpacity onPress={this.props.onClose} style={{ alignContent: "center", width: 60,height: 60,alignItems:"center",justifyContent:"center"}}>
              <Image resizeMode="contain" style={{width:"100%"}} source={self_care_left_arrow} />
            </TouchableOpacity>*/}
              <TouchableOpacity
                style={{
                  alignContent: "center",
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></TouchableOpacity>
              <View
                style={{
                  width: width - 120,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text allowFontScaling={false} style={styles.headerText}>
                  SELF CARE DAY
                </Text>
                <TouchableOpacity
                  onPress={() => this.showInfo()}
                  style={{
                    alignContent: "center",
                    width: 25,
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{ width: 15, height: 15, tintColor: "#fff" }}
                    source={info_grey}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={this.props.onClose}
                style={{
                  alignContent: "center",
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ width: "100%" }}
                  source={cancel_round_cross}
                />
              </TouchableOpacity>
            </View>
            {this._renderMain()}
          </View>
          {this._renderAddModal()}
          {this._renderInfoModal()}
        </ScrollView>
      </LinearGradient>
    );
  }

  componentDidMount() {
    this._retrieveData();
  }

  _storeData = async () => {
    try {
      const {
        mindDataSource,
        bodyDataSource,
        goalsDataSource,
        activityValue,
        showAddModalFor,
      } = this.state;
      // await AsyncStorage.setItem('ACTIVITIES', JSON.stringify(this.state.dataSource));
      await AsyncStorage.setItem(
        "MINDDATASSOURCE",
        JSON.stringify(this.state.mindDataSource)
      );
      await AsyncStorage.setItem(
        "BODYDATASSOURCE",
        JSON.stringify(this.state.bodyDataSource)
      );
      await AsyncStorage.setItem(
        "GOALSDATASSOURCE",
        JSON.stringify(this.state.goalsDataSource)
      );
    } catch (error) {
      // Error saving data
      console.log(error.stack);
    }
  };

  _retrieveData = async () => {
    console.log("_retrieveData called");
    try {
      const mindDataSourceData = await AsyncStorage.getItem("MINDDATASSOURCE");
      console.log("_retrieveData mindDataSource");
      console.log(mindDataSourceData);
      if (mindDataSourceData !== null) {
        console.log("_retrieveData mindDataSource 1");
        // We have data!!
        const dataCopy = JSON.parse(mindDataSourceData);
        console.log("mindDataSource updated with value");
        console.log(dataCopy);

        this.setState({
          mindDataSource: [...dataCopy],
        });
        console.log("mindDataSource data updated");
      } else {
        console.log("_retrieveData mindDataSource 2");
      }
      const bodyDataSourceData = await AsyncStorage.getItem("BODYDATASSOURCE");
      console.log("_retrieveData bodyDataSource");
      console.log(bodyDataSourceData);
      if (bodyDataSourceData !== null) {
        // We have data!!
        const dataCopy = JSON.parse(bodyDataSourceData);

        this.setState({
          bodyDataSource: [...dataCopy],
        });
      }
      const goalsDataSourceData = await AsyncStorage.getItem(
        "GOALSDATASSOURCE"
      );
      console.log("_retrieveData goalsDataSource");
      console.log(goalsDataSourceData);

      if (goalsDataSourceData !== null) {
        // We have data!!
        const dataCopy = JSON.parse(goalsDataSourceData);

        this.setState({
          goalsDataSource: [...dataCopy],
        });
      }
    } catch (error) {
      console.log("_retrieveData error in parsing");
      console.log(error);
      console.log(error.stack);
    }
  };

  _renderMain() {
    let rowHight = 105;
    let marginTopForRow = 25;
    return (
      <View style={{ width: width, flex: 1 }}>
        <View
          style={{
            height: height * 0.27,
            justifyContent: "space-between",
            alignItems: "space-between",
          }}
        >
          <Image
            resizeMode="contain"
            style={{
              width: "100%",
              height: height * 0.2,
              marginTop: height * 0.03,
            }}
            source={SelfLoveClub}
          />
        </View>
        <View
          style={{
            width: "100%",
            height: rowHight * 4,
            justifyContent: "center",
            alignItems: "space-between",
            marginTop: 0,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{ ...styles.mainText, height: 18, marginTop: 25 }}
          >
            MIND
          </Text>
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: rowHight,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 10,
                alignContent: "center",
                width: "5%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%" }}
                source={self_care_left_arrow}
              />
            </TouchableOpacity>
            {this._renderGrid(item_for_mind)}
            <TouchableOpacity
              style={{
                marginRight: 10,
                alignContent: "center",
                width: "5%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%" }}
                source={self_care_right_arrow}
              />
            </TouchableOpacity>
          </View>
          <Text
            allowFontScaling={false}
            style={{ ...styles.mainText, height: 18, marginTop: 25 }}
          >
            BODY
          </Text>
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: rowHight,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 10,
                alignContent: "center",
                width: "5%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%" }}
                source={self_care_left_arrow}
              />
            </TouchableOpacity>
            {this._renderGrid(item_for_body)}
            <TouchableOpacity
              style={{
                marginRight: 10,
                alignContent: "center",
                width: "5%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%" }}
                source={self_care_right_arrow}
              />
            </TouchableOpacity>
          </View>
          <Text
            allowFontScaling={false}
            style={{ ...styles.mainText, height: 18, marginTop: 25 }}
          >
            GOALS
          </Text>
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              height: rowHight,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 10,
                alignContent: "center",
                width: "5%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%" }}
                source={self_care_left_arrow}
              />
            </TouchableOpacity>
            {this._renderGrid(item_for_goal)}
            <TouchableOpacity
              style={{
                marginRight: 10,
                alignContent: "center",
                width: "5%",
                height: "60%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: "100%" }}
                source={self_care_right_arrow}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/*<View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width }}>
          <TouchableOpacity style={styles.button} onPress={this._onAddButtonPressed}>
            <Image source={require("./images/addButton.png")} />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.addText}>ADD YOUR OWN</Text>
        </View>*/}
        <View style={styles.btnView}>
          <LargeButton onPress={this._logPressed}>
            <Text allowFontScaling={false} style={styles.btnText}>
              Log Self Care
            </Text>
          </LargeButton>
        </View>
        <View style={{ marginTop: 30, marginBottom: 30 }}>
          {/*this._renderSkipBtn()*/}
        </View>
      </View>
    );
  }

  _renderSkipBtn() {
    const { onSkipPress } = this.props;
    if (onSkipPress) {
      return (
        <LargeButton onPress={onSkipPress}>
          <Text allowFontScaling={false} style={styles.btnText}>
            SKIP
          </Text>
        </LargeButton>
      );
    }

    return null;
  }

  _logPressed = () => {
    const { onLogPressed } = this.props;
    const { activities } = this;
    if (activities.length === 0) {
      alert("Choose an activity to log");
    } else {
      console.log("_logPressed");
      var SampleText = activities.join(",");
      console.log(SampleText);
      var NewText = SampleText.replace("\n", " ");
      while (NewText.includes("\n")) {
        NewText = NewText.replace("\n", " ");
      }
      console.log(NewText);
      const data = { activities: NewText };
      onLogPressed(data);
    }
  };

  _onBubblePressedForMind = (title) => {
    if (title == "ADD YOUR\nOWN") {
      console.log("Pressed on add your own _onBubblePressedForMind");
      this.setState({
        showAddModal: true,
        showAddModalFor: item_for_mind,
      });
    } else {
      if (this.activities.includes(title)) {
        const filteredItems = this.activities.filter(function (item) {
          return item !== title;
        });
        this.activities = filteredItems;
      } else {
        this.activities.push(title);
      }
    }

    console.log(this.activities);
  };
  _onBubblePressedForBody = (title) => {
    if (title == "ADD YOUR\nOWN") {
      console.log("Pressed on add your own _onBubblePressedForBody");
      this.setState({
        showAddModal: true,
        showAddModalFor: item_for_body,
      });
    } else {
      if (this.activities.includes(title)) {
        const filteredItems = this.activities.filter(function (item) {
          return item !== title;
        });
        this.activities = filteredItems;
      } else {
        this.activities.push(title);
      }
    }

    console.log(this.activities);
  };
  _onBubblePressedForGoal = (title) => {
    if (title == "ADD YOUR\nOWN") {
      console.log("Pressed on add your own _onBubblePressedForGoal");
      this.setState({
        showAddModal: true,
        showAddModalFor: item_for_goal,
      });
    } else {
      if (this.activities.includes(title)) {
        const filteredItems = this.activities.filter(function (item) {
          return item !== title;
        });
        this.activities = filteredItems;
      } else {
        this.activities.push(title);
      }
    }

    console.log(this.activities);
  };

  _renderItemForMind({ item, index }) {
    return (
      <View style={styles.listItem}>
        <BubbleNew
          title={item.title}
          imagesource={item.image}
          action={this._onBubblePressedForMind}
        />
      </View>
    );
  }
  _renderItemForBody({ item, index }) {
    return (
      <View style={styles.listItem}>
        <BubbleNew
          title={item.title}
          imagesource={item.image}
          action={this._onBubblePressedForBody}
        />
      </View>
    );
  }
  _renderItemForGoals({ item, index }) {
    return (
      <View style={styles.listItem}>
        <BubbleNew
          title={item.title}
          imagesource={item.image}
          action={this._onBubblePressedForGoal}
        />
      </View>
    );
  }

  _renderGrid(gridFor) {
    let data =
      gridFor == "mind"
        ? this.state.mindDataSource
        : gridFor == "body"
        ? this.state.bodyDataSource
        : this.state.goalsDataSource;
    const dataCopy = data;
    var isAddYourOwnAdded = false;
    for (let data of dataCopy) {
      if (data.title == "ADD YOUR\nOWN") {
        isAddYourOwnAdded = true;
        break;
      }
    }
    if (isAddYourOwnAdded == false) {
      dataCopy.push({ title: "ADD YOUR\nOWN", image: self_care_add });
    }
    // return (
    //       <FlatList
    //         horizontal={true}
    //         extraData={this.state}
    //         showsHorizontalScrollIndicator={false}
    //         style={{width: "100%",marginTop:0,marginBottom:5}}
    //         data={dataCopy}
    //         renderItem={gridFor == "mind" ? this._renderItemForMind : gridFor == "body" ? this._renderItemForBody : this._renderItemForGoals}
    //         keyExtractor={(item, index) => item.title}
    //       />
    // );
    return (
      <View
        style={{ marginTop: 0, marginBottom: 5, flexDirection: "row", flex: 1 }}
      >
        {dataCopy.map((item, index) => {
          if (gridFor == "mind") {
            return (
              <View style={styles.listItem}>
                <BubbleNew
                  title={item.title}
                  imagesource={item.image}
                  action={this._onBubblePressedForMind}
                />
              </View>
            );
          } else if (gridFor == "body") {
            return (
              <View style={styles.listItem}>
                <BubbleNew
                  title={item.title}
                  imagesource={item.image}
                  action={this._onBubblePressedForBody}
                />
              </View>
            );
          } else {
            return (
              <View style={styles.listItem}>
                <BubbleNew
                  title={item.title}
                  imagesource={item.image}
                  action={this._onBubblePressedForGoal}
                />
              </View>
            );
          }
        })}
      </View>
    );
  }

  _saveText = () => {
    const {
      mindDataSource,
      bodyDataSource,
      goalsDataSource,
      activityValue,
      showAddModalFor,
    } = this.state;
    const gridFor = showAddModalFor;
    let dataCopy =
      gridFor == item_for_mind
        ? this.state.mindDataSource
        : gridFor == item_for_body
        ? this.state.bodyDataSource
        : this.state.goalsDataSource;
    let dataImage =
      gridFor == item_for_mind
        ? self_care_mind
        : gridFor == item_for_body
        ? self_care_body
        : self_care_goal;
    if (dataCopy.length > 0) {
      dataCopy[dataCopy.length - 1] = {
        title: activityValue,
        image: dataImage,
      };
    } else {
      dataCopy.push({ title: activityValue, image: dataImage });
    }

    this.setState({
      showAddModal: false,
      mindDataSource: gridFor == item_for_mind ? dataCopy : mindDataSource,
      bodyDataSource: gridFor == item_for_body ? dataCopy : bodyDataSource,
      goalsDataSource: gridFor == item_for_goal ? dataCopy : goalsDataSource,
      activityValue: "",
    });
    this._storeData();
  };

  _renderAddModal() {
    const { showAddModal, window, container, activityValue } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showAddModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => ""}
        >
          <View style={styles.window}>
            <View style={styles.container}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: -20,
                  marginEnd: -10,
                }}
                onPress={this._onCloseButtonPressed}
              >
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalText}>
                Add Your Own
              </Text>
              <TextInput
                style={{
                  marginLeft: 20,
                  marginTop: 50,
                  height: 46,
                  width: "90%",
                  justifyContent: "center",
                  borderTopColor: "#ffffff",
                  borderLeftColor: "#ffffff",
                  borderRightColor: "#ffffff",
                  borderBottomColor: "#d8d8d8",
                  borderWidth: 1,
                }}
                placeholder={"How do you self care?"}
                placeholderTextColor={"#ddd"}
                onChangeText={(activityValue) => {
                  this.setState({ activityValue });
                }}
              >
                {activityValue}
              </TextInput>
              <View style={{ marginTop: 40 }}>
                <LargeButton
                  style={{ marginTop: 40, backgroundColor: color.mediumPink }}
                  onPress={this._saveText}
                >
                  <Text>SAVE</Text>
                </LargeButton>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
  mainText: {
    width: "100%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#fff",
    marginTop: 15,
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#fff",
    justifyContent: "center",
  },
  polaroid: {
    width: "100%",
    height: 345,
    justifyContent: "center",
  },
  btnView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  btnText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  addText: {
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 20,
  },
  list: {
    alignItems: "center",
    justifyContent: "center",
    width: width - 80,
  },
  listItem: {
    flex: 1,
    // margin: 8,
    marginTop: 10,
    // minWidth: width * .175,
    // maxWidth: width * .175,
    // maxHeight: width * .19,
    width: width * 0.2,
    height: width * 0.2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  window: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "90%",
    height: 300,
    backgroundColor: "#fff",
  },
  modalText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    textAlign: "center",
  },
  modalContainerForInfo: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 0,
    height: height,
    width: width,
  },
  windowInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bfbfbf80",
    height: "100%",
    width: "100%",
  },
  dialogue: {
    width: "90%",
    height: 500,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  modalHeaderText: {
    width: "90%",
    height: "8%",
    marginTop: 20,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  infoMiddleText: {
    width: "80%",
    marginTop: 0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#828282",
  },
  infoMiddleTitleText: {
    width: "80%",
    marginTop: 0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#828282",
  },
  roundButtonText: {
    width: 90,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
    marginTop: 12,
  },
});

export default SelfCareLog;
