import React, { Component } from "react";
import { View, TouchableOpacity, Text, ImageBackground, Image, SectionList, Dimensions, Modal } from "react-native";
import { connect } from "react-redux";
import { saveCompletedWorkout } from "../../../../actions";
import { color } from "../../../../modules/styles/theme";
import SelfCareLog from "../../../SelfCareLog"
import { User } from "../../../../DataStore";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import { LoadingComponent } from "../../../../components/common";
import CompletionModal from '../../../Workouts/CompletionModalStack'
import { withNavigation } from 'react-navigation'

const { width } = Dimensions.get("window");


const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return s;
};

class MyWeek extends Component {

  constructor(props) {
    super(props)

    this.addToCalendar = this.addToCalendar.bind(this)

    this.state = {
      showSelfCareModal: false,
      selfCareItem: null,
      selfLoveData: null,
      showCompletionModal: false
    };

  }

  openSelfCareModal(item) {
    this.setState({
      showSelfCareModal: true,
      selfCareItem: item
    });
  }

  closeModal = () => {
    this.setState({
      showSelfCareModal: false
    })
  }

  renderSelfCareModal() {

    const { showSelfCareModal, selfCareItem, showCompletionModal } = this.state

    return (
      <View>
        <SelfCareLog
          visible={showSelfCareModal}
          onClose={this.closeModal}
          onLogPressed={this._pushDataUpToState}
          itemData={selfCareItem}
        />
        <CompletionModal
          start={showCompletionModal}
          title={'Self Care'}
          screenAfterWorkout={'My Week'}
          onStackComplete={this._onCompletionFlowEnd}
        />
      </View>
    );
  }

  _pushDataUpToState = (data) => {
    this.setState({ selfLoveData: data, showCompletionModal: true, showSelfCareModal: false }, () => console.log(this.state))
  }

  _onCompletionFlowEnd = (screenName, props) => {

    const { selfLoveData } = this.state;

    this._saveSelfCareLog(selfLoveData)
    this.setState({ showCompletionModal: false, selfLoveData: null })

    if (screenName) this.props.navigation.navigate(screenName, props);
  }

  _saveSelfCareLog = (data) => {
    console.log('save self care log', data);
    User.saveSelfCareLog(data)
      .catch(err => console.log(err.stack));

    const { selfCareItem } = this.state;

    this.props.saveCompletedWorkout(selfCareItem);
  }


  addToCalendar = (title, startDateUTC) => {
    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
      notes: "Love Sweat Fitness" + title,
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {

        console.warn(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  render() {

    const { dataSource, onWorkoutPressed, headerComponent: WeekDayHeader } = this.props;
    const { today, upcomming, completed } = dataSource;
    const nowUTC = moment.utc();

    return (
      <View style={{ flex: 1, width: "100%", backgroundColor: "#fff" }}>
        {this.renderSelfCareModal()}
        <WeekDayHeader />
        <SectionList
          style={{ flex: 1 }}
          sections={[
            { title: "TODAY", data: [{...today, isToday: true}] },
            { title: "UPCOMING", data: upcomming },
            { title: "COMPLETED", data: completed }
          ]}
          keyExtractor={(item, idx) => idx}
          renderSectionHeader={({ section }) => {

            if (section.title === "TODAY") {
              return (
                <View style={styles.sectionHeader}>
                  <Image source={require("./images/today.png")} />
                </View>
              );
            } else if (section.title === "UPCOMING") {
              return (
                <View style={styles.sectionHeader}>
                  <Image source={require("./images/upcoming.png")} />
                </View>
              );
            }

            return (
              <View style={styles.sectionHeader}>
                <Image source={require("./images/completed.png")} />
              </View>
            );
          }}

          renderItem={({ item }) => {

            if (!item) {
              return <LoadingComponent />;
            }

            let onPress
            if (item.primaryType === "Rest") {
              onPress = () => this.openSelfCareModal(item);
            } else {
              onPress = () => onWorkoutPressed(item);
            }

            return (
              <View style={{ flex: 1, width: "100%", height: 130, backgroundColor: color.lightPink, marginBottom: item.index === 1 ? 0 : 20 }}>
                <TouchableOpacity activeOpacity={1} onPress={onPress}>
                  <ImageBackground
                    resizeMode="cover"
                    style={{ width: "100%", height: "100%" }}
                    source={{ uri: item.imageUrl }}>
                    <View style={styles.overlay}></View>
                    <View style={{ flexDirection: "row", marginTop: 15, marginLeft: width * .89, justifyContent: "space-around", alignItems: "flex-end" }}>
                      <TouchableOpacity
                      onPress={()=> {this.addToCalendar(item.description, nowUTC)}}>
                        <Image source={require("./images/iconCalendarWhite.png")} />
                      </TouchableOpacity>
                    </View>
                    <Text allowFontScaling={false} style={styles.cardText}>{item.description ? item.description.toUpperCase() : ""}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  }

};

export default connect(null, { saveCompletedWorkout })(withNavigation(MyWeek));

const styles = {
  cardText: {
    width: 220,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: "left",
    color: "#ffffff",
    marginLeft: 20,
    marginTop: 60
  },
  sectionHeader: {
    width: "100%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingBottom: 20

  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: "rgba(147, 122, 132, 0.30)",
    width: width,
    height: 130
  }

};
