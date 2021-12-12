import React, { Component } from "react";
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Dimensions } from "react-native";
import { color } from "../../modules/styles/theme";
import { LargeButton } from "../../components/common";
import { AsyncStorage } from 'react-native';
import Bubble from "../../components/common/Bubble"

const { height, width } = Dimensions.get("window");

var images = [
  require('./images/selfcareExercise.png'),
  require('./images/selfcareFriendtime.png'),
  require('./images/selfcareTreat.png'),
  require('./images/selfcareFacemask.png'),
  require('./images/selfcareNewoutfit.png'),
  require('./images/selfcareTimeoutside.png')];

var buttonTitles = [
  "EXERCISE",
  "FRIEND TIME",
  "TREAT",
  "FACE MASK",
  "NEW OUTFIT",
  "TIME OUTSIDE"
];


class SelfCareLog extends Component {

  constructor(props) {
    super(props);

    this._onAddButtonPressed = this._onAddButtonPressed.bind(this);
    this._onCloseButtonPressed = this._onCloseButtonPressed.bind(this);
    this._renderItem = this._renderItem.bind(this)
    this._onBubblePressed = this._onBubblePressed.bind(this)

    this.activities = []

    this.state = {
      showAddModal: false,
      activityValue: "",
      dataSource: [
        { title: buttonTitles[0], image: images[0] },
        { title: buttonTitles[1], image: images[1] },
        { title: buttonTitles[2], image: images[2] },
        { title: buttonTitles[3], image: images[3] },
        { title: buttonTitles[4], image: images[4] },
        { title: buttonTitles[5], image: images[5] }
      ]
    };
  }

  _onAddButtonPressed() {

    this.setState({
      showAddModal: true

    });
  }

  _onCloseButtonPressed() {
    this.setState({
      showAddModal: false
    });
  }

  render() {
    return (
      <ScrollView>
        {this._renderMain()}
        {this._renderAddModal()}
      </ScrollView>
    );
  }

  componentDidMount() {

    this._retrieveData()
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('ACTIVITIES', JSON.stringify(this.state.dataSource));
    } catch (error) {
      // Error saving data
      console.log(error.stack);
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('ACTIVITIES');
      if (value !== null) {
        // We have data!!
        const dataCopy = JSON.parse(value)

        this.setState({
          dataSource: dataCopy
        })
      }
    } catch (error) {
      console.log(error.stack);
    }
  }

  _renderMain() {

    return (
      <View>
        <Text allowFontScaling={false} style={styles.mainText}>What are you doing?</Text>
        <View style={{ alignContent: "center", textAlign: "center" }}>
          {this._renderGrid()}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width }}>
          <TouchableOpacity style={styles.button} onPress={this._onAddButtonPressed}>
            <Image source={require("./images/addButton.png")} />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.addText}>ADD YOUR OWN</Text>
        </View>
        <View style={styles.btnView}>
          <LargeButton
            onPress={this._logPressed}>
            <Text allowFontScaling={false} style={styles.btnText}>LOG IT</Text>
          </LargeButton>
        </View>

        <View style={{ marginTop: 30, marginBottom: 30 }}>
          {this._renderSkipBtn()}
        </View>
      </View>
    );
  }

  _renderSkipBtn() {
    const { onSkipPress } = this.props;
    if (onSkipPress) {
      return (
        <LargeButton
          onPress={onSkipPress}>
          <Text allowFontScaling={false} style={styles.btnText}>SKIP</Text>
        </LargeButton>
      );
    }

    return null
  }

  _logPressed = () => {
    const { onLogPressed } = this.props;
    const { activities } = this;
    if (activities.length === 0) {
      alert("Choose an activity to log");
    } else {
      const data = { activities: activities.join(",") };
      onLogPressed(data);
    }
  };

  _onBubblePressed = (title) => {

    if (this.activities.includes(title)) {
      const filteredItems = this.activities.filter(function (item) {
        return item !== title
      })
      this.activities = filteredItems
    } else {
      this.activities.push(title)
    }

    console.log(this.activities)
  }

  _renderItem({ item, index }) {

    return (<View style={styles.listItem}>
      <Bubble title={item.title} imagesource={item.image} action={this._onBubblePressed} />
    </View>);
  }

  _renderGrid() {

    return (<FlatList
      numColumns={3}
      style={{ height: height * 0.5 }}
      contentContainerStyle={styles.list}
      data={this.state.dataSource}
      renderItem={this._renderItem}
      keyExtractor={(item, index) => item.title}
    />);

  }

  _saveText = () => {

    const { dataSource, activityValue } = this.state

    const dataCopy = dataSource
    dataCopy.push({ title: activityValue, image: activityValue })

    this.setState({
      showAddModal: false,
      dataSource: dataSource,
      activityValue: ""

    })

    this._storeData()

  }

  _renderAddModal() {
    const { showAddModal, window, container, activityValue } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showAddModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => ""}>
          <View style={styles.window}>
            <View style={styles.container}>
              <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -20, marginEnd: -10 }} onPress={this._onCloseButtonPressed}>
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalText}>Add Your Own</Text>
              <TextInput
                style={{
                  marginLeft: 20,
                  marginTop: 50,
                  height: 46, width: "90%",
                  justifyContent: "center",
                  borderTopColor: '#ffffff',
                  borderLeftColor: '#ffffff',
                  borderRightColor: '#ffffff',
                  borderBottomColor: "#d8d8d8",
                  borderWidth: 1
                }}
                placeholder={"How do you self care?"}
                placeholderTextColor={"#ddd"}
                onChangeText={(activityValue) => { this.setState({ activityValue }) }}>{activityValue}</TextInput>
              <View style={{ marginTop: 40 }}>
                <LargeButton style={{ marginTop: 40 }}
                  onPress={this._saveText}>
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
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  mainText: {
    width: "100%",
    height: 80,
    fontFamily: "Northwell",
    fontSize: 38,
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
  },
  btnView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
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
  addText: {
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 20
  },
  list: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: 'column',
    width: width,
  },
  listItem: {
    margin: 5,
    marginTop: 10,
    minWidth: width * .29,
    maxWidth: width * .29,
    height: width * .29,
    maxHeight: width * .29
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  window: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    width: "90%",
    height: 300,
    backgroundColor: "#fff"
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
    textAlign: "center"
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
    marginTop: 12
  }


})

export default SelfCareLog;
